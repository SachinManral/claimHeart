from __future__ import annotations

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.db.base_class import Base
from app.db.models.claim import Claim
from app.db.models.claim_assignment import ClaimAssignment
from app.db.models.user import User
from app.services.assignment_service import AssignmentService
from app.services.claim_service import ClaimService
from app.services.claim_template_service import ClaimTemplateService
from app.services.comment_service import CommentService
from app.services.tag_service import TagService


def _session():
    engine = create_engine("sqlite:///:memory:")
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)
    return TestingSessionLocal()


def _create_user(db, email: str, role: str) -> User:
    user = User(
        email=email,
        full_name=email.split("@")[0],
        role=role,
        password_hash="hashed",
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def _create_claim(db, claim_number: str, created_by: int, amount: float = 1000) -> Claim:
    claim = Claim(
        claim_number=claim_number,
        patient_name="Patient",
        policy_number=f"POL-{claim_number}",
        diagnosis="Diagnosis",
        amount=amount,
        status="pending",
        priority="normal",
        created_by=created_by,
    )
    db.add(claim)
    db.commit()
    db.refresh(claim)
    return claim


def test_assignment_auto_assign_prefers_senior_for_high_priority_claim():
    db = _session()
    junior = _create_user(db, "junior@example.com", "reviewer")
    senior = _create_user(db, "senior@example.com", "senior_reviewer")
    creator = _create_user(db, "creator@example.com", "admin")

    already_assigned_claim = _create_claim(db, "CLM-1001", creator.id)
    db.add(
        ClaimAssignment(
            claim_id=already_assigned_claim.id,
            assigned_to=junior.id,
            assigned_by=creator.id,
            assignment_reason="manual",
            priority="medium",
            status="pending",
        )
    )
    db.commit()

    high_amount_claim = _create_claim(db, "CLM-1002", creator.id, amount=900000)
    service = AssignmentService()
    result = service.auto_assign(db=db, claim_id=high_amount_claim.id, priority="high")

    assert result["assigned_to"] == senior.id
    assert result["assignment_reason"] == "auto"


def test_comment_visibility_filters_internal_for_non_staff():
    db = _session()
    reviewer = _create_user(db, "reviewer@example.com", "reviewer")
    patient = _create_user(db, "patient@example.com", "patient")
    claim = _create_claim(db, "CLM-2001", reviewer.id)

    service = CommentService()
    service.create_comment(
        db=db,
        claim_id=claim.id,
        author_id=reviewer.id,
        comment_type="internal",
        content="Internal note",
    )
    service.create_comment(
        db=db,
        claim_id=claim.id,
        author_id=reviewer.id,
        comment_type="external",
        content="External update",
    )

    staff_view = service.list_comments(db=db, claim_id=claim.id, requesting_user=reviewer)
    patient_view = service.list_comments(db=db, claim_id=claim.id, requesting_user=patient)

    assert len(staff_view) == 2
    assert len(patient_view) == 1
    assert patient_view[0]["comment_type"] == "external"


def test_tags_can_be_assigned_and_counted_in_analytics():
    db = _session()
    admin = _create_user(db, "admin@example.com", "admin")
    claim = _create_claim(db, "CLM-3001", admin.id)

    service = TagService()
    tag_a = service.create_tag(db=db, name="urgent", color="#dc2626", description=None, tag_type="system", created_by=admin.id)
    tag_b = service.create_tag(db=db, name="follow-up", color="#2563eb", description=None, tag_type="custom", created_by=admin.id)

    assigned = service.assign_tags_to_claim(db=db, claim_id=claim.id, tag_ids=[tag_a["id"], tag_b["id"]])
    analytics = service.analytics(db=db)

    assert len(assigned["tags"]) == 2
    assert analytics["total_tags"] == 2


def test_template_creates_claim_with_defaults():
    db = _session()
    creator = _create_user(db, "creator2@example.com", "admin")

    service = ClaimTemplateService()
    template = service.create_template(
        db=db,
        name="Surgery Express",
        claim_type="cashless",
        category="surgery",
        default_fields={"diagnosis": "appendicitis", "priority": "high", "status": "under_review"},
        is_public=True,
        created_by=creator.id,
    )

    claim = service.create_claim_from_template(
        db=db,
        template_id=template["id"],
        user_id=creator.id,
        claim_number="CLM-4001",
        patient_name="Riya",
        policy_number="POL-4001",
        amount=25000,
    )

    assert claim["template_id"] == template["id"]
    assert claim["priority"] == "high"
    assert claim["status"] == "under_review"


def test_claim_service_bulk_status_update_and_export():
    db = _session()
    creator = _create_user(db, "creator3@example.com", "admin")
    claim_one = _create_claim(db, "CLM-5001", creator.id)
    claim_two = _create_claim(db, "CLM-5002", creator.id)

    service = ClaimService()
    updated = service.bulk_update_status(
        db=db,
        claim_ids=[claim_one.id, claim_two.id],
        status="under_review",
        priority="high",
        note="bulk updated",
    )
    exported = service.bulk_export(db=db, claim_ids=[claim_one.id, claim_two.id], include_notes=True)

    assert updated["processed"] == 2
    assert exported["count"] == 2
    assert all(item["priority"] == "high" for item in updated["claims"])
