from sqlalchemy import Column, Integer, String, Text, JSON, ForeignKey, Enum, Boolean
import uuid
from database import Base
import enum

class BatchStatus(str, enum.Enum):
    draft = "draft"
    in_queue = "in_queue"
    in_progress = "in_progress"
    review = "review"
    completed = "completed"

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)

class Template(Base):
    __tablename__ = "templates"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String)
    goal = Column(String, default="Claim Status")
    intro = Column(Text, nullable=True)
    call_type = Column(String, default="Claims IVR")
    is_ivr_only = Column(Boolean, default=True)
    is_starred = Column(Boolean, default=False)
    created_by_name = Column(String, nullable=True)
    created_at = Column(String, nullable=True)
    status = Column(String, default="Active") # Active or Draft
    datapoints = Column(String, nullable=True)
    questions = Column(JSON, nullable=True)   # List of input questions
    conditions = Column(JSON, nullable=True)  # List of outcome conditions with fields

class Batch(Base):
    __tablename__ = "batches"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=True)
    status = Column(Enum(BatchStatus), default=BatchStatus.draft)
    template_id = Column(String, ForeignKey("templates.id"))
    created_by = Column(String, ForeignKey("users.id"))
    created_at = Column(String, nullable=True)
    total_calls = Column(Integer, default=0)
    completed_calls = Column(Integer, default=0)
    batch_speed = Column(String, default="max")

class Call(Base):
    __tablename__ = "calls"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    batch_id = Column(String, ForeignKey("batches.id"))
    call_date = Column(String)
    created_on = Column(String)
    call_type = Column(String, default="Claims IVR")
    call_title = Column(String, default="Claim Status")
    call_to = Column(String, default="Insurance")
    call_regarding = Column(String)
    practice_name = Column(String)
    primary_info = Column(String)
    info = Column(String)
    status = Column(String)
    payload = Column(JSON)  # Custom variables
    transcript = Column(Text)
    outcome = Column(JSON)  # Extracted data