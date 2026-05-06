from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db
from models import Call
from schemas import Call as CallSchema, CallCreate, CallUpdate
from typing import List, Optional

router = APIRouter()

@router.post("/calls", response_model=CallSchema)
async def create_call(call: CallCreate, db: Session = Depends(get_db)):
    db_call = Call(**call.dict())
    db.add(db_call)
    db.commit()
    db.refresh(db_call)
    return db_call

@router.get("/calls", response_model=List[CallSchema])
async def get_calls(
    batch_id: Optional[str] = Query(None),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(Call)
    if batch_id:
        query = query.filter(Call.batch_id == batch_id)
    calls = query.offset(skip).limit(limit).all()
    return calls

@router.get("/calls/{call_id}", response_model=CallSchema)
async def get_call(call_id: str, db: Session = Depends(get_db)):
    call = db.query(Call).filter(Call.id == call_id).first()
    if not call:
        raise HTTPException(status_code=404, detail="Call not found")
    return call

@router.patch("/calls/{call_id}", response_model=CallSchema)
async def update_call(call_id: str, call_update: CallUpdate, db: Session = Depends(get_db)):
    call = db.query(Call).filter(Call.id == call_id).first()
    if not call:
        raise HTTPException(status_code=404, detail="Call not found")
    for key, value in call_update.dict(exclude_unset=True).items():
        setattr(call, key, value)
    db.commit()
    db.refresh(call)
    return call