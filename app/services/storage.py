import os
import shutil
import uuid
import aiofiles
from typing import BinaryIO, Optional
from app.core.config import settings

try:
    import boto3
    from botocore.exceptions import ClientError
except ImportError:
    boto3 = None


class StorageService:
    def __init__(self):
        self.storage_type = settings.STORAGE_TYPE.lower()
        self.local_dir = settings.LOCAL_STORAGE_DIR
        os.makedirs(self.local_dir, exist_ok=True)
        
        self.s3_client = None
        if self.storage_type in ["s3", "r2"] and boto3:
            s3_kwargs = {
                "aws_access_key_id": settings.AWS_ACCESS_KEY_ID,
                "aws_secret_access_key": settings.AWS_SECRET_ACCESS_KEY,
                "region_name": settings.AWS_REGION,
            }
            if settings.S3_ENDPOINT_URL:
                s3_kwargs["endpoint_url"] = settings.S3_ENDPOINT_URL
            self.s3_client = boto3.client("s3", **s3_kwargs)

    async def save_upload_file(self, file_content: bytes, filename: str, subfolder: str = "raw") -> str:
        """
        Asynchronously save uploaded file bytes to storage backend.
        Returns the persistent path or public URL.
        """
        extension = os.path.splitext(filename)[1].lower()
        unique_name = f"{uuid.uuid4().hex}{extension}"
        
        target_dir = os.path.join(self.local_dir, subfolder)
        os.makedirs(target_dir, exist_ok=True)
        local_file_path = os.path.join(target_dir, unique_name)

        # Write locally
        async with aiofiles.open(local_file_path, "wb") as f:
            await f.write(file_content)

        # If S3/R2 is configured, offload to bucket
        if self.storage_type in ["s3", "r2"] and self.s3_client:
            s3_key = f"{subfolder}/{unique_name}"
            try:
                self.s3_client.upload_file(local_file_path, settings.S3_BUCKET_NAME, s3_key)
                if settings.S3_ENDPOINT_URL:
                    return f"{settings.S3_ENDPOINT_URL}/{settings.S3_BUCKET_NAME}/{s3_key}"
                return f"https://{settings.S3_BUCKET_NAME}.s3.{settings.AWS_REGION}.amazonaws.com/{s3_key}"
            except Exception:
                # Fallback to local path if S3 upload encounters error
                pass

        return local_file_path

    def get_absolute_path(self, storage_url: str) -> str:
        """Resolve a storage URL/path to local filesystem path."""
        if os.path.isabs(storage_url):
            return storage_url
        return os.path.abspath(storage_url)


storage_service = StorageService()
