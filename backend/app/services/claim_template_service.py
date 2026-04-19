from __future__ import annotations

from datetime import datetime

from sqlalchemy.orm import Session

from app.db.models.claim import Claim
from app.db.models.claim_template import ClaimTemplate


def _template_to_dict(template: ClaimTemplate) -> dict:
    return {
        "id": template.id,
        "name": template.name,
        "claim_type": template.claim_type,
        "category": template.category,
        "default_fields": template.default_fields or {},
        "is_public": template.is_public,
        "created_by": template.created_by,
        "created_at": template.created_at,
        "updated_at": template.updated_at,
    }


class ClaimTemplateService:
    def create_template(
        self,
        db: Session,
        name: str,
        claim_type: str,
        category: str,
        default_fields: dict,
        is_public: bool,
        created_by: int,
    ) -> dict:
        template = ClaimTemplate(
            name=name,
            claim_type=claim_type,
            category=category,
            default_fields=default_fields,
            is_public=is_public,
            created_by=created_by,
        )
        db.add(template)
        db.commit()
        db.refresh(template)
        return _template_to_dict(template)

    def list_templates(self, db: Session, user_id: int) -> list[dict]:
        templates = (
            db.query(ClaimTemplate)
            .filter((ClaimTemplate.is_public.is_(True)) | (ClaimTemplate.created_by == user_id))
            .order_by(ClaimTemplate.name.asc())
            .all()
        )
        return [_template_to_dict(template) for template in templates]

    def update_template(
        self,
        db: Session,
        template_id: int,
        user_id: int,
        name: str | None = None,
        default_fields: dict | None = None,
        is_public: bool | None = None,
    ) -> dict:
        template = db.query(ClaimTemplate).filter(ClaimTemplate.id == template_id).first()
        if not template:
            raise ValueError("Template not found")

        if template.created_by not in {None, user_id}:
            raise ValueError("Only the template owner can update it")

        if name is not None:
            template.name = name
        if default_fields is not None:
            template.default_fields = default_fields
        if is_public is not None:
            template.is_public = is_public
        template.updated_at = datetime.utcnow()

        db.add(template)
        db.commit()
        db.refresh(template)
        return _template_to_dict(template)

    def create_claim_from_template(
        self,
        db: Session,
        template_id: int,
        user_id: int,
        claim_number: str,
        patient_name: str,
        policy_number: str,
        amount: float,
    ) -> dict:
        template = db.query(ClaimTemplate).filter(ClaimTemplate.id == template_id).first()
        if not template:
            raise ValueError("Template not found")

        defaults = template.default_fields or {}
        claim = Claim(
            claim_number=claim_number,
            patient_name=patient_name,
            policy_number=policy_number,
            diagnosis=defaults.get("diagnosis"),
            amount=amount,
            status=defaults.get("status", "pending"),
            priority=defaults.get("priority", "normal"),
            notes=defaults.get("notes"),
            created_by=user_id,
        )
        db.add(claim)
        db.commit()
        db.refresh(claim)

        return {
            "id": claim.id,
            "claim_number": claim.claim_number,
            "template_id": template.id,
            "status": claim.status,
            "priority": claim.priority,
        }
