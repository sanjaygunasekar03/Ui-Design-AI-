from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base, SessionLocal
from routers import batches, calls, templates
from models import User, Template, Batch, Call, BatchStatus
import json

# Create database tables
Base.metadata.create_all(bind=engine)

# Default conditions for Claim Status template
DEFAULT_CONDITIONS = [
    {
        "id": "paid",
        "name": "Paid",
        "visible": True,
        "fields": [
            {"id": "transaction_check_number", "name": "Transaction/Check Number", "visible": True, "required": False},
            {"id": "amount_paid", "name": "Amount Paid", "visible": True, "required": False},
            {"id": "claim_paid_date", "name": "Claim Paid Date", "visible": True, "required": False},
            {"id": "patient_responsibility", "name": "Patient Responsibility", "visible": True, "required": False},
            {"id": "eft_number", "name": "EFT Number", "visible": True, "required": False}
        ]
    },
    {
        "id": "denied",
        "name": "Denied",
        "visible": True,
        "fields": [
            {"id": "denial_reason", "name": "Denial Reason", "visible": True, "required": False},
            {"id": "received_date", "name": "Received Date", "visible": True, "required": False},
            {"id": "claim_number", "name": "Claim Number", "visible": True, "required": False}
        ]
    },
    {
        "id": "in_progress",
        "name": "In Progress",
        "visible": True,
        "fields": [
            {"id": "expected_processing_time", "name": "Expected Processing Time", "visible": True, "required": False}
        ]
    }
]

