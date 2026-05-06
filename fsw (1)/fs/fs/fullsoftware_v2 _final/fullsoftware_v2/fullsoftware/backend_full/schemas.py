from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import enum

class BatchStatus(str, enum.Enum):
    draft = "draft"
    in_queue = "in_queue"
    in_progress = "in_progress"
    review = "review"
    completed = "completed"

# ── Template schemas ────────────────────────────────────────────────────────

class TemplateCreate(BaseModel):
    name: str
    goal: Optional[str] = "Claim Status"
    intro: Optional[str] = None
    call_type: Optional[str] = "Claims IVR"
    is_ivr_only: Optional[bool] = True
    is_starred: Optional[bool] = False
    status: Optional[str] = "Active"
    created_by_name: Optional[str] = None
    datapoints: Optional[str] = None
    questions: Optional[List[Dict[str, Any]]] = []
    conditions: Optional[List[Dict[str, Any]]] = []

class TemplateUpdate(BaseModel):
    name: Optional[str] = None
    goal: Optional[str] = None
    intro: Optional[str] = None
    call_type: Optional[str] = None
    is_ivr_only: Optional[bool] = None
    is_starred: Optional[bool] = None
    status: Optional[str] = None
    datapoints: Optional[str] = None
    questions: Optional[List[Dict[str, Any]]] = None
    conditions: Optional[List[Dict[str, Any]]] = None

class Template(BaseModel):
    id: str
    name: str
    goal: Optional[str] = None
    intro: Optional[str] = None
    call_type: Optional[str] = None
    is_ivr_only: Optional[bool] = None
    is_starred: Optional[bool] = None
    created_by_name: Optional[str] = None
    created_at: Optional[str] = None
    status: Optional[str] = "Active"
    datapoints: Optional[str] = None
    questions: Optional[List[Dict[str, Any]]] = None
    conditions: Optional[List[Dict[str, Any]]] = None

    class Config:
        from_attributes = True

# ── Batch schemas ────────────────────────────────────────────────────────────

class BatchCreate(BaseModel):
    template_id: str
    created_by: str
    name: Optional[str] = None
    batch_speed: Optional[str] = "max"

class BatchUpdate(BaseModel):
    status: Optional[BatchStatus] = None
    completed_calls: Optional[int] = None
    name: Optional[str] = None
    batch_speed: Optional[str] = None

class Batch(BaseModel):
    id: str
    name: Optional[str] = None
    status: BatchStatus
    template_id: str
    created_by: str
    created_at: Optional[str] = None
    total_calls: int
    completed_calls: int
    batch_speed: Optional[str] = "max"

    class Config:
        from_attributes = True

# ── Call schemas ─────────────────────────────────────────────────────────────

class CallCreate(BaseModel):
    batch_id: str
    payload: Dict[str, Any]

class CallUpdate(BaseModel):
    transcript: Optional[str] = None
    outcome: Optional[Dict[str, Any]] = None
    status: Optional[str] = None

class Call(BaseModel):
    id: str
    batch_id: str
    call_date: str
    created_on: str
    call_type: str
    call_title: str
    call_to: str
    call_regarding: str
    practice_name: str
    primary_info: str
    info: str
    status: str
    payload: Optional[Dict[str, Any]]
    transcript: Optional[str]
    outcome: Optional[Dict[str, Any]]

    class Config:
        from_attributes = True
