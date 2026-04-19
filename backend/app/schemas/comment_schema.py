from datetime import datetime

from pydantic import BaseModel, Field, field_validator


ALLOWED_COMMENT_TYPES = {"internal", "external", "system"}
ALLOWED_COMMENT_VISIBILITY = {"internal", "external"}


class CommentCreateRequest(BaseModel):
    claim_id: int = Field(gt=0)
    comment_type: str = Field(default="internal")
    content: str = Field(min_length=1, max_length=4000)
    visibility: str | None = Field(default=None)
    mentions: list[int] = Field(default_factory=list)
    parent_comment_id: int | None = Field(default=None, gt=0)
    attachments: list[str] = Field(default_factory=list)

    @field_validator("comment_type")
    @classmethod
    def validate_type(cls, value: str) -> str:
        normalized = value.strip().lower()
        if normalized not in ALLOWED_COMMENT_TYPES:
            raise ValueError(f"comment_type must be one of {sorted(ALLOWED_COMMENT_TYPES)}")
        return normalized

    @field_validator("visibility")
    @classmethod
    def validate_visibility(cls, value: str | None) -> str | None:
        if value is None:
            return value
        normalized = value.strip().lower()
        if normalized not in ALLOWED_COMMENT_VISIBILITY:
            raise ValueError(f"visibility must be one of {sorted(ALLOWED_COMMENT_VISIBILITY)}")
        return normalized

    @field_validator("content", mode="before")
    @classmethod
    def strip_content(cls, value):
        return value.strip() if isinstance(value, str) else value


class CommentUpdateRequest(BaseModel):
    content: str = Field(min_length=1, max_length=4000)
    attachments: list[str] = Field(default_factory=list)

    @field_validator("content", mode="before")
    @classmethod
    def strip_content(cls, value):
        return value.strip() if isinstance(value, str) else value


class CommentPublic(BaseModel):
    id: int
    claim_id: int
    author_id: int | None
    comment_type: str
    content: str
    visibility: str
    mentions: list[int]
    attachments: list[str]
    parent_comment_id: int | None
    is_edited: bool
    created_at: datetime
    updated_at: datetime
