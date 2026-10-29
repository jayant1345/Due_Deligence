from fastapi import APIRouter
from app.api.v1.auth import router as auth_router
from app.api.v1.cases import router as cases_router
from app.api.v1.agent_visits import router as visits_router
from app.api.v1.scrutiny import router as scrutiny_router
from app.api.v1.reports import router as reports_router
from app.api.v1.archives import router as archives_router
from app.api.v1.agents import router as agents_router
from app.api.v1.geocode import router as geocode_router

api_router = APIRouter()
api_router.include_router(auth_router)
api_router.include_router(cases_router)
api_router.include_router(visits_router)
api_router.include_router(scrutiny_router)
api_router.include_router(reports_router)
api_router.include_router(archives_router)
api_router.include_router(agents_router)
api_router.include_router(geocode_router)
