from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status

from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user, get_db
from app.core.exceptions import success_response
from app.db.models.user import User
from app.schemas.tag_schema import ClaimTagAssignRequest, TagCreateRequest, TagUpdateRequest
from app.services.tag_service import TagService

router = APIRouter()
service = TagService()


def _raise_from_value_error(exc: ValueError) -> None:
    detail = str(exc)
    code = status.HTTP_404_NOT_FOUND if "not found" in detail.lower() else status.HTTP_400_BAD_REQUEST
    raise HTTPException(status_code=code, detail=detail) from exc


@router.get("/")
def list_tags(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return success_response(service.list_tags(db=db))


@router.post("")
def create_tag(
    payload: TagCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        tag = service.create_tag(
            db=db,
            name=payload.name,
            color=payload.color,
            description=payload.description,
            tag_type=payload.tag_type,
            created_by=current_user.id,
        )
        return success_response(tag, status_code=201)
    except ValueError as exc:
        _raise_from_value_error(exc)


@router.patch("/{tag_id}")
def update_tag(
    tag_id: int,
    payload: TagUpdateRequest,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    try:
        tag = service.update_tag(db=db, tag_id=tag_id, color=payload.color, description=payload.description)
        return success_response(tag)
    except ValueError as exc:
        _raise_from_value_error(exc)


@router.post("/assign")
def assign_tags(
    payload: ClaimTagAssignRequest,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    try:
        result = service.assign_tags_to_claim(db=db, claim_id=payload.claim_id, tag_ids=payload.tag_ids)
        return success_response(result)
    except ValueError as exc:
        _raise_from_value_error(exc)


@router.get("/claims/{claim_id}")
def get_claim_tags(claim_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    try:
        return success_response(service.get_claim_tags(db=db, claim_id=claim_id))
    except ValueError as exc:
        _raise_from_value_error(exc)


@router.get("/analytics")
def tag_analytics(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return success_response(service.analytics(db=db))


@router.get("/health")
def tags_health():
    return success_response({"status": "ok", "resource": "tags", "message": "tags route active"})
