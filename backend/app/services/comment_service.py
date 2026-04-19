from __future__ import annotations

import re
from datetime import datetime

from sqlalchemy.orm import Session

from app.db.models.claim import Claim
from app.db.models.comment import Comment
from app.db.models.user import User


def _to_dict(comment: Comment) -> dict:
    return {
        "id": comment.id,
        "claim_id": comment.claim_id,
        "author_id": comment.author_id,
        "comment_type": comment.comment_type,
        "content": comment.content,
        "visibility": comment.visibility,
        "mentions": comment.mentions or [],
        "attachments": comment.attachments or [],
        "parent_comment_id": comment.parent_comment_id,
        "is_edited": comment.is_edited,
        "created_at": comment.created_at,
        "updated_at": comment.updated_at,
    }


class CommentService:
    def _is_staff(self, user: User) -> bool:
        role = (user.role or "").lower()
        return role in {"admin", "reviewer", "senior_reviewer", "ops", "manager"} or "review" in role

    def _extract_mention_ids(self, text: str) -> list[int]:
        ids = [int(match) for match in re.findall(r"@(\d+)", text)]
        return list(dict.fromkeys(ids))

    def create_comment(
        self,
        db: Session,
        claim_id: int,
        author_id: int | None,
        comment_type: str,
        content: str,
        visibility: str | None = None,
        mentions: list[int] | None = None,
        parent_comment_id: int | None = None,
        attachments: list[str] | None = None,
    ) -> dict:
        claim = db.query(Claim).filter(Claim.id == claim_id).first()
        if not claim:
            raise ValueError("Claim not found")

        if parent_comment_id is not None:
            parent = db.query(Comment).filter(Comment.id == parent_comment_id).first()
            if not parent:
                raise ValueError("Parent comment not found")

        effective_visibility = visibility or ("external" if comment_type == "external" else "internal")
        mention_ids = mentions or self._extract_mention_ids(content)

        comment = Comment(
            claim_id=claim_id,
            author_id=author_id,
            comment_type=comment_type,
            content=content,
            visibility=effective_visibility,
            mentions=mention_ids,
            attachments=attachments or [],
            parent_comment_id=parent_comment_id,
        )
        db.add(comment)
        db.commit()
        db.refresh(comment)
        return _to_dict(comment)

    def list_comments(
        self,
        db: Session,
        claim_id: int,
        requesting_user: User,
        include_deleted: bool = False,
    ) -> list[dict]:
        query = db.query(Comment).filter(Comment.claim_id == claim_id)
        if not include_deleted:
            query = query.filter(Comment.is_deleted.is_(False))
        if not self._is_staff(requesting_user):
            query = query.filter(Comment.visibility == "external")

        comments = query.order_by(Comment.created_at.asc()).all()
        return [_to_dict(comment) for comment in comments]

    def update_comment(
        self,
        db: Session,
        comment_id: int,
        author_id: int,
        content: str,
        attachments: list[str] | None = None,
    ) -> dict:
        comment = db.query(Comment).filter(Comment.id == comment_id).first()
        if not comment or comment.is_deleted:
            raise ValueError("Comment not found")

        if comment.author_id not in {author_id, None}:
            raise ValueError("You can only edit your own comments")

        comment.content = content
        comment.attachments = attachments or []
        comment.is_edited = True
        comment.updated_at = datetime.utcnow()
        db.add(comment)
        db.commit()
        db.refresh(comment)
        return _to_dict(comment)

    def delete_comment(self, db: Session, comment_id: int, author_id: int, is_admin: bool = False) -> dict:
        comment = db.query(Comment).filter(Comment.id == comment_id).first()
        if not comment or comment.is_deleted:
            raise ValueError("Comment not found")

        if not is_admin and comment.author_id not in {author_id, None}:
            raise ValueError("You can only delete your own comments")

        comment.is_deleted = True
        comment.content = "[deleted]"
        comment.updated_at = datetime.utcnow()
        db.add(comment)
        db.commit()
        db.refresh(comment)
        return _to_dict(comment)

    def run(self, payload: dict) -> dict:
        return {"success": True, "service": "comment_service", "payload": payload}
