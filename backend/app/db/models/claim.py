from datetime import datetime
from sqlalchemy import Column, DateTime, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import relationship
from app.db.base_class import Base


class Claim(Base):
    __tablename__ = "claims"

    id = Column(Integer, primary_key=True, index=True)
    claim_number = Column(String(32), unique=True, nullable=False, index=True)
    patient_name = Column(String(120), nullable=False)
    policy_number = Column(String(64), nullable=False, index=True)
    diagnosis = Column(String(255), nullable=True)
    amount = Column(Numeric(12, 2), nullable=False, default=0)
    status = Column(String(32), nullable=False, default="pending", index=True)
    priority = Column(String(16), nullable=False, default="normal")
    notes = Column(Text, nullable=True)

    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    creator = relationship("User", back_populates="claims")
    fraud_flags = relationship("FraudFlag", back_populates="claim", cascade="all, delete-orphan")
    letters = relationship("Letter", back_populates="claim", cascade="all, delete-orphan")
