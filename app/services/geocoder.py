"""
Free address -> lat/long lookup for Indian bank addresses (OpenStreetMap: Nominatim + Photon).

Bank addresses rarely carry coordinates and OSM rarely knows individual societies, so the
lookup works from coarse to fine:
  1. Anchor  - the 6-digit pincode area (reliable in OSM), else the locality / city.
  2. Refine  - landmark ("Near/Opp. ..."), society or locality names. A refined hit is accepted
               only if its name really matches and it lies close to the anchor, because fuzzy
               OSM search happily returns a same-named temple in another state or country.
The result carries a precision level so the CA knows how much to trust the pin.
"""
import asyncio
import logging
import math
import re
import time
from typing import Dict, List, Optional, Tuple

import httpx

logger = logging.getLogger(__name__)

NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
PHOTON_URL = "https://photon.komoot.io/api/"
# OSM usage policy: identify the application; Nominatim allows at most 1 request per second.
USER_AGENT = "NaimishShahCA-DueDiligence/1.0 (+https://duedeligence-production.up.railway.app)"

# How far a landmark hit may lie from the area it was searched in, by how precise that area is.
MAX_REFINE_KM = {"LOCALITY": 3.0, "PINCODE": 6.0, "CITY": 10.0}
MAX_LOCALITY_FROM_PINCODE_KM = 8.0

# Coordinates the portal used as defaults before geocoding existed. A case still holding one
# of these has no real benchmark, so it is safe to replace with a geocoded location.
PLACEHOLDER_COORDS = {(23.1030, 72.5350), (23.2156, 72.6369)}

PRECISION_INFO = {
    "LANDMARK": "Landmark / society match (approx. ±100-300 m) - confirm the exact building",
    "LOCALITY": "Locality / area match (approx. ±1-2 km) - drag pin onto the building",
    "PINCODE": "Pincode area centre (approx. ±3-5 km) - drag pin onto the building",
    "CITY": "City / town only - pin must be placed manually",
    "CA_VERIFIED": "Benchmark placed by CA on the satellite map",
}

_LANDMARK_PREFIX = re.compile(
    r"^\s*(near|nr\.?|opp\.?|opposite|behind|b/h|beside|besides|next to|in front of|o/p)\s+",
    re.IGNORECASE,
)
_PINCODE = re.compile(r"\b([1-9]\d{5})\b")
_UNIT_ONLY = re.compile(
    r"^(flat|plot|house|h\.?|block|shop|office|survey|s\.?|r\.?\s*s\.?|unit|door|room)?\s*(no\.?|number|#)?[\s.:#-]*[\w/-]*\d[\w/-]*$",
    re.IGNORECASE,
)
# Kinds of place. When the wanted name says what kind of place it is, the OSM hit must be the same
# kind - otherwise "Gayatri Temple" matches "Gayatri Hospital" and "Shivalik Residency" matches
# "Shivalik Greenview".
_PLACE_KINDS = [
    {"society", "soc", "residency", "apartment", "apartments", "appt", "flats", "bunglows", "bungalows",
     "bunglow", "bungalow", "tenament", "tenaments", "tenements", "heights", "enclave", "towers",
     "tower", "residential", "duplex", "villa", "villas", "homes", "avenue", "row"},
    {"temple", "mandir", "derasar", "jinalaya", "church", "masjid", "mosque", "dargah", "gurudwara", "worship"},
    {"hospital", "clinic", "dispensary", "healthcare", "health"},
    {"school", "vidyalaya", "college", "university", "academy"},
    {"canal", "river", "lake", "talav", "pond", "nala"},
    {"station", "railway", "depot", "bus", "stand"},
    {"bank"},
    {"road", "rd", "marg", "street", "lane", "highway"},
]
# Words that say what kind of place something is, not which place - ignored as name keys.
_GENERIC_WORDS = set().union(*_PLACE_KINDS) | {
    "park", "nagar", "complex", "colony", "vihar", "vas", "near", "opp", "the", "and", "of",
    "char", "rasta", "chowk", "cross", "circle", "main", "new", "old", "plaza", "city", "sector",
    "survey", "plot", "block", "flat", "house", "shop", "office", "no",
}
_REGION_WORDS = {"gujarat", "india", "maharashtra", "rajasthan"}

