from __future__ import annotations

import tempfile
import time
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile, status
from pydantic import BaseModel

from app.core.config import settings
from app.core.exceptions import success_response
from app.tasks.extraction import process_document

router = APIRouter()

UPLOAD_DIR = settings.upload_dir
Path(UPLOAD_DIR).mkdir(parents=True, exist_ok=True)

ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/jpg", "application/pdf"}
ALLOWED_FILE_EXTENSIONS = {"jpg", "jpeg", "png", "pdf"}
MAX_FILE_SIZE = settings.max_upload_size_bytes
STALE_UPLOAD_TTL_SECONDS = 3600


class LocalPathRequest(BaseModel):
    local_path: str


def _cleanup_stale_uploads() -> None:
    now = time.time()
    for child in Path(UPLOAD_DIR).glob("*"):
        try:
            if child.is_file() and now - child.stat().st_mtime > STALE_UPLOAD_TTL_SECONDS:
                child.unlink(missing_ok=True)
        except OSError:
            continue


def _save_upload(contents: bytes, extension: str) -> str:
    with tempfile.NamedTemporaryFile(mode="wb", suffix=f".{extension}", dir=UPLOAD_DIR, delete=False) as temp:
        temp.write(contents)
        return temp.name


@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    _cleanup_stale_uploads()

    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Allowed types: JPEG, JPG, PNG, PDF.",
        )

    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File too large (max 10MB)")

    ext = (file.filename.rsplit(".", 1)[-1].lower() if file.filename and "." in file.filename else "jpg")
    if ext not in ALLOWED_FILE_EXTENSIONS:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid file extension")

    file_path = _save_upload(contents, ext)

    try:
        result = process_document(file_path)
        return success_response(
            {
                "mode": "file_upload",
                "filename": file.filename,
                "status": "success",
                "extracted_data": result,
            }
        )
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error processing file: {exc}") from exc
    finally:
        Path(file_path).unlink(missing_ok=True)


@router.post("/process-local")
async def process_local_file(request: LocalPathRequest):
    local_path = request.local_path.strip()
    if not local_path:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="local_path is required")

    path = Path(local_path).expanduser().resolve()
    if not path.exists() or not path.is_file():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"File not found at path: {path}")

    ext = path.suffix.lower().replace(".", "")
    if ext not in ALLOWED_FILE_EXTENSIONS:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid file type. Allowed: jpg, jpeg, png, pdf")

    if path.stat().st_size > MAX_FILE_SIZE:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File too large (max 10MB)")

    try:
        result = process_document(str(path))
        return success_response(
            {
                "mode": "local_path",
                "path_used": str(path),
                "filename": path.name,
                "status": "success",
                "extracted_data": result,
            }
        )
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error processing file: {exc}") from exc
