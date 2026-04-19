from __future__ import annotations

from datetime import datetime
from decimal import Decimal

from sqlalchemy.orm import Session

from app.db.models.claim import Claim
from app.db.models.claim_assignment import ClaimAssignment
from app.db.models.user import User


def _amount(value: Decimal | float | int | None) -> float:
    if value is None:
        return 0.0
    if isinstance(value, Decimal):
        return float(value)
    return float(value)


def _serialize_claim(claim: Claim) -> dict:
    return {
        "id": claim.id,
        "claim_number": claim.claim_number,
        "patient_name": claim.patient_name,
        "policy_number": claim.policy_number,
        "diagnosis": claim.diagnosis,
        "amount": _amount(claim.amount),
        "status": claim.status,
        "priority": claim.priority,
        "notes": claim.notes,
        "created_by": claim.created_by,
        "created_at": claim.created_at,
        "updated_at": claim.updated_at,
    }


class ClaimService:
    def _find_claims(self, db: Session, claim_ids: list[int]) -> list[Claim]:
        claims = db.query(Claim).filter(Claim.id.in_(claim_ids)).all()
        if len(claims) != len(set(claim_ids)):
            raise ValueError("One or more claims not found")
        return claims

    def bulk_approve(self, db: Session, claim_ids: list[int], decision: str, note: str | None = None) -> dict:
        claims = self._find_claims(db=db, claim_ids=claim_ids)

        for claim in claims:
            claim.status = decision
            if note:
                claim.notes = note
            claim.updated_at = datetime.utcnow()
            db.add(claim)

        db.commit()
        return {
            "processed": len(claims),
            "decision": decision,
            "claims": [_serialize_claim(claim) for claim in claims],
        }

    def bulk_assign(
        self,
        db: Session,
        claim_ids: list[int],
        assigned_to: int,
        assigned_by: int,
        note: str | None = None,
    ) -> dict:
        claims = self._find_claims(db=db, claim_ids=claim_ids)
        assignee = db.query(User).filter(User.id == assigned_to).filter(User.is_active.is_(True)).first()
        if not assignee:
            raise ValueError("Assignee not found or inactive")

        created_assignments = []
        for claim in claims:
            # Complete active assignments before adding a new one.
            active = (
                db.query(ClaimAssignment)
                .filter(ClaimAssignment.claim_id == claim.id)
                .filter(ClaimAssignment.status.in_(["pending", "in_progress"]))
                .all()
            )
            for assignment in active:
                assignment.status = "completed"
                db.add(assignment)

            assignment = ClaimAssignment(
                claim_id=claim.id,
                assigned_to=assigned_to,
                assigned_by=assigned_by,
                assignment_reason="manual",
                priority="medium",
                status="pending",
                notes=note,
            )
            db.add(assignment)
            created_assignments.append(assignment)

        db.commit()
        for assignment in created_assignments:
            db.refresh(assignment)

        return {
            "processed": len(created_assignments),
            "assigned_to": assigned_to,
            "assignments": [
                {
                    "id": assignment.id,
                    "claim_id": assignment.claim_id,
                    "status": assignment.status,
                    "assigned_at": assignment.assigned_at,
                }
                for assignment in created_assignments
            ],
        }

    def bulk_update_status(
        self,
        db: Session,
        claim_ids: list[int],
        status: str,
        priority: str | None = None,
        note: str | None = None,
    ) -> dict:
        claims = self._find_claims(db=db, claim_ids=claim_ids)

        for claim in claims:
            claim.status = status
            if priority is not None:
                claim.priority = priority
            if note:
                claim.notes = note
            claim.updated_at = datetime.utcnow()
            db.add(claim)

        db.commit()
        return {
            "processed": len(claims),
            "status": status,
            "claims": [_serialize_claim(claim) for claim in claims],
        }

    def bulk_export(self, db: Session, claim_ids: list[int], include_notes: bool = True) -> dict:
        claims = self._find_claims(db=db, claim_ids=claim_ids)
        rows: list[dict] = []
        for claim in claims:
            row = {
                "claim_id": claim.id,
                "claim_number": claim.claim_number,
                "patient_name": claim.patient_name,
                "policy_number": claim.policy_number,
                "amount": _amount(claim.amount),
                "status": claim.status,
                "priority": claim.priority,
            }
            if include_notes:
                row["notes"] = claim.notes
            rows.append(row)

        return {
            "count": len(rows),
            "generated_at": datetime.utcnow(),
            "items": rows,
        }

    def run(self, payload: dict) -> dict:
        return {"success": True, "service": "claim_service", "payload": payload}
