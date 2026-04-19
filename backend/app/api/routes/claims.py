from datetime import datetime
from decimal import Decimal
import random

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user, get_db
from app.core.config import settings
from app.core.exceptions import success_response
from app.db.models.claim import Claim
from app.db.models.user import User
from app.schemas.claim_schema import (
    ClaimBulkApproveRequest,
    ClaimBulkAssignRequest,
    ClaimBulkExportRequest,
    ClaimBulkStatusUpdateRequest,
    ClaimCreateRequest,
    ClaimPublic,
    ClaimStatusUpdateRequest,
)
from app.services.claim_service import ClaimService
from app.utils.s3_helpers import S3Storage, infer_content_type

router = APIRouter()
service = ClaimService()
storage = S3Storage()


def _generate_claim_number(db: Session) -> str:
    year = datetime.utcnow().year
    for _ in range(20):
        suffix = random.randint(10000, 99999)
        candidate = f"CLM-{year}-{suffix}"
        exists = db.query(Claim).filter(Claim.claim_number == candidate).first()
        if not exists:
            return candidate

    raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Unable to generate unique claim number")


def _serialize_claim(claim: Claim) -> dict:
    return ClaimPublic(
        id=claim.id,
        claim_number=claim.claim_number,
        patient_name=claim.patient_name,
        policy_number=claim.policy_number,
        diagnosis=claim.diagnosis,
        amount=float(claim.amount if isinstance(claim.amount, Decimal) else claim.amount or 0),
        status=claim.status,
        priority=claim.priority,
        notes=claim.notes,
        created_by=claim.created_by,
        created_at=claim.created_at,
        updated_at=claim.updated_at,
    ).model_dump()


@router.post("")
def create_claim(
    payload: ClaimCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    claim = Claim(
        claim_number=payload.claim_number,
        patient_name=payload.patient_name,
        policy_number=payload.policy_number,
        diagnosis=payload.diagnosis,
        amount=payload.amount,
        status=payload.status,
        priority=payload.priority,
        notes=payload.notes,
        created_by=current_user.id,
    )
    db.add(claim)
    db.commit()
    db.refresh(claim)
    return success_response(_serialize_claim(claim), status_code=201)


@router.post("/upload")
async def upload_claim(
    file: UploadFile = File(...),
    patient_name: str = Form(...),
    policy_number: str = Form(...),
    diagnosis: str | None = Form(default=None),
    amount: float = Form(default=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not file.filename:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Filename is required")

    payload = await file.read()
    if len(payload) > settings.max_upload_size_bytes:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File too large (max 10MB)")

    content_type = file.content_type or infer_content_type(file.filename)
    claim_number = _generate_claim_number(db)

    try:
        stored = storage.upload_bytes(
            payload=payload,
            claim_id=claim_number,
            filename=file.filename,
            content_type=content_type,
        )
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
    except RuntimeError as exc:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(exc)) from exc

    claim = Claim(
        claim_number=claim_number,
        patient_name=patient_name.strip(),
        policy_number=policy_number.strip(),
        diagnosis=(diagnosis.strip() if diagnosis else None),
        amount=amount,
        status="pending",
        priority="normal",
        notes=f"Uploaded file: {file.filename}",
        created_by=current_user.id,
    )
    db.add(claim)
    db.commit()
    db.refresh(claim)

    return success_response(
        {
            "claim": _serialize_claim(claim),
            "upload": {
                "filename": file.filename,
                "content_type": content_type,
                "storage_key": stored.key,
                "signed_url": storage.generate_signed_download_url(stored.key),
            },
        },
        status_code=201,
    )


@router.get("")
def list_claims(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    status_filter: str | None = Query(default=None, alias="status"),
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    query = db.query(Claim)
    if status_filter:
        query = query.filter(Claim.status == status_filter)

    total = query.count()
    items = (
        query.order_by(Claim.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )
    return success_response(
        [_serialize_claim(claim) for claim in items],
        meta={"page": page, "page_size": page_size, "total": total},
    )


@router.post("/bulk/approve")
def bulk_approve_claims(
    payload: ClaimBulkApproveRequest,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    try:
        result = service.bulk_approve(
            db=db,
            claim_ids=payload.claim_ids,
            decision=payload.decision,
            note=payload.note,
        )
        return success_response(result)
    except ValueError as exc:
        message = str(exc)
        code = status.HTTP_404_NOT_FOUND if "not found" in message.lower() else status.HTTP_400_BAD_REQUEST
        raise HTTPException(status_code=code, detail=message) from exc


@router.post("/bulk/assign")
def bulk_assign_claims(
    payload: ClaimBulkAssignRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        result = service.bulk_assign(
            db=db,
            claim_ids=payload.claim_ids,
            assigned_to=payload.assigned_to,
            assigned_by=current_user.id,
            note=payload.note,
        )
        return success_response(result)
    except ValueError as exc:
        message = str(exc)
        code = status.HTTP_404_NOT_FOUND if "not found" in message.lower() else status.HTTP_400_BAD_REQUEST
        raise HTTPException(status_code=code, detail=message) from exc


@router.post("/bulk/export")
def bulk_export_claims(
    payload: ClaimBulkExportRequest,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    try:
        result = service.bulk_export(db=db, claim_ids=payload.claim_ids, include_notes=payload.include_notes)
        return success_response(result)
    except ValueError as exc:
        message = str(exc)
        code = status.HTTP_404_NOT_FOUND if "not found" in message.lower() else status.HTTP_400_BAD_REQUEST
        raise HTTPException(status_code=code, detail=message) from exc


@router.post("/bulk/update-status")
def bulk_update_claim_status(
    payload: ClaimBulkStatusUpdateRequest,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    try:
        result = service.bulk_update_status(
            db=db,
            claim_ids=payload.claim_ids,
            status=payload.status,
            priority=payload.priority,
            note=payload.note,
        )
        return success_response(result)
    except ValueError as exc:
        message = str(exc)
        code = status.HTTP_404_NOT_FOUND if "not found" in message.lower() else status.HTTP_400_BAD_REQUEST
        raise HTTPException(status_code=code, detail=message) from exc


@router.get("/{claim_id}")
def get_claim(claim_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    claim = db.query(Claim).filter(Claim.id == claim_id).first()
    if not claim:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Claim not found")
    return success_response(_serialize_claim(claim))


@router.patch("/{claim_id}")
def update_claim_status(
    claim_id: int,
    payload: ClaimStatusUpdateRequest,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    claim = db.query(Claim).filter(Claim.id == claim_id).first()
    if not claim:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Claim not found")

    claim.status = payload.status
    claim.priority = payload.priority
    claim.notes = payload.notes
    claim.updated_at = datetime.utcnow()

    db.add(claim)
    db.commit()
    db.refresh(claim)
    return success_response(_serialize_claim(claim))


@router.delete("/{claim_id}")
def delete_claim(claim_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    claim = db.query(Claim).filter(Claim.id == claim_id).first()
    if not claim:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Claim not found")

    db.delete(claim)
    db.commit()
    return success_response({"deleted": True, "claim_id": claim_id})