_cache: Dict[str, Optional[dict]] = {}
_nominatim_lock = asyncio.Lock()
_last_nominatim_call = 0.0


def is_placeholder(lat: Optional[float], lon: Optional[float]) -> bool:
    if lat is None or lon is None:
        return True
    return any(abs(lat - p[0]) < 1e-4 and abs(lon - p[1]) < 1e-4 for p in PLACEHOLDER_COORDS)


def _km(a: Tuple[float, float], b: Tuple[float, float]) -> float:
    dlat = math.radians(b[0] - a[0])
    dlon = math.radians(b[1] - a[1])
    h = math.sin(dlat / 2) ** 2 + math.cos(math.radians(a[0])) * math.cos(math.radians(b[0])) * math.sin(dlon / 2) ** 2
    return 6371.0 * 2 * math.atan2(math.sqrt(h), math.sqrt(1 - h))


def _key_words(text: str) -> List[str]:
    words = re.findall(r"[a-z]+", (text or "").lower())
    return [w for w in words if len(w) > 2 and w not in _GENERIC_WORDS]


def _name_matches(wanted: str, found: str, found_kind: str = "") -> bool:
    """Every distinctive word of the wanted name must appear in the found name, and when the
    wanted name states a kind of place (temple, society...) the hit must be that kind too."""
    keys = _key_words(wanted)
    found_l = (found or "").lower()
    if not keys or not all(re.search(rf"\b{re.escape(k)}", found_l) for k in keys):
        return False
    wanted_words = set(re.findall(r"[a-z]+", wanted.lower()))
    found_words = set(re.findall(r"[a-z]+", f"{found_l} {(found_kind or '').lower()}"))
    for kind in _PLACE_KINDS:
        if wanted_words & kind and not found_words & kind:
            return False
    return True


def parse_address(address: str) -> dict:
    """Split a bank address into pincode, city, localities and landmark / society names."""
    text = (address or "").replace("\n", ", ")
    pin_match = _PINCODE.search(text)
    pincode = pin_match.group(1) if pin_match else None
    text = _PINCODE.sub(" ", text)

    parts = []
    for raw in re.split(r"[,;]", text):
        p = re.sub(r"\s+", " ", raw).strip(" -.")
        if not p or p.lower() in _REGION_WORDS:
            continue
        # "Ahmedabad-382225" style suffixes leave a trailing dash; "Dist. Ahmedabad" prefixes too.
        p = re.sub(r"^(dist\.?|district|ta\.?|taluka|at\.?\s*&?\s*po\.?|at|po)\s+", "", p, flags=re.IGNORECASE).strip(" -.")
        if p and not _UNIT_ONLY.match(p):
            parts.append(p)

    landmarks, names = [], []
    for p in parts:
        if _LANDMARK_PREFIX.match(p):
            landmarks.append(_LANDMARK_PREFIX.sub("", p).strip())
        else:
            names.append(p)

    city = names[-1] if names else None
    localities = names[:-1]
    return {"pincode": pincode, "city": city, "localities": localities, "landmarks": landmarks}


async def _nominatim(params: dict) -> List[dict]:
    global _last_nominatim_call
    key = "N|" + "|".join(f"{k}={v}" for k, v in sorted(params.items()))
    if key in _cache:
        return _cache[key] or []
    async with _nominatim_lock:
        wait = 1.05 - (time.monotonic() - _last_nominatim_call)
        if wait > 0:
            await asyncio.sleep(wait)
        try:
            async with httpx.AsyncClient(timeout=8.0, headers={"User-Agent": USER_AGENT}) as client:
                res = await client.get(NOMINATIM_URL, params={
                    "format": "jsonv2", "countrycodes": "in", "limit": 3, "addressdetails": 1, **params,
                })
                data = res.json() if res.status_code == 200 else []
        except Exception as exc:
            logger.warning("Nominatim lookup failed: %s", exc)
            data = []
        finally:
            _last_nominatim_call = time.monotonic()
    _cache[key] = data
    return data


