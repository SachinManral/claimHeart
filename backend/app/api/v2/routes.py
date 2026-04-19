from fastapi import APIRouter

from app.api.routes import assignments, claims, comments, documents, health, policies, tags, templates
from app.core.exceptions import success_response

router = APIRouter()

router.include_router(health.router, tags=["v2-Health"])
router.include_router(claims.router, prefix="/claims", tags=["v2-Claims"])
router.include_router(assignments.router, prefix="/assignments", tags=["v2-Assignments"])
router.include_router(comments.router, prefix="/comments", tags=["v2-Comments"])
router.include_router(tags.router, prefix="/tags", tags=["v2-Tags"])
router.include_router(templates.router, prefix="/templates", tags=["v2-Templates"])
router.include_router(documents.router, tags=["v2-Documents"])
router.include_router(policies.router, prefix="/policies", tags=["v2-Policies"])


@router.get("/meta")
def version_meta():
    return success_response({"version": "2.0", "deprecated": False, "notes": "Enhanced API with bulk operations and template flows."})
