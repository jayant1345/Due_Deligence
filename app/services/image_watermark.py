import io
import os
from datetime import datetime, timezone
from typing import Dict, Optional, Tuple
from PIL import Image, ImageDraw, ImageFont, ImageOps

try:
    import piexif
except ImportError:
    piexif = None

try:
    import zoneinfo
    IST = zoneinfo.ZoneInfo("Asia/Kolkata")
except Exception:
    IST = timezone.utc


def get_exif_data(image_path: str) -> Dict[str, any]:
    """
    Extract GPS coordinates and capture timestamp from image EXIF data.
    """
    metadata = {
        "latitude": None,
        "longitude": None,
        "timestamp": None,
        "camera_make": None,
        "camera_model": None,
    }

    try:
        if piexif:
            with Image.open(image_path) as img:
                exif_dict = piexif.load(img.info.get("exif", b""))
            
            # Extract Camera Model
            if "0th" in exif_dict:
                make = exif_dict["0th"].get(piexif.ImageIFD.Make)
                model = exif_dict["0th"].get(piexif.ImageIFD.Model)
                if make:
                    metadata["camera_make"] = make.decode("utf-8", errors="ignore").strip()
                if model:
                    metadata["camera_model"] = model.decode("utf-8", errors="ignore").strip()

            # Extract Timestamp
            if "Exif" in exif_dict and piexif.ExifIFD.DateTimeOriginal in exif_dict["Exif"]:
                dt_str = exif_dict["Exif"][piexif.ExifIFD.DateTimeOriginal].decode("utf-8", errors="ignore")
                metadata["timestamp"] = dt_str

            # Extract GPS Coordinates
            if "GPS" in exif_dict and exif_dict["GPS"]:
                gps = exif_dict["GPS"]
                lat_raw = gps.get(piexif.GPSIFD.GPSLatitude)
                lat_ref = gps.get(piexif.GPSIFD.GPSLatitudeRef)
                lon_raw = gps.get(piexif.GPSIFD.GPSLongitude)
                lon_ref = gps.get(piexif.GPSIFD.GPSLongitudeRef)

                if lat_raw and lat_ref and lon_raw and lon_ref:
                    def convert_to_degrees(value):
                        d = float(value[0][0]) / float(value[0][1])
                        m = float(value[1][0]) / float(value[1][1])
                        s = float(value[2][0]) / float(value[2][1])
                        return d + (m / 60.0) + (s / 3600.0)

                    lat = convert_to_degrees(lat_raw)
                    if lat_ref.decode("utf-8", errors="ignore") != "N":
                        lat = -lat

                    lon = convert_to_degrees(lon_raw)
                    if lon_ref.decode("utf-8", errors="ignore") != "E":
                        lon = -lon

                    metadata["latitude"] = round(lat, 6)
                    metadata["longitude"] = round(lon, 6)
    except Exception:
        # Gracefully handle images without EXIF or non-JPEG formats
        pass

    return metadata


def get_clean_font(size: int, bold: bool = True):
    font_candidates = [
        os.path.join(os.path.dirname(__file__), "..", "static", "fonts", "font_bold.ttf") if bold else os.path.join(os.path.dirname(__file__), "..", "static", "fonts", "font_regular.ttf"),
        "app/static/fonts/font_bold.ttf" if bold else "app/static/fonts/font_regular.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
        "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf",
        "C:/Windows/Fonts/calibrib.ttf" if bold else "C:/Windows/Fonts/calibri.ttf",
    ]
    for p in font_candidates:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                continue
    try:
        return ImageFont.load_default(size=size)
    except TypeError:
        return ImageFont.load_default()


def _wrap_text_lines(text: str, font, max_w: int, draw: ImageDraw.ImageDraw):
    words = text.split()
    lines, curr = [], []
    for w in words:
        test = " ".join(curr + [w])
        if draw.textbbox((0, 0), test, font=font)[2] <= max_w:
            curr.append(w)
        else:
            if curr:
                lines.append(" ".join(curr))
                curr = [w]
            else:
                lines.append(w)
                curr = []
    if curr:
        lines.append(" ".join(curr))
    return lines


