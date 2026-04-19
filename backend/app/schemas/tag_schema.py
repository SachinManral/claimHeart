from datetime import datetime

from pydantic import BaseModel, Field, field_validator


ALLOWED_TAG_TYPES = {"system", "custom"}


class TagCreateRequest(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    color: str = Field(default="#2563eb", min_length=7, max_length=7)
    description: str | None = Field(default=None, max_length=500)
    tag_type: str = Field(default="custom")

    @field_validator("name", mode="before")
    @classmethod
    def normalize_name(cls, value):
        return value.strip() if isinstance(value, str) else value

    @field_validator("color")
    @classmethod
    def validate_color(cls, value: str) -> str:
        normalized = value.strip().lower()
        if not normalized.startswith("#") or len(normalized) != 7:
            raise ValueError("color must be a hex value like #1f2937")
        return normalized

    @field_validator("tag_type")
    @classmethod
    def validate_type(cls, value: str) -> str:
        normalized = value.strip().lower()
        if normalized not in ALLOWED_TAG_TYPES:
            raise ValueError(f"tag_type must be one of {sorted(ALLOWED_TAG_TYPES)}")
        return normalized


class TagUpdateRequest(BaseModel):
    color: str | None = Field(default=None, min_length=7, max_length=7)
    description: str | None = Field(default=None, max_length=500)

    @field_validator("color")
    @classmethod
    def validate_color(cls, value: str | None) -> str | None:
        if value is None:
            return value
        normalized = value.strip().lower()
        if not normalized.startswith("#") or len(normalized) != 7:
            raise ValueError("color must be a hex value like #1f2937")
        return normalized


class ClaimTagAssignRequest(BaseModel):
    claim_id: int = Field(gt=0)
    tag_ids: list[int] = Field(min_length=1)


class TagPublic(BaseModel):
    id: int
    name: str
    color: str
    description: str | None
    tag_type: str
    created_by: int | None
    created_at: datetime
