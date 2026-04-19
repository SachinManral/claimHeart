from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import assignments, claims, comments, documents, health, ocr, policies, tags, templates, users
from app.api.v1 import router as v1_router
from app.api.v2 import router as v2_router
from app.core.config import settings
from app.core.exceptions import setup_exception_handlers, success_response
from app.db.base_class import Base
from app.db.session import engine
from app.middleware.profiling_middleware import ProfilingMiddleware
from app.middleware.version_middleware import VersionMiddleware
import app.db.models  # noqa: F401

openapi_tags = [
    {"name": "Health", "description": "Service health and readiness endpoints."},
    {"name": "Auth", "description": "Authentication, token, and user profile APIs."},
    {"name": "Claims", "description": "Claim CRUD, bulk operations, and upload workflows."},
    {"name": "Documents", "description": "Document upload and signed download URL operations."},
    {"name": "Policies", "description": "Policy analysis and ingestion endpoints."},
    {"name": "Assignments", "description": "Auto/manual claim assignment and status tracking."},
    {"name": "Comments", "description": "Claim comment threads and notes."},
    {"name": "Tags", "description": "Claim tagging, filtering, and analytics."},
    {"name": "Templates", "description": "Claim templates and template-based claim creation."},
]

app = FastAPI(
    title=settings.app_name,
    description="Medical Claims Processing System",
    version=settings.app_version,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    openapi_tags=openapi_tags,
    contact={"name": "ClaimHeart Platform Team", "email": "support@claimheart.local"},
    license_info={"name": "MIT", "url": "https://opensource.org/licenses/MIT"},
)

# Ensure schema exists for local/dev runs where migrations are not applied yet.
Base.metadata.create_all(bind=engine)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "Accept"],
)
app.add_middleware(VersionMiddleware)
app.add_middleware(ProfilingMiddleware)

setup_exception_handlers(app)

# Include routers
app.include_router(health.router, prefix="/api", tags=["Health"])
app.include_router(ocr.router, prefix="/api/ocr", tags=["OCR"])
app.include_router(users.router, prefix="/api/auth", tags=["Auth"])
app.include_router(claims.router, prefix="/api/claims", tags=["Claims"])
app.include_router(assignments.router, prefix="/api/assignments", tags=["Assignments"])
app.include_router(comments.router, prefix="/api/comments", tags=["Comments"])
app.include_router(tags.router, prefix="/api/tags", tags=["Tags"])
app.include_router(templates.router, prefix="/api/templates", tags=["Templates"])
app.include_router(documents.router, prefix="/api", tags=["Documents"])
app.include_router(policies.router, prefix="/api/policies", tags=["Policies"])

# Versioned APIs
app.include_router(v1_router, prefix="/api/v1")
app.include_router(v2_router, prefix="/api/v2")


@app.get("/")
async def root():
    return success_response({"message": "ClaimHeart API is running", "version": settings.app_version})
