from __future__ import annotations

import os
from dataclasses import dataclass
from dotenv import load_dotenv

load_dotenv()


def _parse_origins(value: str | None) -> list[str]:
    if not value:
        return ["http://localhost:3000", "http://127.0.0.1:3000"]
    return [origin.strip() for origin in value.split(",") if origin.strip()]


@dataclass(frozen=True)
class Settings:
    app_name: str = os.getenv("APP_NAME", "ClaimHeart API")
    app_version: str = os.getenv("APP_VERSION", "1.0.0")

    database_url: str = os.getenv(
        "DATABASE_URL",
        "postgresql+psycopg2://claimheart:claimheart@localhost:5432/claimheart",
    )

    cors_allowed_origins: list[str] = None  # type: ignore[assignment]

    jwt_secret_key: str = os.getenv("JWT_SECRET_KEY", "change-this-in-production")
    jwt_algorithm: str = os.getenv("JWT_ALGORITHM", "HS256")
    access_token_expire_minutes: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    refresh_token_expire_minutes: int = int(os.getenv("REFRESH_TOKEN_EXPIRE_MINUTES", "10080"))

    upload_dir: str = os.getenv("UPLOAD_DIR", "temp_uploads")
    max_upload_size_bytes: int = int(os.getenv("MAX_UPLOAD_SIZE_BYTES", str(10 * 1024 * 1024)))
    redis_url: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")

    s3_endpoint_url: str | None = os.getenv("S3_ENDPOINT_URL")
    s3_region: str = os.getenv("S3_REGION", "ap-south-1")
    s3_access_key_id: str | None = os.getenv("S3_ACCESS_KEY_ID")
    s3_secret_access_key: str | None = os.getenv("S3_SECRET_ACCESS_KEY")
    s3_bucket_name: str = os.getenv("S3_BUCKET_NAME", "claimheart-documents")
    s3_presigned_url_expiry: int = int(os.getenv("S3_PRESIGNED_URL_EXPIRY", "3600"))

    pinecone_api_key: str | None = os.getenv("PINECONE_API_KEY")
    pinecone_index_name: str = os.getenv("PINECONE_INDEX_NAME", "policy-documents")
    pinecone_dimension: int = int(os.getenv("PINECONE_DIMENSION", "1536"))
    pinecone_metric: str = os.getenv("PINECONE_METRIC", "cosine")
    pinecone_cloud: str = os.getenv("PINECONE_CLOUD", "aws")
    pinecone_region: str = os.getenv("PINECONE_REGION", "us-east-1")

    def __post_init__(self) -> None:
        object.__setattr__(self, "cors_allowed_origins", _parse_origins(os.getenv("CORS_ALLOWED_ORIGINS")))


settings = Settings()
