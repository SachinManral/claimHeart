from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query, status

from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user, get_db
from app.core.exceptions import success_response
from app.db.models.user import User
from app.schemas.comment_schema import CommentCreateRequest, CommentUpdateRequest
from app.services.comment_service import CommentService

router = APIRouter()
service = CommentService()


def _raise_from_value_error(exc: ValueError) -> None:
    detail = str(exc)
    code = status.HTTP_404_NOT_FOUND if "not found" in detail.lower() else status.HTTP_400_BAD_REQUEST
    raise HTTPException(status_code=code, detail=detail) from exc


@router.get("/")
def list_comments(
    claim_id: int = Query(gt=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    items = service.list_comments(db=db, claim_id=claim_id, requesting_user=current_user)
    return success_response(items)


@router.post("")
def create_comment(
    payload: CommentCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        comment = service.create_comment(
            db=db,
            claim_id=payload.claim_id,
            author_id=current_user.id,
            comment_type=payload.comment_type,
            content=payload.content,
            visibility=payload.visibility,
            mentions=payload.mentions,
            parent_comment_id=payload.parent_comment_id,
            attachments=payload.attachments,
        )
        return success_response(comment, status_code=201)
    except ValueError as exc:
        _raise_from_value_error(exc)


@router.patch("/{comment_id}")
def update_comment(
    comment_id: int,
    payload: CommentUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        comment = service.update_comment(
            db=db,
            comment_id=comment_id,
            author_id=current_user.id,
            content=payload.content,
            attachments=payload.attachments,
        )
        return success_response(comment)
    except ValueError as exc:
        _raise_from_value_error(exc)


@router.delete("/{comment_id}")
def delete_comment(comment_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        role = (current_user.role or "").lower()
        comment = service.delete_comment(
            db=db,
            comment_id=comment_id,
            author_id=current_user.id,
            is_admin=(role == "admin"),
        )
        return success_response(comment)
    except ValueError as exc:
        _raise_from_value_error(exc)


@router.get("/health")
def comments_health():
    return success_response({"status": "ok", "resource": "comments", "message": "comments route active"})
