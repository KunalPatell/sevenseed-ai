# -*- coding: utf-8 -*-
"""
Sevenseed Hub - Database ORM Models (PostgreSQL / SQLite compatible).
"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, Integer, DateTime, ForeignKey, Text, UniqueConstraint
from sqlalchemy.orm import relationship

from db.db import Base


def generate_uuid():
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=True)
    avatar_url = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    owned_workspaces = relationship("Workspace", back_populates="owner", cascade="all, delete-orphan")
    memberships = relationship("WorkspaceMember", back_populates="user", cascade="all, delete-orphan")


class Workspace(Base):
    __tablename__ = "workspaces"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(100), nullable=False)
    slug = Column(String(100), unique=True, nullable=False, index=True)
    owner_id = Column(String(36), ForeignKey("users.id", ondelete="RESTRICT"), nullable=False)
    plan_tier = Column(String(50), default="FREE_BYOK")  # FREE_BYOK, PRO_STARTER, ENTERPRISE
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    owner = relationship("User", back_populates="owned_workspaces")
    members = relationship("WorkspaceMember", back_populates="workspace", cascade="all, delete-orphan")
    subscription = relationship("Subscription", back_populates="workspace", uselist=False, cascade="all, delete-orphan")
    api_keys = relationship("UserAPIKey", back_populates="workspace", cascade="all, delete-orphan")
    usage_logs = relationship("TokenUsageLog", back_populates="workspace", cascade="all, delete-orphan")


class WorkspaceMember(Base):
    __tablename__ = "workspace_members"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    workspace_id = Column(String(36), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    role = Column(String(50), default="MEMBER")  # OWNER, ADMIN, MEMBER, VIEWER
    joined_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (UniqueConstraint("workspace_id", "user_id", name="uq_workspace_user"),)

    # Relationships
    workspace = relationship("Workspace", back_populates="members")
    user = relationship("User", back_populates="memberships")


class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    workspace_id = Column(String(36), ForeignKey("workspaces.id", ondelete="CASCADE"), unique=True, nullable=False)
    provider = Column(String(50), nullable=False)  # STRIPE, RAZORPAY
    provider_customer_id = Column(String(255), nullable=False)
    provider_subscription_id = Column(String(255), nullable=False)
    status = Column(String(50), nullable=False)  # ACTIVE, PAST_DUE, CANCELED, TRIALING
    current_period_start = Column(DateTime, nullable=True)
    current_period_end = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    workspace = relationship("Workspace", back_populates="subscription")


class UserAPIKey(Base):
    __tablename__ = "user_api_keys"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    workspace_id = Column(String(36), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False)
    provider = Column(String(50), nullable=False)  # groq, gemini, openai, anthropic
    encrypted_key = Column(Text, nullable=False)
    is_valid = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (UniqueConstraint("workspace_id", "provider", name="uq_workspace_provider"),)

    # Relationships
    workspace = relationship("Workspace", back_populates="api_keys")


class TokenUsageLog(Base):
    __tablename__ = "token_usage_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    workspace_id = Column(String(36), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    app_slug = Column(String(50), nullable=False)  # comonk, sevenforce, breakdown, etc.
    model_name = Column(String(100), nullable=False)  # llama-3.3-70b, gemini-1.5-pro, yolo-v8
    prompt_tokens = Column(Integer, default=0)
    completion_tokens = Column(Integer, default=0)
    total_tokens = Column(Integer, default=0)
    is_byok = Column(Boolean, default=False)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)

    # Relationships
    workspace = relationship("Workspace", back_populates="usage_logs")

class CRMCompany(Base):
    __tablename__ = "crm_companies"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False, index=True)
    domain = Column(String(255), nullable=True)
    industry = Column(String(100), nullable=True)
    size = Column(String(50), nullable=True)
    website = Column(String(255), nullable=True)
    phone = Column(String(50), nullable=True)
    address = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    tags = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    contacts = relationship("CRMContact", back_populates="company", cascade="all, delete-orphan")
    deals = relationship("CRMDeal", back_populates="company", cascade="all, delete-orphan")


class CRMContact(Base):
    __tablename__ = "crm_contacts"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    phone = Column(String(50), nullable=True)
    job_title = Column(String(100), nullable=True)
    company_id = Column(String(36), ForeignKey("crm_companies.id", ondelete="SET NULL"), nullable=True)
    linkedin_url = Column(String(255), nullable=True)
    twitter_url = Column(String(255), nullable=True)
    avatar_url = Column(Text, nullable=True)
    source = Column(String(50), nullable=True)
    status = Column(String(50), default="lead")
    tags = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    company = relationship("CRMCompany", back_populates="contacts")
    deals = relationship("CRMDeal", back_populates="contact", cascade="all, delete-orphan")
    activities = relationship("CRMActivity", back_populates="contact", cascade="all, delete-orphan")
    tasks = relationship("CRMTask", back_populates="contact", cascade="all, delete-orphan")


class CRMDeal(Base):
    __tablename__ = "crm_deals"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(255), nullable=False)
    amount = Column(Integer, default=0)
    currency = Column(String(10), default="USD")
    stage = Column(String(50), default="prospect")
    probability = Column(Integer, default=10)
    expected_close_date = Column(DateTime, nullable=True)
    contact_id = Column(String(36), ForeignKey("crm_contacts.id", ondelete="SET NULL"), nullable=True)
    company_id = Column(String(36), ForeignKey("crm_companies.id", ondelete="SET NULL"), nullable=True)
    owner_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    source = Column(String(50), nullable=True)
    description = Column(Text, nullable=True)
    tags = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    contact = relationship("CRMContact", back_populates="deals")
    company = relationship("CRMCompany", back_populates="deals")
    activities = relationship("CRMActivity", back_populates="deal", cascade="all, delete-orphan")
    tasks = relationship("CRMTask", back_populates="deal", cascade="all, delete-orphan")


class CRMActivity(Base):
    __tablename__ = "crm_activities"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    type = Column(String(50), nullable=False)
    subject = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    contact_id = Column(String(36), ForeignKey("crm_contacts.id", ondelete="CASCADE"), nullable=True)
    deal_id = Column(String(36), ForeignKey("crm_deals.id", ondelete="CASCADE"), nullable=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    activity_date = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

    contact = relationship("CRMContact", back_populates="activities")
    deal = relationship("CRMDeal", back_populates="activities")


class CRMTask(Base):
    __tablename__ = "crm_tasks"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String(50), default="todo")
    priority = Column(String(50), default="medium")
    due_date = Column(DateTime, nullable=True)
    contact_id = Column(String(36), ForeignKey("crm_contacts.id", ondelete="CASCADE"), nullable=True)
    deal_id = Column(String(36), ForeignKey("crm_deals.id", ondelete="CASCADE"), nullable=True)
    assigned_to = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    contact = relationship("CRMContact", back_populates="tasks")
    deal = relationship("CRMDeal", back_populates="tasks")
