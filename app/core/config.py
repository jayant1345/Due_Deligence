import os
import re
from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    PROJECT_NAME: str = "VALUEX CA Loan CPV & Document Scrutiny Platform"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "prod-super-secure-jwt-secret-key-change-in-railway-dashboard-32char")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 Hours
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "sqlite+aiosqlite:///./due_diligence.db"
    )

    @property
    def ASYNC_DATABASE_URL(self) -> str:
        """
        Dynamically convert Railway's 'postgres://' or 'postgresql://' into 'postgresql+asyncpg://'.
        Also handles sslmode parameters for asyncpg compatibility, and supports SQLite fallback.
        """
        url = self.DATABASE_URL
        if not url:
            return "sqlite+aiosqlite:///./due_diligence.db"

        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql+asyncpg://", 1)
        elif url.startswith("postgresql://") and not url.startswith("postgresql+asyncpg://"):
            url = url.replace("postgresql://", "postgresql+asyncpg://", 1)

        # asyncpg does not accept sslmode query parameter directly in the connection string
        # it expects ssl context or separate arguments
        if "sslmode=" in url:
            url = re.sub(r"[?&]sslmode=[^&]+", "", url)
            if "?" in url and url.endswith("?"):
                url = url[:-1]
        return url

    # Redis & Celery
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    
    @property
    def CELERY_BROKER_URL(self) -> str:
        return self.REDIS_URL

    @property
    def CELERY_RESULT_BACKEND(self) -> str:
        return self.REDIS_URL

    # Storage Backend (local, s3, r2)
    STORAGE_TYPE: str = os.getenv("STORAGE_TYPE", "local")
    LOCAL_STORAGE_DIR: str = os.getenv("LOCAL_STORAGE_DIR", "storage_uploads")
    AWS_ACCESS_KEY_ID: str = os.getenv("AWS_ACCESS_KEY_ID", "")
    AWS_SECRET_ACCESS_KEY: str = os.getenv("AWS_SECRET_ACCESS_KEY", "")
    AWS_REGION: str = os.getenv("AWS_REGION", "ap-south-1")
    S3_BUCKET_NAME: str = os.getenv("S3_BUCKET_NAME", "ca-verification-vault")
    S3_ENDPOINT_URL: str = os.getenv("S3_ENDPOINT_URL", "")  # For Cloudflare R2 or MinIO

    # OpenRouter Gemini Vision for High-Accuracy, Cost-Effective Scanning
    OPENROUTER_API_KEY: str = os.getenv("OPENROUTER_API_KEY", "")
    OPENROUTER_MODEL: str = os.getenv("OPENROUTER_MODEL", "google/gemini-2.5-flash")
    OPENROUTER_BASE_URL: str = os.getenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1")

    # CPV Geofencing Rules
    GEOFENCE_MAX_DISTANCE_METERS: float = 150.0  # Safe harbor limit

    # CA Firm Credentials for Certification
    CA_FIRM_NAME: str = "NAIMISH N. SHAH & CO. CHARTERED ACCOUNTANTS"
    CA_FRN: str = "106829W"
    CA_PARTNER_NAME: str = "CA PRANAV N. SHAH"
    CA_MEMBERSHIP_NO: str = "033747"
    CA_OFFICE_ADDRESS: str = "B/3, Trupti Apartments, 3rd Floor, Navrangpura, Ahmedabad - 380 009"

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["*"]


settings = Settings()
