from celery import Celery
from app.core.config import settings

celery_app = Celery(
    "ca_verification_worker",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="Asia/Kolkata",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=300,  # 5 min hard limit
    worker_prefetch_multiplier=1,
)

celery_app.autodiscover_tasks(["app.workers"])
