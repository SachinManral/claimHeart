from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query, status

from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user, get_db
from app.core.exceptions import success_response
from app.db.models.user import User
from app.schemas.assignment_schema import (
    AssignmentCreateRequest,
    AssignmentReassignRequest,
    AssignmentStatusUpdateRequest,
    AutoAssignRequest,
)
from app.services.assignment_service import AssignmentService

router = APIRouter()
service = AssignmentService()


def _raise_from_value_error(exc: ValueError) -> None:
    detail = str(exc)
    code = status.HTTP_404_NOT_FOUND if "not found" in detail.lower() else status.HTTP_400_BAD_REQUEST
    raise HTTPException(status_code=code, detail=detail) from exc


@router.get("/")
def list_assignments(
    claim_id: int | None = Query(default=None, gt=0),
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    items = service.list_assignments(db=db, claim_id=claim_id)
    return success_response(items)


@router.post("/auto")
def auto_assign(payload: AutoAssignRequest, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    try:
        assignment = service.auto_assign(db=db, claim_id=payload.claim_id, priority=payload.priority)
        return success_response(assignment, status_code=201)
    except ValueError as exc:
        _raise_from_value_error(exc)


@router.post("/manual")
def manual_assign(
    payload: AssignmentCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        assignment = service.manual_assign(
            db=db,
            claim_id=payload.claim_id,
            assigned_to=payload.assigned_to,
            assigned_by=current_user.id,
            priority=payload.priority,
            due_date=payload.due_date,
            notes=payload.notes,
        )
        return success_response(assignment, status_code=201)
    except ValueError as exc:
        _raise_from_value_error(exc)


@router.patch("/{assignment_id}/reassign")
def reassign(
    assignment_id: int,
    payload: AssignmentReassignRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        assignment = service.reassign(
            db=db,
            assignment_id=assignment_id,
            assigned_to=payload.assigned_to,
            assigned_by=current_user.id,
            notes=payload.notes,
        )
        return success_response(assignment)
    except ValueError as exc:
        _raise_from_value_error(exc)


@router.patch("/{assignment_id}/status")
def update_assignment_status(
    assignment_id: int,
    payload: AssignmentStatusUpdateRequest,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    try:
        assignment = service.update_status(db=db, assignment_id=assignment_id, status=payload.status)
        return success_response(assignment)
    except ValueError as exc:
        _raise_from_value_error(exc)


@router.get("/health")
def assignments_health():
    return success_response({"status": "ok", "resource": "assignments", "message": "assignments route active"})
