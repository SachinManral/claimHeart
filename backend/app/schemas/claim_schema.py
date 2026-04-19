from datetime import datetime
from pydantic import BaseModel, Field, field_validator


CLAIM_SCHEMA = {
    "claim_id": "string",
    "policy_number": "string",
    "claim_type": "Pre-Authorization | Reimbursement",
    "hospital_network_status": "In-Network | Out-of-Network",
    "estimated_cost": "float",
    "provisional_diagnosis": "string",
    "is_emergency": "boolean",
}


ALLOWED_CLAIM_STATUS = {"pending", "under_review", "approved", "denied", "fraud", "escalated"}
ALLOWED_PRIORITY = {"low", "normal", "high", "critical"}


class ClaimCreateRequest(BaseModel):
    claim_number: str = Field(min_length=4, max_length=32)
    patient_name: str = Field(min_length=2, max_length=120)
    policy_number: str = Field(min_length=3, max_length=64)
    diagnosis: str | None = Field(default=None, max_length=255)
    amount: float = Field(ge=0, le=50000000)
    status: str = Field(default="pending")
    priority: str = Field(default="normal")
    notes: str | None = Field(default=None, max_length=2000)

    @field_validator("claim_number", "patient_name", "policy_number", "diagnosis", "notes", mode="before")
    @classmethod
    def strip_text(cls, value):
        return value.strip() if isinstance(value, str) else value

    @field_validator("status")
    @classmethod
    def validate_status(cls, value: str) -> str:
        normalized = value.strip().lower()
        if normalized not in ALLOWED_CLAIM_STATUS:
            raise ValueError(f"status must be one of {sorted(ALLOWED_CLAIM_STATUS)}")
        return normalized

    @field_validator("priority")
    @classmethod
    def validate_priority(cls, value: str) -> str:
        normalized = value.strip().lower()
        if normalized not in ALLOWED_PRIORITY:
            raise ValueError(f"priority must be one of {sorted(ALLOWED_PRIORITY)}")
        return normalized


class ClaimStatusUpdateRequest(BaseModel):
    status: str = Field(default="under_review")
    priority: str = Field(default="normal")
    notes: str | None = Field(default=None, max_length=2000)

    @field_validator("status")
    @classmethod
    def validate_status(cls, value: str) -> str:
        normalized = value.strip().lower()
        if normalized not in ALLOWED_CLAIM_STATUS:
            raise ValueError(f"status must be one of {sorted(ALLOWED_CLAIM_STATUS)}")
        return normalized

    @field_validator("priority")
    @classmethod
    def validate_priority(cls, value: str) -> str:
        normalized = value.strip().lower()
        if normalized not in ALLOWED_PRIORITY:
            raise ValueError(f"priority must be one of {sorted(ALLOWED_PRIORITY)}")
        return normalized

    @field_validator("notes", mode="before")
    @classmethod
    def strip_notes(cls, value):
        return value.strip() if isinstance(value, str) else value


class ClaimPublic(BaseModel):
    id: int
    claim_number: str
    patient_name: str
    policy_number: str
    diagnosis: str | None
    amount: float
    status: str
    priority: str
    notes: str | None
    created_by: int | None
    created_at: datetime
    updated_at: datetime


class ClaimBulkApproveRequest(BaseModel):
    claim_ids: list[int] = Field(min_length=1)
    decision: str = Field(default="approved")
    note: str | None = Field(default=None, max_length=500)

    @field_validator("decision")
    @classmethod
    def validate_decision(cls, value: str) -> str:
        normalized = value.strip().lower()
        if normalized not in {"approved", "denied"}:
            raise ValueError("decision must be approved or denied")
        return normalized


class ClaimBulkAssignRequest(BaseModel):
    claim_ids: list[int] = Field(min_length=1)
    assigned_to: int = Field(gt=0)
    note: str | None = Field(default=None, max_length=500)


class ClaimBulkExportRequest(BaseModel):
    claim_ids: list[int] = Field(min_length=1)
    include_notes: bool = True


class ClaimBulkStatusUpdateRequest(BaseModel):
    claim_ids: list[int] = Field(min_length=1)
    status: str
    priority: str | None = None
    note: str | None = Field(default=None, max_length=500)

    @field_validator("status")
    @classmethod
    def validate_bulk_status(cls, value: str) -> str:
        normalized = value.strip().lower()
        if normalized not in ALLOWED_CLAIM_STATUS:
            raise ValueError(f"status must be one of {sorted(ALLOWED_CLAIM_STATUS)}")
        return normalized

    @field_validator("priority")
    @classmethod
    def validate_bulk_priority(cls, value: str | None) -> str | None:
        if value is None:
            return value
        normalized = value.strip().lower()
        if normalized not in ALLOWED_PRIORITY:
            raise ValueError(f"priority must be one of {sorted(ALLOWED_PRIORITY)}")
        return normalized
