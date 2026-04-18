from datetime import datetime
from sqlalchemy import Column, Date, DateTime, Integer, String
from app.db.base_class import Base


class Policy(Base):
    __tablename__ = "policies"

    id = Column(Integer, primary_key=True, index=True)
    policy_number = Column(String(64), unique=True, nullable=False, index=True)
    insurer = Column(String(120), nullable=False)
    plan_name = Column(String(120), nullable=False)
    policy_type = Column(String(32), nullable=False, default="individual")
    effective_date = Column(Date, nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
