from fastapi import APIRouter, Depends, HTTPException, Query, status
from app.api.deps import get_current_ca_user
from app.models.user import User
from app.services.geocoder import geocode_address

router = APIRouter(prefix="/geocode", tags=["Geocoding"])


@router.get("")
async def lookup_address(
    address: str = Query(..., min_length=3, max_length=500),
    current_user: User = Depends(get_current_ca_user),
):
    """Approximate lat/long for an address, pincode, locality or landmark (OpenStreetMap). Nothing is saved."""
    result = await geocode_address(address)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Location not found on OpenStreetMap. Add a pincode, area or landmark, or place the pin manually.",
        )
    return result
