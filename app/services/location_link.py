"""
Pull lat/long out of a location the applicant shared (WhatsApp / Google Maps / Apple Maps link,
or plain "23.0359, 72.5584" text).

Short links (maps.app.goo.gl, goo.gl/maps) are expanded by following redirects, but only through
Google / Apple map hosts, so the server never fetches an arbitrary URL supplied by a user.
"""
import logging
import re
from typing import Optional, Tuple
from urllib.parse import parse_qs, unquote, urlparse

import httpx

logger = logging.getLogger(__name__)

# Roughly India, with margin - rejects swapped lat/long and junk numbers.
_LAT_RANGE = (5.0, 38.0)
_LON_RANGE = (67.0, 99.0)

# At least 3 decimals (~100 m); coarser pairs are too vague to be a shared location.
_PAIR = r"(-?\d{1,2}\.\d{3,})\s*,[\s+]*(-?\d{2,3}\.\d{3,})"
# Most precise first: !3d!4d is the dropped place itself, @lat,lon is only the map viewport centre.
_URL_PATTERNS = [
    re.compile(r"!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)"),
    re.compile(r"[?&](?:q|query|ll|sll|destination|daddr|center|saddr)=(?:loc:)?" + _PAIR),
    re.compile(r"/place/" + _PAIR),
    re.compile(r"/search/" + _PAIR),
    re.compile(r"/dir/[^/]*/" + _PAIR),
    re.compile(r"@" + _PAIR),
]
_PLAIN_PAIR = re.compile(_PAIR)
_URL_IN_TEXT = re.compile(r"https?://\S+")

_ALLOWED_HOSTS = (
    "maps.app.goo.gl", "goo.gl", "g.co", "maps.google.com", "google.com", "www.google.com",
    "google.co.in", "www.google.co.in", "maps.google.co.in", "consent.google.com", "maps.apple.com",
)


def _valid(lat: float, lon: float) -> bool:
    return _LAT_RANGE[0] <= lat <= _LAT_RANGE[1] and _LON_RANGE[0] <= lon <= _LON_RANGE[1]


def _host_allowed(url: str) -> bool:
    host = (urlparse(url).hostname or "").lower()
    return any(host == h or host.endswith("." + h) for h in _ALLOWED_HOSTS)


def _coords_from_text(text: str) -> Optional[Tuple[float, float]]:
    decoded = unquote(unquote(text or ""))
    for pattern in _URL_PATTERNS:
        m = pattern.search(decoded)
        if m:
            lat, lon = float(m.group(1)), float(m.group(2))
            if _valid(lat, lon):
                return lat, lon
    m = _PLAIN_PAIR.search(decoded)
    if m:
        lat, lon = float(m.group(1)), float(m.group(2))
        if _valid(lat, lon):
            return lat, lon
    return None


async def _expand_short_link(url: str) -> Optional[str]:
    """Follow redirects one hop at a time, staying on map hosts. Returns the final URL."""
    current = url
    try:
        async with httpx.AsyncClient(timeout=8.0, follow_redirects=False,
                                     headers={"User-Agent": "Mozilla/5.0 (Linux; Android 13) CPV-Field-PWA"}) as client:
            for _ in range(6):
                if not _host_allowed(current):
                    return None
                res = await client.get(current)
                location = res.headers.get("location")
                if res.status_code in (301, 302, 303, 307, 308) and location:
                    current = str(httpx.URL(current).join(location))
                    # EU consent wall: the real map URL is carried in the "continue" parameter.
                    if "consent.google.com" in current:
                        cont = parse_qs(urlparse(current).query).get("continue", [None])[0]
                        if cont:
                            return cont
                    continue
                return current
    except Exception as exc:
        logger.warning("Could not expand location link %s: %s", url, exc)
    return current if current != url else None


async def parse_shared_location(text: str) -> Optional[Tuple[float, float]]:
    """Coordinates from pasted WhatsApp / maps text, or None if it carries no usable location."""
    if not text or not text.strip():
        return None
    direct = _coords_from_text(text)
    if direct:
        return direct
    for url in _URL_IN_TEXT.findall(text):
        url = url.rstrip(").,;'\"")
        if not _host_allowed(url):
            continue
        final = await _expand_short_link(url)
        if final:
            found = _coords_from_text(final)
            if found:
                return found
    return None
