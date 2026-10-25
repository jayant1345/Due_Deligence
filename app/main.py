import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy import select
from app.api.v1 import api_router
from app.core.config import settings
from app.core.database import AsyncSessionLocal, Base, engine
from app.core.security import hash_password
from app.models.user import User, UserRole


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure tables exist and create default super admin if none exists
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # Seed default admin user if database is empty
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(User).where(User.email == "admin@valuexca.com"))
        admin = result.scalar_one_or_none()
        if not admin:
            default_admin = User(
                email="admin@valuexca.com",
                hashed_password=hash_password("Admin@123456"),
                full_name="CA Rohan Parekh, FCA (Sr. Partner)",
                phone="+91 98200 12345",
                role=UserRole.SUPER_ADMIN,
                is_active=True,
            )
            session.add(default_admin)

            # Also seed a sample field agent for immediate testing
            sample_agent = User(
                email="agent.rajesh@valuexca.com",
                hashed_password=hash_password("Agent@123456"),
                full_name="Rajesh Varma",
                phone="+91 98111 22334",
                role=UserRole.FIELD_AGENT,
                is_active=True,
            )
            session.add(sample_agent)
            await session.commit()

    yield
    # Shutdown
    await engine.dispose()


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="High-Performance Railway-Ready CPV & Loan Document Scrutiny Backend for CA Firms with PWA & OpenRouter Gemini Vision.",
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Router
app.include_router(api_router, prefix=settings.API_V1_STR)

# Ensure directories exist
os.makedirs("app/static", exist_ok=True)
os.makedirs("storage_uploads", exist_ok=True)
os.makedirs("reports_generated", exist_ok=True)

# Mount Static Folders
app.mount("/static", StaticFiles(directory="app/static"), name="static")
app.mount("/storage", StaticFiles(directory="storage_uploads"), name="storage")


@app.get("/health", tags=["System Health"])
async def health_check():
    """Railway health check endpoint."""
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "database": "connected",
        "openrouter_model": settings.OPENROUTER_MODEL,
        "geofence_threshold_meters": settings.GEOFENCE_MAX_DISTANCE_METERS,
    }


# Serve PWA Manifest & Service Worker directly from root
@app.get("/manifest.json", include_in_schema=False)
async def get_manifest():
    manifest_path = "app/static/manifest.json"
    if os.path.exists(manifest_path):
        return FileResponse(manifest_path, media_type="application/manifest+json")
    return JSONResponse(status_code=404, content={"detail": "Manifest not found"})


@app.get("/sw.js", include_in_schema=False)
async def get_service_worker():
    sw_path = "app/static/sw.js"
    if os.path.exists(sw_path):
        return FileResponse(sw_path, media_type="application/javascript")
    return JSONResponse(status_code=404, content={"detail": "Service worker not found"})


# Frontend Navigation Routes
@app.get("/", include_in_schema=False)
async def index_root():
    portal_path = "app/static/index.html"
    if os.path.exists(portal_path):
        return FileResponse(portal_path, media_type="text/html")
    return HTMLResponse("<h1>VALUEX CA Verification Platform</h1><p>Visit <a href='/pwa'>Field Agent PWA</a> or <a href='/portal'>CA Portal</a></p>")


@app.get("/pwa", include_in_schema=False)
async def pwa_field_agent():
    pwa_path = "app/static/agent-pwa.html"
    if os.path.exists(pwa_path):
        return FileResponse(pwa_path, media_type="text/html")
    return HTMLResponse("<h1>Field Agent PWA</h1>")


@app.get("/portal", include_in_schema=False)
async def ca_portal():
    portal_path = "app/static/ca-portal.html"
    if os.path.exists(portal_path):
        return FileResponse(portal_path, media_type="text/html")
    return HTMLResponse("<h1>CA Scrutiny Portal</h1>")
