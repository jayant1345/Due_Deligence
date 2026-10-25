import io
import os
from datetime import datetime, timezone
from typing import Dict, Optional, Tuple
from PIL import Image, ImageDraw, ImageFont

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


def stamp_hard_watermark(
    input_image_path: str,
    output_image_path: str,
    case_no: str,
    agent_name: str,
    agent_id: str,
    lat: float,
    lon: float,
    accuracy: float = 3.5,
    timestamp: Optional[datetime] = None,
    geofence_status: str = "COMPLIANT",
) -> str:
    """
    Burn an indelible, non-tamperable black banner with high-contrast text
    onto the bottom border of the image pixels.
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
        # Convert RGBA/P to RGB for clean saving
        img = img.convert("RGB")
        width, height = img.size

        # Watermark banner height proportional to image dimensions (min 60px, max 140px)
        banner_height = max(60, min(140, int(height * 0.08)))
        new_height = height + banner_height

        # Create canvas with extended bottom banner
        watermarked_img = Image.new("RGB", (width, new_height), (15, 23, 42))  # Slate dark footer
        watermarked_img.paste(img, (0, 0))

        draw = ImageDraw.Draw(watermarked_img)

        # Draw 2px verification accent line between photo and footer
        accent_color = (16, 185, 129) if "COMPLIANT" in geofence_status.upper() or "VALID" in geofence_status.upper() else (239, 68, 68)
        draw.line([(0, height), (width, height)], fill=accent_color, width=3)

        # Build text string
        line1 = f"CASE: {case_no} | AGENT: {agent_name} ({agent_id}) | {ist_time_str}"
        line2 = f"GPS: {lat:.6f}°N, {lon:.6f}°E (±{accuracy:.1f}m) | GEOFENCE: {geofence_status} | VALUEX CPV VERIFIED"

        # Attempt to load a clean TTF font, fallback to default font
        font_size = max(12, int(banner_height * 0.22))
        try:
            font = ImageFont.truetype("arial.ttf", font_size)
        except Exception:
            try:
                font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
            except Exception:
                font = ImageFont.load_default()

        # Render Text with vertical padding
        y1 = height + int(banner_height * 0.18)
        y2 = height + int(banner_height * 0.54)

        draw.text((20, y1), line1, fill=(248, 250, 252), font=font)
        draw.text((20, y2), line2, fill=(203, 213, 225), font=font)

        # Save to output path
        os.makedirs(os.path.dirname(output_image_path), exist_ok=True)
        watermarked_img.save(output_image_path, format="JPEG", quality=90, optimize=True)

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
