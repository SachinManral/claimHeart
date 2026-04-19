from fastapi import APIRouter

from app.api.routes import assignments, claims, comments, documents, health, ocr, policies, tags, templates, users
from app.core.exceptions import success_response

router = APIRouter()

router.include_router(health.router, tags=["v1-Health"])
router.include_router(ocr.router, prefix="/ocr", tags=["v1-OCR"])
router.include_router(users.router, prefix="/auth", tags=["v1-Auth"])
router.include_router(claims.router, prefix="/claims", tags=["v1-Claims"])
router.include_router(assignments.router, prefix="/assignments", tags=["v1-Assignments"])
router.include_router(comments.router, prefix="/comments", tags=["v1-Comments"])
router.include_router(tags.router, prefix="/tags", tags=["v1-Tags"])
router.include_router(templates.router, prefix="/templates", tags=["v1-Templates"])
router.include_router(documents.router, tags=["v1-Documents"])
router.include_router(policies.router, prefix="/policies", tags=["v1-Policies"])


@router.get("/meta")
def version_meta():
    return success_response({"version": "1.0", "deprecated": False})
