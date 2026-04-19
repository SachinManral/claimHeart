from __future__ import annotations

from sqlalchemy.orm import Session

from app.db.models.claim import Claim
from app.db.models.tag import Tag


def _to_dict(tag: Tag) -> dict:
    return {
        "id": tag.id,
        "name": tag.name,
        "color": tag.color,
        "description": tag.description,
        "tag_type": tag.tag_type,
        "created_by": tag.created_by,
        "created_at": tag.created_at,
    }


class TagService:
    def create_tag(
        self,
        db: Session,
        name: str,
        color: str,
        description: str | None,
        tag_type: str,
        created_by: int | None,
    ) -> dict:
        existing = db.query(Tag).filter(Tag.name == name).first()
        if existing:
            raise ValueError("Tag with this name already exists")

        tag = Tag(
            name=name,
            color=color,
            description=description,
            tag_type=tag_type,
            created_by=created_by,
        )
        db.add(tag)
        db.commit()
        db.refresh(tag)
        return _to_dict(tag)

    def list_tags(self, db: Session) -> list[dict]:
        tags = db.query(Tag).order_by(Tag.name.asc()).all()
        return [_to_dict(tag) for tag in tags]

    def update_tag(self, db: Session, tag_id: int, color: str | None = None, description: str | None = None) -> dict:
        tag = db.query(Tag).filter(Tag.id == tag_id).first()
        if not tag:
            raise ValueError("Tag not found")

        if color is not None:
            tag.color = color
        if description is not None:
            tag.description = description

        db.add(tag)
        db.commit()
        db.refresh(tag)
        return _to_dict(tag)

    def assign_tags_to_claim(self, db: Session, claim_id: int, tag_ids: list[int]) -> dict:
        claim = db.query(Claim).filter(Claim.id == claim_id).first()
        if not claim:
            raise ValueError("Claim not found")

        tags = db.query(Tag).filter(Tag.id.in_(tag_ids)).all()
        if len(tags) != len(set(tag_ids)):
            raise ValueError("One or more tags not found")

        claim.tags = tags
        db.add(claim)
        db.commit()
        db.refresh(claim)

        return {
            "claim_id": claim.id,
            "tags": [_to_dict(tag) for tag in claim.tags],
        }

    def get_claim_tags(self, db: Session, claim_id: int) -> dict:
        claim = db.query(Claim).filter(Claim.id == claim_id).first()
        if not claim:
            raise ValueError("Claim not found")

        return {
            "claim_id": claim.id,
            "tags": [_to_dict(tag) for tag in claim.tags],
        }

    def analytics(self, db: Session) -> dict:
        tags = db.query(Tag).all()
        return {
            "total_tags": len(tags),
            "custom_tags": len([tag for tag in tags if tag.tag_type == "custom"]),
            "system_tags": len([tag for tag in tags if tag.tag_type == "system"]),
            "usage": [{"tag": tag.name, "claims": len(tag.claims)} for tag in tags],
        }

    def run(self, payload: dict) -> dict:
        return {"success": True, "service": "tag_service", "payload": payload}
