import os
import uuid
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
from app.models.loan_case import CaseStatus, LoanCase
from app.models.user import User, UserRole


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure tables exist and create default super admin if none exists
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # Seed default simple users (admin / admin@123 and agent1 / agent1@123)
    async with AsyncSessionLocal() as session:
        # 1. Super Admin / CA Partner (admin / admin@123)
        res_admin = await session.execute(select(User).where(User.email.in_(["admin", "admin@valuexca.com"])))
        admin_user = res_admin.scalars().first()
        if not admin_user:
            admin_user = User(
                email="admin",
                hashed_password=hash_password("admin@123"),
                full_name="CA Pranav N. Shah (Sr. Partner)",
                phone="+91 98200 12345",
                role=UserRole.SUPER_ADMIN,
                is_active=True,
            )
            session.add(admin_user)
        else:
            # Guarantee password is admin@123
            admin_user.hashed_password = hash_password("admin@123")

        # 2. Field Agent (agent1 / agent1@123)
        res_agent = await session.execute(select(User).where(User.email.in_(["agent1", "agent.rajesh@valuexca.com", "agent1@valuexca.com"])))
        agent_user = res_agent.scalars().first()
        if not agent_user:
            agent_user = User(
                email="agent1",
                hashed_password=hash_password("agent1@123"),
                full_name="Rajesh Varma (Field Agent 1)",
                phone="+91 91579 38887",
                role=UserRole.FIELD_AGENT,
                is_active=True,
            )
            session.add(agent_user)
        else:
            # Guarantee password is agent1@123
            agent_user.hashed_password = hash_password("agent1@123")

        await session.commit()
        await session.refresh(admin_user)
        await session.refresh(agent_user)

        # 3. Seed Default Master Cases (UBI, SBI, HDFC, ICICI, BOB)
        case_uuid_ubi = uuid.UUID("b901fc63-12a8-4e32-9c02-e20984cfb001")
        res_case = await session.execute(select(LoanCase).where(LoanCase.id == case_uuid_ubi))
        if not res_case.scalar_one_or_none():
            standard_cases = [
                LoanCase(
                    id=uuid.UUID("b901fc63-12a8-4e32-9c02-e20984cfb001"),
                    case_no="UBI-HL-2026-20L",
                    bank_name="Union Bank of India",
                    branch="Amrapura Branch",
                    applicant_name="Mrs. Rajkunvarba Pradeepsinh Vaghela",
                    applicant_phone="+91 81601 66900",
                    loan_type="HOME_LOAN",
                    loan_amount=2000000.0,
                    target_address="31, Siddhi Vinayak Bunglows, Near Gayatri Temple, Pethapur, Gandhinagar 382610",
                    target_lat=23.2156,
                    target_lon=72.6369,
                    status=CaseStatus.ASSIGNED,
                    created_by_id=admin_user.id,
                    assigned_agent_id=agent_user.id,
                ),
                LoanCase(
                    id=uuid.UUID("c102ad74-23b9-4f43-ad13-f31095d0c002"),
                    case_no="SBI-HL-2026-45L",
                    bank_name="State Bank of India",
                    branch="Bandra West Branch",
                    applicant_name="Mr. Vikramaditya Sengupta",
                    applicant_phone="+91 98201 12233",
                    loan_type="HOME_LOAN",
                    loan_amount=4500000.0,
                    target_address="Flat 402, 4th Floor, Imperial Heights, Plot 12B, Bandra West, Mumbai 400050",
                    target_lat=19.0596,
                    target_lon=72.8295,
                    status=CaseStatus.ASSIGNED,
                    created_by_id=admin_user.id,
                    assigned_agent_id=agent_user.id,
                ),
                LoanCase(
                    id=uuid.UUID("d203be85-34ca-4a54-be24-a42106e1d003"),
                    case_no="HDFC-LAP-2026-60L",
                    bank_name="HDFC Bank",
                    branch="Navrangpura Branch",
                    applicant_name="Mr. Jayeshbhai K. Patel",
                    applicant_phone="+91 98250 44556",
                    loan_type="LAP",
                    loan_amount=6000000.0,
                    target_address="14, Shanti Kunj, Near Commerce Six Roads, Navrangpura, Ahmedabad 380009",
                    target_lat=23.0372,
                    target_lon=72.5621,
                    status=CaseStatus.ASSIGNED,
                    created_by_id=admin_user.id,
                    assigned_agent_id=agent_user.id,
                ),
                LoanCase(
                    id=uuid.UUID("e304cf96-45db-4b65-cf35-b53217f2e004"),
                    case_no="ICICI-PL-2026-15L",
                    bank_name="ICICI Bank",
                    branch="Ashram Road Branch",
                    applicant_name="Dr. Ananya Sharma",
                    applicant_phone="+91 94260 99887",
                    loan_type="PERSONAL_LOAN",
                    loan_amount=1500000.0,
                    target_address="C-12, Riverview Towers, Opp Gandhi Ashram, Ashram Road, Ahmedabad 380027",
                    target_lat=23.0305,
                    target_lon=72.5735,
                    status=CaseStatus.ASSIGNED,
                    created_by_id=admin_user.id,
                    assigned_agent_id=agent_user.id,
                ),
                LoanCase(
                    id=uuid.UUID("f405da07-56ec-4c76-da46-c64328a3f005"),
                    case_no="BOB-HL-2026-30L",
                    bank_name="Bank of Baroda",
                    branch="Sector 11 Branch",
                    applicant_name="Mr. Mahendrasinh Solanki",
                    applicant_phone="+91 99781 23456",
                    loan_type="HOME_LOAN",
                    loan_amount=3000000.0,
                    target_address="Plot 452/2, Sector 11, Gandhinagar Capital Complex, Gandhinagar 382011",
                    target_lat=23.2350,
                    target_lon=72.6520,
                    status=CaseStatus.ASSIGNED,
                    created_by_id=admin_user.id,
                    assigned_agent_id=agent_user.id,
                ),
            ]
            for sc in standard_cases:
                session.add(sc)
            await session.commit()

        # 4. Guarantee Pargi Bhavnaben case (UBI-HL-2026-531) is seeded for live bank scrutiny
        case_uuid_pargi = uuid.UUID("b8df82fd-e33a-493e-8d4b-a802861cf294")
        res_pargi = await session.execute(
            select(LoanCase).where((LoanCase.id == case_uuid_pargi) | (LoanCase.case_no == "UBI-HL-2026-531"))
        )
        if not res_pargi.scalar_one_or_none():
            pargi_case = LoanCase(
                id=case_uuid_pargi,
                case_no="UBI-HL-2026-531",
                bank_name="Union Bank of India",
                branch="Dholka Branch",
                applicant_name="Pargi Bhavnaben Sartanlal",
                applicant_phone="+91 90000 11111",
                loan_type="Personal Loan (PL)",
                loan_amount=1500000.0,
                target_address="3, Vaijnath Society, Opp Dev Vihar, Kalikund Saroda Road, Dholka, Ahmedabad - 382225",
                target_lat=23.2156,
                target_lon=72.6369,
                status=CaseStatus.ASSIGNED,
                created_by_id=admin_user.id,
                assigned_agent_id=agent_user.id,
            )
            session.add(pargi_case)
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