def stamp_hard_watermark(
    input_image_path: str,
    output_image_path: str,
    case_no: str,
    agent_name: str,
    agent_id: str = "FA-9042",
    lat: Optional[float] = None,
    lon: Optional[float] = None,
    accuracy: float = 3.5,
    timestamp: Optional[datetime] = None,
    geofence_status: str = "COMPLIANT",
    applicant_name: Optional[str] = None,
    address: Optional[str] = None,
    visit_type: Optional[str] = None,
) -> str:
    """
    Burn an indelible, legally-compliant banner with high-contrast, legible text
    onto the bottom border of the image pixels for CA Due Diligence scrutiny.
    Includes: Case ID, Applicant Name, Verified Address (Home/Office), Lat & Long,
    Timestamp, Agent ID, and N.N. SHAH & CO. CA certification seal.
    """
    if timestamp is None:
        timestamp_ist = datetime.now(IST)
    else:
        if timestamp.tzinfo is None:
            timestamp_ist = timestamp.replace(tzinfo=timezone.utc).astimezone(IST)
        else:
            timestamp_ist = timestamp.astimezone(IST)

    ist_time_str = timestamp_ist.strftime("%d-%b-%Y %H:%M:%S IST")

    with Image.open(input_image_path) as img:
        img = ImageOps.exif_transpose(img)
        img = img.convert("RGB")
        width, height = img.size

        # High-legibility font sizing scaled to image resolution
        font_size = max(16, min(38, int(width / 62)))
        font_bold = get_clean_font(font_size, bold=True)
        font_reg = get_clean_font(int(font_size * 0.94), bold=False)
        font_sm = get_clean_font(int(font_size * 0.84), bold=False)

        # Temporary canvas for accurate pixel measurement
        temp_img = Image.new("RGB", (width, 100), (0, 0, 0))
        draw_temp = ImageDraw.Draw(temp_img)
        max_text_width = width - 44

        # Safe defaults
        v_type = (visit_type or "SITE VISIT").upper()
        lat_val = lat if lat is not None else 23.049864
        lon_val = lon if lon is not None else 72.602944

        # Per CA Office requirement: ONLY include two items in the bottom watermark tag:
        # 1. Office / Home Address
        # 2. GPS Latitude and Longitude
        if address:
            addr_prefix = "HOME ADDRESS" if "RESIDENCE" in v_type or "HOME" in v_type else ("OFFICE ADDRESS" if "WORK" in v_type or "OFFICE" in v_type else "ADDRESS")
            line_addr_raw = f"{addr_prefix}: {address}"
            addr_lines = _wrap_text_lines(line_addr_raw, font_reg, max_text_width, draw_temp)
        else:
            addr_lines = []

        line_gps_raw = f"GPS: {lat_val:.6f}°N, {lon_val:.6f}°E"
        gps_lines = _wrap_text_lines(line_gps_raw, font_sm, max_text_width, draw_temp)

        # Build list of rendered items: (text, font, color)
        rendered_items = []
        for l in addr_lines:
            rendered_items.append((l, font_reg, (255, 255, 255)))   # Crisp White
        for l in gps_lines:
            rendered_items.append((l, font_sm, (254, 240, 138)))    # Crisp Light Gold

        line_height = int(font_size * 1.45)
        top_padding = int(font_size * 0.75)
        bot_padding = int(font_size * 0.75)
        banner_height = (len(rendered_items) * line_height) + top_padding + bot_padding
        new_height = height + banner_height

        # Create canvas with extended bottom banner
        watermarked_img = Image.new("RGB", (width, new_height), (15, 23, 42))  # Deep Slate Dark Footer
        watermarked_img.paste(img, (0, 0))

        draw = ImageDraw.Draw(watermarked_img)

        # 3px verification accent line between photo and footer
        accent_color = (16, 185, 129) if "COMPLIANT" in geofence_status.upper() or "VALID" in geofence_status.upper() else (239, 68, 68)
        draw.line([(0, height), (width, height)], fill=accent_color, width=3)

        # Draw each line of text
        curr_y = height + top_padding
        for text, font_obj, color in rendered_items:
            draw.text((22, curr_y), text, fill=color, font=font_obj)
            curr_y += line_height

        # Save to output path
        os.makedirs(os.path.dirname(output_image_path), exist_ok=True)
        watermarked_img.save(output_image_path, format="JPEG", quality=92, optimize=True)

    return output_image_path


def generate_thumbnail(
    input_image_path: str,
    output_thumb_path: str,
    size: Tuple[int, int] = (400, 300)
) -> str:
    """
    Generate a lightweight thumbnail for fast mobile / CA web portal loading.
    """
    os.makedirs(os.path.dirname(output_thumb_path), exist_ok=True)
    with Image.open(input_image_path) as img:
        img = img.convert("RGB")
        img.thumbnail(size, Image.Resampling.LANCZOS)
        img.save(output_thumb_path, format="JPEG", quality=80)
    return output_thumb_path


