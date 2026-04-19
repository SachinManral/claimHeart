from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user, get_db
from app.core.exceptions import success_response
from app.db.models.user import User
from app.schemas.template_schema import TemplateCreateClaimRequest, TemplateCreateRequest, TemplateUpdateRequest
from app.services.claim_template_service import ClaimTemplateService

router = APIRouter()
service = ClaimTemplateService()


def _raise_from_value_error(exc: ValueError) -> None:
    detail = str(exc)
    code = status.HTTP_404_NOT_FOUND if "not found" in detail.lower() else status.HTTP_400_BAD_REQUEST
    raise HTTPException(status_code=code, detail=detail) from exc


@router.get("")
def list_templates(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    templates = service.list_templates(db=db, user_id=current_user.id)
    return success_response(templates)


@router.post("")
def create_template(
    payload: TemplateCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    template = service.create_template(
        db=db,
        name=payload.name,
        claim_type=payload.claim_type,
        category=payload.category,
        default_fields=payload.default_fields,
        is_public=payload.is_public,
        created_by=current_user.id,
    )
    return success_response(template, status_code=201)


@router.patch("/{template_id}")
def update_template(
    template_id: int,
    payload: TemplateUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        template = service.update_template(
            db=db,
            template_id=template_id,
            user_id=current_user.id,
            name=payload.name,
            default_fields=payload.default_fields,
            is_public=payload.is_public,
        )
        return success_response(template)
    except ValueError as exc:
        _raise_from_value_error(exc)


@router.post("/create-claim")
def create_claim_from_template(
    payload: TemplateCreateClaimRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        claim = service.create_claim_from_template(
            db=db,
            template_id=payload.template_id,
            user_id=current_user.id,
            claim_number=payload.claim_number,
            patient_name=payload.patient_name,
            policy_number=payload.policy_number,
            amount=payload.amount,
        )
        return success_response(claim, status_code=201)
    except ValueError as exc:
        _raise_from_value_error(exc)


@router.get("/health")
def templates_health():
    return success_response({"status": "ok", "resource": "templates", "message": "templates route active"})
