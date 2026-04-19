from __future__ import annotations

from datetime import datetime
from sqlalchemy import JSON, Boolean, Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class ClaimTemplate(Base):
    __tablename__ = "claim_template"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False, index=True)
    claim_type = Column(String(32), nullable=False, default="reimbursement")
    category = Column(String(32), nullable=False, default="general")
    default_fields = Column(JSON, nullable=False, default=dict)
    is_public = Column(Boolean, nullable=False, default=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    creator = relationship("User", back_populates="templates")
