from __future__ import annotations

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status

from app.api.dependencies import get_current_user
from app.core.config import settings
from app.core.exceptions import success_response
from app.db.models.user import User
from app.utils.s3_helpers import S3Storage, infer_content_type

router = APIRouter()

MAX_FILE_SIZE = settings.max_upload_size_bytes
storage = S3Storage()


@router.post("/claims/{claim_id}/documents")
async def upload_claim_document(
    claim_id: str,
    file: UploadFile = File(...),
    _: User = Depends(get_current_user),
):
    if not file.filename:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Filename is required")

    payload = await file.read()
    if len(payload) > MAX_FILE_SIZE:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File too large (max 10MB)")

    content_type = file.content_type or infer_content_type(file.filename)

    try:
        stored = storage.upload_bytes(payload=payload, claim_id=claim_id, filename=file.filename, content_type=content_type)
        signed_url = storage.generate_signed_download_url(stored.key)
        return success_response(
            {
                "claim_id": claim_id,
                "filename": file.filename,
                "content_type": content_type,
                "storage_key": stored.key,
                "signed_url": signed_url,
            },
            status_code=201,
        )
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
    except RuntimeError as exc:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(exc)) from exc


@router.get("/documents/signed-url")
def get_signed_url(key: str, _: User = Depends(get_current_user)):
    try:
        return success_response({"key": key, "signed_url": storage.generate_signed_download_url(key)})
    except RuntimeError as exc:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(exc)) from exc