# Populate sample data if not exists
db = SessionLocal()
if not db.query(User).first():
    # Sample Users
    user1 = User(id="user1", username="admin", email="admin@example.com")
    db.add(user1)

    # Sample Templates
    template1 = Template(
        id="template1",
        name="Claim Status - IVR Only",
        goal="Claim Status",
        intro="Hello, I'm calling to check the status of a claim for Bristol Healthcare Services.",
        call_type="Claims IVR",
        is_ivr_only=True,
        is_starred=True,
        status="Active",
        created_by_name="AC",
        created_at="2026-04-01T00:00:00Z",
        datapoints="1-8 Datapoints",
        questions=[
            {"id": "dob", "type": "date", "label": "Date of Birth"},
            {"id": "dos", "type": "date", "label": "Date of Service"},
            {"id": "member_id", "type": "text", "label": "Member ID"}
        ],
        conditions=DEFAULT_CONDITIONS
    )
    template2 = Template(
        id="template2",
        name="Claim Status (NR) - Standard",
        goal="Claim Status",
        intro="Hello, calling regarding a claim status for Bristol Healthcare.",
        call_type="Claims IVR",
        is_ivr_only=False,
        is_starred=False,
        status="Active",
        created_by_name="BC",
        created_at="2026-03-15T00:00:00Z",
        datapoints="3-6 Datapoints",
        questions=[
            {"id": "dob", "type": "date", "label": "Date of Birth"},
            {"id": "dos", "type": "date", "label": "Date of Service"},
            {"id": "member_id", "type": "text", "label": "Member ID"},
            {"id": "claim_number", "type": "text", "label": "Claim Number"}
        ],
        conditions=DEFAULT_CONDITIONS
    )
    template3 = Template(
        id="template3",
        name="Draft: Verification Template",
        goal="Verification",
        intro="Hello, verifying information.",
        call_type="General",
        is_ivr_only=True,
        is_starred=False,
        status="Draft",
        created_by_name="AC",
        created_at="2026-04-10T00:00:00Z",
        datapoints="1-2 Datapoints",
        questions=[{"id": "name", "type": "text", "label": "Name"}],
        conditions=DEFAULT_CONDITIONS
    )
    db.add(template1)
    db.add(template2)
    db.add(template3)

    # Sample Batches
    batch1 = Batch(
        id="batch1",
        name="0401 Part1",
        status=BatchStatus.in_progress,
        template_id="template1",
        created_by="user1",
        created_at="2026-04-01T10:00:00Z",
        total_calls=10,
        completed_calls=7
    )
    batch2 = Batch(
        id="batch2",
        name="Batch 1 - AC Jan 03, 2026",
        status=BatchStatus.completed,
        template_id="template1",
        created_by="user1",
        created_at="2026-03-30T09:00:00Z",
        total_calls=5,
        completed_calls=5
    )
    batch3 = Batch(
        id="batch3",
        name="Comm Ins 740325",
        status=BatchStatus.review,
        template_id="template1",
        created_by="user1",
        created_at="2026-03-28T08:00:00Z",
        total_calls=8,
        completed_calls=6
    )
    db.add(batch1)
    db.add(batch2)
    db.add(batch3)

    # Sample Calls
    call1 = Call(
        id="C-4475",
        batch_id="batch1",
        call_date="2024-04-01",
        created_on="2024-04-01T10:30:00Z",
        call_type="Claims IVR",
        call_title="Medicare Claim Status",
        call_to="Medicare",
        call_regarding="Browning, Glenn",
        practice_name="ABC Clinic",
        primary_info="Denied",
        info="$0 paid",
        status="Review",
        payload={"dob": "1990-01-01", "dos": "2023-01-01", "member_id": "12345"},
        transcript="AI: Hello, this is an automated call...",
        outcome={"paid_amount": 0.0, "denial_reason": "Invalid claim"}
    )
    call2 = Call(
        id="C-4474",
        batch_id="batch1",
        call_date="2024-03-30",
        created_on="2024-03-30T14:15:00Z",
        call_type="Claims IVR",
        call_title="UnitedHealthcare Status",
        call_to="UnitedHealthcare",
        call_regarding="Brown, Cynthia",
        practice_name="XYZ Hospital",
        primary_info="Paid",
        info="$150.00",
        status="Completed",
        payload={"dob": "1985-05-05", "dos": "2023-02-01", "member_id": "67890"},
        transcript="AI: Claim status inquiry...",
        outcome={"paid_amount": 150.0, "denial_reason": None}
    )
    call3 = Call(
        id="C-4473",
        batch_id="batch2",
        call_date="2024-03-28",
        created_on="2024-03-28T11:00:00Z",
        call_type="Claims IVR",
        call_title="Humana Claim Status",
        call_to="Humana",
        call_regarding="Smith, John",
        practice_name="ABC Clinic",
        primary_info="Paid",
        info="$220.00",
        status="Completed",
        payload={"dob": "1978-03-15", "dos": "2023-03-01", "member_id": "11223"},
        transcript="AI: Calling Humana for claim status...",
        outcome={"paid_amount": 220.0, "denial_reason": None}
    )
    call4 = Call(
        id="C-4472",
        batch_id="batch3",
        call_date="2024-03-26",
        created_on="2024-03-26T09:45:00Z",
        call_type="Claims IVR",
        call_title="BCBS Claim Status",
        call_to="Blue Cross Blue Shield",
        call_regarding="Johnson, Mary",
        practice_name="XYZ Hospital",
        primary_info="In Progress",
        info="Processing",
        status="Review",
        payload={"dob": "1965-07-20", "dos": "2023-03-10", "member_id": "44556"},
        transcript="AI: Calling BCBS for claim status...",
        outcome={"paid_amount": None, "denial_reason": None}
    )
    db.add(call1)
    db.add(call2)
    db.add(call3)
    db.add(call4)

    db.commit()
db.close()

app = FastAPI(title="Standard Practice Backend", version="1.0.0")

# CORS middleware to allow frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(batches.router, prefix="/api/v1", tags=["batches"])
app.include_router(calls.router, prefix="/api/v1", tags=["calls"])
app.include_router(templates.router, prefix="/api/v1", tags=["templates"])

@app.get("/")
async def root():
    return {"message": "Standard Practice Backend API"}
