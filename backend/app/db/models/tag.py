from __future__ import annotations

from datetime import datetime
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Table, Text
from sqlalchemy.orm import relationship
from app.db.base_class import Base


claim_tags = Table(
    "claim_tags",
    Base.metadata,
    Column("claim_id", Integer, ForeignKey("claims.id"), primary_key=True),
    Column("tag_id", Integer, ForeignKey("tag.id"), primary_key=True),
    Column("created_at", DateTime, nullable=False, default=datetime.utcnow),
)


class Tag(Base):
    __tablename__ = "tag"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False, unique=True, index=True)
    color = Column(String(7), nullable=False, default="#2563eb")
    description = Column(Text, nullable=True)
    tag_type = Column(String(16), nullable=False, default="custom")
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    claims = relationship("Claim", secondary=claim_tags, back_populates="tags")