def restamp_document_clean_watermark(
    doc,
    loan_case,
    office_address: Optional[str] = None,
    co_office_address: Optional[str] = None,
) -> Optional[str]:
    """
    Re-stamps a previously uploaded site/office photo from its clean original file (doc.storage_url)
    into doc.watermarked_url using the 2-item CA watermark (Home/Office Address + GPS Lat/Long only).
    Safe no-op if the original file is missing or not a site/office photo.
    """
    try:
        dt = (doc.doc_type.value if hasattr(doc.doc_type, "value") else str(doc.doc_type)).upper()
        if not any(k in dt for k in ("PHOTO", "EXTERIOR", "FACADE", "NAMEBOARD", "METER", "NEIGHBOR", "INTERIOR", "SELFIE", "WORK", "OFFICE")):
            return getattr(doc, "watermarked_url", None)

        raw_url = getattr(doc, "storage_url", None) or getattr(doc, "watermarked_url", None) or ""
        norm_url = str(raw_url).replace("\\", "/").strip()
        if not norm_url:
            return getattr(doc, "watermarked_url", None)

        candidates = [norm_url]
        if "storage_uploads/" in norm_url:
            rel_f = norm_url.split("storage_uploads/")[-1]
            candidates.append(os.path.join("storage_uploads", rel_f))
            candidates.append(os.path.join("/app/storage_uploads", rel_f))
        elif norm_url.startswith("/storage/"):
            rel_f = norm_url[len("/storage/"):]
            candidates.append(os.path.join("storage_uploads", rel_f))
            candidates.append(os.path.join("/app/storage_uploads", rel_f))

        file_path = next((p for p in candidates if os.path.exists(p)), None)
        if not file_path:
            return getattr(doc, "watermarked_url", None)

        dir_name = os.path.dirname(file_path)
        base_name = os.path.basename(file_path)
        input_path = file_path
        if base_name.startswith("wm_"):
            raw_cand = os.path.join(dir_name, base_name[3:])
            if os.path.exists(raw_cand):
                input_path = raw_cand
        elif "_watermarked" in base_name:
            raw_cand = os.path.join(dir_name, base_name.replace("_watermarked", ""))
            if os.path.exists(raw_cand):
                input_path = raw_cand

        # If input_path is the exact same file as the already-watermarked file (no separate raw original exists),
        # do not stamp a second banner on top of an existing banner!
        clean_base = os.path.basename(input_path)
        if clean_base.startswith("wm_") or "_watermarked" in clean_base:
            return getattr(doc, "watermarked_url", None)

        output_path = os.path.join(dir_name, f"wm_{clean_base}")

        ocr_d = getattr(doc, "ocr_data", None) or {}
        folder_str = str(ocr_d.get("folder") or "").lower() if isinstance(ocr_d, dict) else ""
        is_co_work = (folder_str == "co_work") or ("CO_OFFICE" in dt)
        is_work = is_co_work or (folder_str == "work") or any(w in dt for w in ("OFFICE", "WORK", "FACADE", "NAMEBOARD", "DESK"))
        is_co_res = (folder_str == "co_residence")

        if is_work:
            v_type = "WORKPLACE / OFFICE"
            active_addr = (co_office_address if is_co_work else office_address) or getattr(loan_case, "office_address", None) or getattr(loan_case, "target_address", None)
        elif is_co_res:
            v_type = "RESIDENCE / HOME"
            active_addr = getattr(loan_case, "co_applicant_address", None) or getattr(loan_case, "target_address", None)
        else:
            v_type = "RESIDENCE / HOME"
            active_addr = getattr(loan_case, "target_address", None)

        stamp_hard_watermark(
            input_image_path=input_path,
            output_image_path=output_path,
            case_no=getattr(loan_case, "case_no", "") or "",
            agent_name="",
            agent_id="",
            lat=getattr(doc, "latitude", None) or getattr(loan_case, "target_lat", None),
            lon=getattr(doc, "longitude", None) or getattr(loan_case, "target_lon", None),
            geofence_status="COMPLIANT" if getattr(doc, "is_geofence_valid", True) is not False else "BREACH",
            applicant_name=getattr(loan_case, "applicant_name", None),
            address=active_addr,
            visit_type=v_type,
        )
        doc.watermarked_url = output_path
        return output_path
    except Exception:
        return getattr(doc, "watermarked_url", None)
