import math
from typing import Dict, Tuple


def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate the great circle distance between two points on Earth in meters.
    Uses the Haversine formula.
    """
    R = 6371000.0  # Earth's radius in meters

    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = (
        math.sin(delta_phi / 2.0) ** 2
        + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2
    )
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    distance_meters = R * c
    return round(distance_meters, 2)


def validate_geofence(
    target_lat: float,
    target_lon: float,
    captured_lat: float,
    captured_lon: float,
    threshold_meters: float = 150.0
) -> Dict[str, any]:
    """
    Validate whether captured device coordinates are within the permitted geofence radius.
    Mark geofence_breached=True if distance > threshold_meters.
    """
    distance = haversine_distance(target_lat, target_lon, captured_lat, captured_lon)
    is_valid = distance <= threshold_meters
    geofence_breached = not is_valid

    return {
        "distance_meters": distance,
        "is_valid": is_valid,
        "geofence_breached": geofence_breached,
        "threshold_meters": threshold_meters,
        "target_coords": (target_lat, target_lon),
        "captured_coords": (captured_lat, captured_lon),
    }
