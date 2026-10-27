from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.api.deps import get_current_user, require_role
from app.models.user import User, UserRole
from app.schemas.auth import (
    LoginRequest,
    RefreshTokenRequest,
    Token,
    UserCreate,
    UserResponse,
)

router = APIRouter(prefix="/auth", tags=["Authentication & RBAC"])


def login_aliases(identifier: str) -> list:
    """Short login names map to the e-mail-style accounts seeded in different environments."""
    identifier = (identifier or "").lower().strip()
    aliases = [identifier]
    if identifier in ("admin", "admin@123", "superadmin"):
        aliases.extend(["admin", "admin@valuexca.com"])
    elif identifier in ("agent1", "agent", "rajesh"):
        aliases.extend(["agent1", "agent1@valuexca.com", "agent.rajesh@valuexca.com"])
    return aliases


@router.post("/login", response_model=Token)
async def login(
    req: LoginRequest,
    db: AsyncSession = Depends(get_db)
):
    """Authenticate user with Argon2 password verification and issue JWT token pair."""
    identifier = (req.username or req.email or "").lower().strip()
    if not identifier:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email is required",
        )

    query = select(User).where(User.email.in_(login_aliases(identifier)))
    result = await db.execute(query)
    user = result.scalars().first()

    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is deactivated",
        )

    access_token = create_access_token(subject=user.id, role=user.role.value)
    refresh_token = create_refresh_token(subject=user.id, role=user.role.value)

    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        role=user.role,
        user_id=user.id,
        full_name=user.full_name,
    )


@router.post("/refresh", response_model=Token)
async def refresh_token(
    req: RefreshTokenRequest,
    db: AsyncSession = Depends(get_db)
):
    """Generate a new access token from a valid refresh token."""
    payload = decode_token(req.refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
        )

    user_id = payload.get("sub")
    query = select(User).where(User.id == user_id)
    result = await db.execute(query)
    user = result.scalar_one_or_none()

    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive",
        )

    new_access = create_access_token(subject=user.id, role=user.role.value)
    new_refresh = create_refresh_token(subject=user.id, role=user.role.value)

    return Token(
        access_token=new_access,
        refresh_token=new_refresh,
        role=user.role,
        user_id=user.id,
        full_name=user.full_name,
    )


@router.post("/register", response_model=UserResponse)
async def register_user(
    req: UserCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.SUPER_ADMIN, UserRole.CA_VERIFIER)),
):
    """Create a new user (Staff or Field Agent). Authorized for SUPER_ADMIN and CA_VERIFIER."""
    # Check if email exists
    query = select(User).where(User.email == req.email.lower().strip())
    result = await db.execute(query)
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists",
        )

    user = User(
        email=req.email.lower().strip(),
        hashed_password=hash_password(req.password),
        full_name=req.full_name,
        phone=req.phone,
        role=req.role,
        is_active=True,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


@router.get("/me", response_model=UserResponse)
async def get_my_profile(
    current_user: User = Depends(get_current_user)
):
    """Retrieve current authenticated user details."""
    return current_user
