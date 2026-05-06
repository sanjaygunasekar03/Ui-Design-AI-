from database import SessionLocal, engine, Base
from models import User, Template, Batch, Call
import json

Base.metadata.create_all(bind=engine)

db = SessionLocal()

# Sample Users
user1 = User(id="user1", username="admin", email="admin@example.com")
db.add(user1)

# Sample Templates
template1 = Template(id="template1", name="Claim Status", questions=[
    {"id": "dob", "type": "date", "label": "Date of Birth"},
    {"id": "dos", "type": "date", "label": "Date of Service"},
    {"id": "member_id", "type": "text", "label": "Member ID"}
])
db.add(template1)

# Sample Batches
batch1 = Batch(id="batch1", status="In Progress", template_id="template1", created_by="user1", total_calls=10, completed_calls=7)
batch2 = Batch(id="batch2", status="Completed", template_id="template1", created_by="user1", total_calls=5, completed_calls=5)
db.add(batch1)
db.add(batch2)

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
db.add(call1)
db.add(call2)

db.commit()
db.close()

print("Sample data populated.")