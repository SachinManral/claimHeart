"""initial schema

Revision ID: 20260418_0001
Revises:
Create Date: 2026-04-18 00:00:00
"""

from alembic import op
import sqlalchemy as sa


revision = "20260418_0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("full_name", sa.String(length=120), nullable=False),
        sa.Column("role", sa.String(length=32), nullable=False, server_default="patient"),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.text("now()")),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=True)

    op.create_table(
        "claims",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("claim_number", sa.String(length=32), nullable=False),
        sa.Column("patient_name", sa.String(length=120), nullable=False),
        sa.Column("policy_number", sa.String(length=64), nullable=False),
        sa.Column("diagnosis", sa.String(length=255), nullable=True),
        sa.Column("amount", sa.Numeric(12, 2), nullable=False, server_default="0"),
        sa.Column("status", sa.String(length=32), nullable=False, server_default="pending"),
        sa.Column("priority", sa.String(length=16), nullable=False, server_default="normal"),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("created_by", sa.Integer(), sa.ForeignKey("users.id"), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.text("now()")),
    )
    op.create_index("ix_claims_claim_number", "claims", ["claim_number"], unique=True)
    op.create_index("ix_claims_policy_number", "claims", ["policy_number"], unique=False)
    op.create_index("ix_claims_status", "claims", ["status"], unique=False)

    op.create_table(
        "policies",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("policy_number", sa.String(length=64), nullable=False),
        sa.Column("insurer", sa.String(length=120), nullable=False),
        sa.Column("plan_name", sa.String(length=120), nullable=False),
        sa.Column("policy_type", sa.String(length=32), nullable=False, server_default="individual"),
        sa.Column("effective_date", sa.Date(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.text("now()")),
    )
    op.create_index("ix_policies_policy_number", "policies", ["policy_number"], unique=True)

    op.create_table(
        "fraud_flags",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("claim_id", sa.Integer(), sa.ForeignKey("claims.id", ondelete="CASCADE"), nullable=False),
        sa.Column("score", sa.Numeric(4, 3), nullable=False, server_default="0"),
        sa.Column("flag_type", sa.String(length=64), nullable=False, server_default="rule"),
        sa.Column("reason", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.text("now()")),
    )
    op.create_index("ix_fraud_flags_claim_id", "fraud_flags", ["claim_id"], unique=False)

    op.create_table(
        "letters",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("claim_id", sa.Integer(), sa.ForeignKey("claims.id", ondelete="CASCADE"), nullable=False),
        sa.Column("recipient_type", sa.String(length=32), nullable=False),
        sa.Column("language", sa.String(length=12), nullable=False, server_default="en"),
        sa.Column("subject", sa.String(length=255), nullable=False),
        sa.Column("body", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.text("now()")),
    )
    op.create_index("ix_letters_claim_id", "letters", ["claim_id"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_letters_claim_id", table_name="letters")
    op.drop_table("letters")

    op.drop_index("ix_fraud_flags_claim_id", table_name="fraud_flags")
    op.drop_table("fraud_flags")

    op.drop_index("ix_policies_policy_number", table_name="policies")
    op.drop_table("policies")

    op.drop_index("ix_claims_status", table_name="claims")
    op.drop_index("ix_claims_policy_number", table_name="claims")
    op.drop_index("ix_claims_claim_number", table_name="claims")
    op.drop_table("claims")

    op.drop_index("ix_users_email", table_name="users")
    op.drop_table("users")
