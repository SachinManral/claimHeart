from __future__ import annotations

from datetime import datetime
from sqlalchemy import JSON, Boolean, Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from app.db.base_class import Base


class Comment(Base):
    __tablename__ = "comment"

    id = Column(Integer, primary_key=True, index=True)
    claim_id = Column(Integer, ForeignKey("claims.id"), nullable=False, index=True)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    comment_type = Column(String(16), nullable=False, default="internal", index=True)
    content = Column(Text, nullable=False)
    visibility = Column(String(16), nullable=False, default="internal")
    mentions = Column(JSON, nullable=False, default=list)
    attachments = Column(JSON, nullable=False, default=list)
    parent_comment_id = Column(Integer, ForeignKey("comment.id"), nullable=True, index=True)
    is_edited = Column(Boolean, nullable=False, default=False)
    is_deleted = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    claim = relationship("Claim", back_populates="comments")
    author = relationship("User", back_populates="comments")
    parent = relationship("Comment", remote_side=[id], backref="replies")
