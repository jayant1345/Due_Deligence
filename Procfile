web: gunicorn app.main:app -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT --workers ${WEB_CONCURRENCY:-4}
worker: celery -A app.workers.celery_app.celery_app worker --loglevel=info --concurrency=4
