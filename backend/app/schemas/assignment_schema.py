from datetime import datetime

from pydantic import BaseModel, Field, field_validator


ALLOWED_ASSIGNMENT_REASON = {"auto", "manual", "reassignment"}
ALLOWED_ASSIGNMENT_PRIORITY = {"low", "medium", "high", "urgent"}
ALLOWED_ASSIGNMENT_STATUS = {"pending", "in_progress", "completed"}


class AutoAssignRequest(BaseModel):
    claim_id: int = Field(gt=0)
    priority: str = Field(default="medium")

    @field_validator("priority")
    @classmethod
    def validate_priority(cls, value: str) -> str:
        normalized = value.strip().lower()
        if normalized not in ALLOWED_ASSIGNMENT_PRIORITY:
            raise ValueError(f"priority must be one of {sorted(ALLOWED_ASSIGNMENT_PRIORITY)}")
        return normalized


class AssignmentCreateRequest(BaseModel):
    claim_id: int = Field(gt=0)
    assigned_to: int = Field(gt=0)
    priority: str = Field(default="medium")
    due_date: datetime | None = None
    notes: str | None = Field(default=None, max_length=1200)

    @field_validator("priority")
    @classmethod
    def validate_priority(cls, value: str) -> str:
        normalized = value.strip().lower()
        if normalized not in ALLOWED_ASSIGNMENT_PRIORITY:
            raise ValueError(f"priority must be one of {sorted(ALLOWED_ASSIGNMENT_PRIORITY)}")
        return normalized

    @field_validator("notes", mode="before")
    @classmethod
    def strip_notes(cls, value):
        return value.strip() if isinstance(value, str) else value


class AssignmentReassignRequest(BaseModel):
    assigned_to: int = Field(gt=0)
    notes: str | None = Field(default=None, max_length=1200)

    @field_validator("notes", mode="before")
    @classmethod
    def strip_notes(cls, value):
        return value.strip() if isinstance(value, str) else value


class AssignmentStatusUpdateRequest(BaseModel):
    status: str

    @field_validator("status")
    @classmethod
    def validate_status(cls, value: str) -> str:
        normalized = value.strip().lower()
        if normalized not in ALLOWED_ASSIGNMENT_STATUS:
            raise ValueError(f"status must be one of {sorted(ALLOWED_ASSIGNMENT_STATUS)}")
        return normalized


class AssignmentPublic(BaseModel):
    id: int
    claim_id: int
    assigned_to: int
    assigned_by: int | None
    assignment_reason: str
    priority: str
    due_date: datetime | None
    status: str
    notes: str | None
    assigned_at: datetime
