from __future__ import annotations

from datetime import datetime
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from app.db.base_class import Base


class ClaimAssignment(Base):
    __tablename__ = "claim_assignment"

    id = Column(Integer, primary_key=True, index=True)
    claim_id = Column(Integer, ForeignKey("claims.id"), nullable=False, index=True)
    assigned_to = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    assigned_by = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    assignment_reason = Column(String(32), nullable=False, default="auto")
    priority = Column(String(16), nullable=False, default="medium")
    due_date = Column(DateTime, nullable=True)
    status = Column(String(32), nullable=False, default="pending")
    notes = Column(Text, nullable=True)
    assigned_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    claim = relationship("Claim", back_populates="assignments")
    assignee = relationship("User", foreign_keys=[assigned_to], back_populates="assigned_claims")
