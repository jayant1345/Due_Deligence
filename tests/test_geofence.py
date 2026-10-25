import pytest
from app.services.geofence import haversine_distance, validate_geofence


def test_haversine_distance_zero():
    # Identical coordinates should yield 0 meters
    dist = haversine_distance(19.0596, 72.8295, 19.0596, 72.8295)
    assert dist == 0.0


def test_haversine_known_distance():
    # Distance between Imperial Heights (19.0596, 72.8295) and nearby point (19.0592, 72.8298)
    dist = haversine_distance(19.0596, 72.8295, 19.0592, 72.8298)
    # Approx 50-70 meters
    assert 40.0 < dist < 80.0


def test_geofence_compliant_within_150m():
    # 68 meters away
    res = validate_geofence(
        target_lat=19.0596,
        target_lon=72.8295,
        captured_lat=19.0592,
        captured_lon=72.8298,
        threshold_meters=150.0,
    )
    assert res["is_valid"] is True
    assert res["geofence_breached"] is False
    assert res["distance_meters"] <= 150.0


def test_geofence_breached_outside_150m():
    # Far coordinates (~5 km away in Dadar/Worli)
    res = validate_geofence(
        target_lat=19.0596,
        target_lon=72.8295,
        captured_lat=19.0178,
        captured_lon=72.8478,
        threshold_meters=150.0,
    )
    assert res["is_valid"] is False
    assert res["geofence_breached"] is True
    assert res["distance_meters"] > 150.0
