from __future__ import annotations

from datetime import datetime, timedelta

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.db.models.claim import Claim
from app.db.models.claim_assignment import ClaimAssignment
from app.db.models.user import User


def _to_dict(assignment: ClaimAssignment) -> dict:
    return {
        "id": assignment.id,
        "claim_id": assignment.claim_id,
        "assigned_to": assignment.assigned_to,
        "assigned_by": assignment.assigned_by,
        "assignment_reason": assignment.assignment_reason,
        "priority": assignment.priority,
        "due_date": assignment.due_date,
        "status": assignment.status,
        "notes": assignment.notes,
        "assigned_at": assignment.assigned_at,
    }


class AssignmentService:
    STAFF_ROLES = {"reviewer", "senior_reviewer", "admin", "ops", "manager"}

    def _is_reviewer(self, user: User) -> bool:
        role = (user.role or "").strip().lower()
        return role in self.STAFF_ROLES or "review" in role

    def _priority_due_date(self, priority: str) -> datetime:
        window = {
            "urgent": 1,
            "high": 2,
            "medium": 3,
            "low": 5,
        }.get(priority, 3)
        return datetime.utcnow() + timedelta(days=window)

    def _active_assignment_workload(self, db: Session) -> dict[int, int]:
        rows = (
            db.query(ClaimAssignment.assigned_to, func.count(ClaimAssignment.id))
            .filter(ClaimAssignment.status.in_(["pending", "in_progress"]))
            .group_by(ClaimAssignment.assigned_to)
            .all()
        )
        return {assigned_to: count for assigned_to, count in rows}

    def _select_assignee(self, db: Session, claim: Claim, priority: str) -> User:
        users = db.query(User).filter(User.is_active.is_(True)).all()
        candidates = [user for user in users if self._is_reviewer(user)]
        if not candidates:
            raise ValueError("No active reviewers available")

        workload = self._active_assignment_workload(db)

        # Lower score wins: lower workload first, then higher expertise score.
        ranked_candidates: list[tuple[int, int, int, User]] = []
        for user in candidates:
            expertise_score = 0
            role = (user.role or "").lower()
            if priority in {"high", "urgent"} and "senior" in role:
                expertise_score += 3
            if claim.amount and float(claim.amount) > 500000 and "senior" in role:
                expertise_score += 2
            if claim.status in {"fraud", "escalated"} and "senior" in role:
                expertise_score += 2

            ranked_candidates.append(
                (
                    workload.get(user.id, 0),
                    -expertise_score,
                    user.id,
                    user,
                )
            )

        ranked_candidates.sort(key=lambda item: (item[0], item[1], item[2]))
        return ranked_candidates[0][3]

    def _close_existing_open_assignments(self, db: Session, claim_id: int, notes: str | None = None) -> None:
        existing = (
            db.query(ClaimAssignment)
            .filter(ClaimAssignment.claim_id == claim_id)
            .filter(ClaimAssignment.status.in_(["pending", "in_progress"]))
            .all()
        )
        for assignment in existing:
            assignment.status = "completed"
            if notes:
                assignment.notes = notes
            db.add(assignment)

    def auto_assign(self, db: Session, claim_id: int, priority: str = "medium") -> dict:
        claim = db.query(Claim).filter(Claim.id == claim_id).first()
        if not claim:
            raise ValueError("Claim not found")

        assignee = self._select_assignee(db=db, claim=claim, priority=priority)
        self._close_existing_open_assignments(db=db, claim_id=claim.id)

        assignment = ClaimAssignment(
            claim_id=claim.id,
            assigned_to=assignee.id,
            assigned_by=None,
            assignment_reason="auto",
            priority=priority,
            due_date=self._priority_due_date(priority),
            status="pending",
            notes="Auto-assigned based on workload and expertise",
        )
        db.add(assignment)
        db.commit()
        db.refresh(assignment)
        return _to_dict(assignment)

    def manual_assign(
        self,
        db: Session,
        claim_id: int,
        assigned_to: int,
        assigned_by: int,
        priority: str = "medium",
        due_date: datetime | None = None,
        notes: str | None = None,
    ) -> dict:
        claim = db.query(Claim).filter(Claim.id == claim_id).first()
        if not claim:
            raise ValueError("Claim not found")

        assignee = db.query(User).filter(User.id == assigned_to).filter(User.is_active.is_(True)).first()
        if not assignee:
            raise ValueError("Assignee not found or inactive")

        self._close_existing_open_assignments(db=db, claim_id=claim.id)

        assignment = ClaimAssignment(
            claim_id=claim.id,
            assigned_to=assigned_to,
            assigned_by=assigned_by,
            assignment_reason="manual",
            priority=priority,
            due_date=due_date or self._priority_due_date(priority),
            status="pending",
            notes=notes,
        )
        db.add(assignment)
        db.commit()
        db.refresh(assignment)
        return _to_dict(assignment)

    def reassign(self, db: Session, assignment_id: int, assigned_to: int, assigned_by: int, notes: str | None = None) -> dict:
        current = db.query(ClaimAssignment).filter(ClaimAssignment.id == assignment_id).first()
        if not current:
            raise ValueError("Assignment not found")

        assignee = db.query(User).filter(User.id == assigned_to).filter(User.is_active.is_(True)).first()
        if not assignee:
            raise ValueError("Assignee not found or inactive")

        self._close_existing_open_assignments(
            db=db,
            claim_id=current.claim_id,
            notes=f"Reassigned by user {assigned_by}",
        )

        new_assignment = ClaimAssignment(
            claim_id=current.claim_id,
            assigned_to=assigned_to,
            assigned_by=assigned_by,
            assignment_reason="reassignment",
            priority=current.priority,
            due_date=current.due_date,
            status="pending",
            notes=notes,
        )
        db.add(new_assignment)
        db.commit()
        db.refresh(new_assignment)
        return _to_dict(new_assignment)

    def list_assignments(self, db: Session, claim_id: int | None = None) -> list[dict]:
        query = db.query(ClaimAssignment)
        if claim_id is not None:
            query = query.filter(ClaimAssignment.claim_id == claim_id)
        assignments = query.order_by(ClaimAssignment.assigned_at.desc()).all()
        return [_to_dict(assignment) for assignment in assignments]

    def update_status(self, db: Session, assignment_id: int, status: str) -> dict:
        assignment = db.query(ClaimAssignment).filter(ClaimAssignment.id == assignment_id).first()
        if not assignment:
            raise ValueError("Assignment not found")

        assignment.status = status
        db.add(assignment)
        db.commit()
        db.refresh(assignment)
        return _to_dict(assignment)

    def run(self, payload: dict) -> dict:
        return {"success": True, "service": "assignment_service", "payload": payload}
