from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field, field_validator


class TemplateCreateRequest(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    claim_type: str = Field(default="reimbursement", min_length=4, max_length=32)
    category: str = Field(default="general", min_length=3, max_length=32)
    default_fields: dict[str, Any] = Field(default_factory=dict)
    is_public: bool = True

    @field_validator("name", "claim_type", "category", mode="before")
    @classmethod
    def strip_text(cls, value):
        return value.strip() if isinstance(value, str) else value


class TemplateUpdateRequest(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=120)
    default_fields: dict[str, Any] | None = None
    is_public: bool | None = None

    @field_validator("name", mode="before")
    @classmethod
    def strip_name(cls, value):
        return value.strip() if isinstance(value, str) else value


class TemplateCreateClaimRequest(BaseModel):
    template_id: int = Field(gt=0)
    claim_number: str = Field(min_length=4, max_length=32)
    patient_name: str = Field(min_length=2, max_length=120)
    policy_number: str = Field(min_length=3, max_length=64)
    amount: float = Field(default=0, ge=0, le=50000000)

    @field_validator("claim_number", "patient_name", "policy_number", mode="before")
    @classmethod
    def strip_text(cls, value):
        return value.strip() if isinstance(value, str) else value


class TemplatePublic(BaseModel):
    id: int
    name: str
    claim_type: str
    category: str
    default_fields: dict[str, Any]
    is_public: bool
    created_by: int | None
    created_at: datetime
    updated_at: datetime
