from __future__ import annotations

import mimetypes
import uuid
from dataclasses import dataclass

from botocore.client import BaseClient
from botocore.exceptions import ClientError
import boto3

from app.core.config import settings

ALLOWED_DOCUMENT_MIME_TYPES = {"application/pdf", "image/jpeg", "image/jpg", "image/png"}


@dataclass
class StoredObject:
    key: str
    bucket: str
    content_type: str


class S3Storage:
    def __init__(self, s3_client: BaseClient | None = None):
        self.bucket_name = settings.s3_bucket_name
        self.client = s3_client or boto3.client(
            "s3",
            endpoint_url=settings.s3_endpoint_url,
            region_name=settings.s3_region,
            aws_access_key_id=settings.s3_access_key_id,
            aws_secret_access_key=settings.s3_secret_access_key,
        )

    def validate_content_type(self, content_type: str) -> None:
        if content_type not in ALLOWED_DOCUMENT_MIME_TYPES:
            raise ValueError("Unsupported file type. Allowed: PDF, JPG, JPEG, PNG")

    def _build_key(self, claim_id: str, filename: str) -> str:
        ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else "bin"
        return f"claims/{claim_id}/documents/{uuid.uuid4().hex}.{ext}"

    def upload_bytes(self, payload: bytes, claim_id: str, filename: str, content_type: str) -> StoredObject:
        self.validate_content_type(content_type)
        key = self._build_key(claim_id=claim_id, filename=filename)

        try:
            self.client.put_object(
                Bucket=self.bucket_name,
                Key=key,
                Body=payload,
                ContentType=content_type,
            )
        except ClientError as exc:
            raise RuntimeError(f"Failed to upload document to object storage: {exc}") from exc

        return StoredObject(key=key, bucket=self.bucket_name, content_type=content_type)

    def generate_signed_download_url(self, key: str, expires_in: int | None = None) -> str:
        expiry = expires_in or settings.s3_presigned_url_expiry
        try:
            return self.client.generate_presigned_url(
                ClientMethod="get_object",
                Params={"Bucket": self.bucket_name, "Key": key},
                ExpiresIn=expiry,
            )
        except ClientError as exc:
            raise RuntimeError(f"Failed to generate signed url: {exc}") from exc

    def delete_object(self, key: str) -> None:
        try:
            self.client.delete_object(Bucket=self.bucket_name, Key=key)
        except ClientError as exc:
            raise RuntimeError(f"Failed to delete object: {exc}") from exc


def infer_content_type(filename: str, fallback: str = "application/octet-stream") -> str:
    guessed, _ = mimetypes.guess_type(filename)
    return guessed or fallback