async def _photon(query: str, near: Tuple[float, float]) -> List[dict]:
    key = f"P|{query}|{near[0]:.3f},{near[1]:.3f}"
    if key in _cache:
        return _cache[key] or []
    try:
        async with httpx.AsyncClient(timeout=8.0, headers={"User-Agent": USER_AGENT}) as client:
            res = await client.get(PHOTON_URL, params={"q": query, "limit": 5, "lat": near[0], "lon": near[1]})
            data = res.json().get("features", []) if res.status_code == 200 else []
    except Exception as exc:
        logger.warning("Photon lookup failed: %s", exc)
        data = []
    _cache[key] = data
    return data


def _result(lat: float, lon: float, precision: str, matched: str, label: str) -> dict:
    return {
        "lat": round(lat, 6),
        "lon": round(lon, 6),
        "precision": precision,
        "precision_note": PRECISION_INFO[precision],
        "matched": matched,
        "display_name": label,
    }


async def geocode_address(address: str) -> Optional[dict]:
    """Best-effort location for a bank address, or None when nothing trustworthy is found."""
    if not address or not address.strip():
        return None
    parsed = parse_address(address)
    pincode, city = parsed["pincode"], parsed["city"]
    area_hint = city or ""

    # 1. Anchor: pincode area, else most specific locality that OSM knows, else the city.
    anchor = None
    if pincode:
        hits = await _nominatim({"postalcode": pincode, "country": "India"})
        if hits:
            h = hits[0]
            anchor = _result(float(h["lat"]), float(h["lon"]), "PINCODE", f"PIN {pincode}", h.get("display_name", ""))

    locality_hit = None
    for loc in reversed(parsed["localities"][-2:]):
        hits = await _nominatim({"q": f"{loc}, {area_hint}" if area_hint else loc})
        for h in hits:
            pt = (float(h["lat"]), float(h["lon"]))
            if anchor and _km(pt, (anchor["lat"], anchor["lon"])) > MAX_LOCALITY_FROM_PINCODE_KM:
                continue
            if not _name_matches(loc, h.get("display_name", ""), f"{h.get('category', '')} {h.get('type', '')}"):
                continue
            locality_hit = _result(pt[0], pt[1], "LOCALITY", loc, h.get("display_name", ""))
            break
        if locality_hit:
            break

    if not anchor and not locality_hit and city:
        hits = await _nominatim({"q": city})
        if hits:
            h = hits[0]
            anchor = _result(float(h["lat"]), float(h["lon"]), "CITY", city, h.get("display_name", ""))

    base = locality_hit or anchor
    if not base:
        return None

    # 2. Refine with landmark / society names, accepted only near the anchor and on a real name match.
    centre = (base["lat"], base["lon"])
    max_km = MAX_REFINE_KM[base["precision"]]
    candidates = parsed["landmarks"] + [l for l in parsed["localities"] if l != (locality_hit or {}).get("matched")]
    for name in candidates[:3]:
        if not _key_words(name):
            continue
        for f in await _photon(f"{name} {area_hint}".strip(), centre):
            props = f.get("properties", {})
            lon, lat = f["geometry"]["coordinates"][:2]
            if props.get("countrycode") != "IN":
                continue
            if _km((lat, lon), centre) > max_km:
                continue
            if not _name_matches(name, props.get("name", ""), f"{props.get('osm_key', '')} {props.get('osm_value', '')}"):
                continue
            label = ", ".join(x for x in [props.get("name"), props.get("street"), props.get("district") or props.get("city"), props.get("postcode")] if x)
            return _result(lat, lon, "LANDMARK", name, label)

    return base
