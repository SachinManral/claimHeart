from fastapi import APIRouter
from app.core.exceptions import success_response

router = APIRouter()


@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return success_response({
        "status": "healthy",
        "service": "ClaimHeart API",
        "version": "1.0.0"
    })
