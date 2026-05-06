from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Batch, Template, BatchStatus
from schemas import Batch as BatchSchema, BatchCreate, BatchUpdate
from typing import List
import uuid
from datetime import datetime, timezone

router = APIRouter()

@router.post("/batches", response_model=BatchSchema)
async def create_batch(batch: BatchCreate, db: Session = Depends(get_db)):
    db_batch = Batch(
        id=str(uuid.uuid4()),
        created_at=datetime.now(timezone.utc).isoformat(),
        **batch.dict()
    )
    db.add(db_batch)
    db.commit()
    db.refresh(db_batch)
    return db_batch

@router.get("/batches", response_model=List[BatchSchema])
async def get_batches(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    batches = db.query(Batch).offset(skip).limit(limit).all()
    return batches

@router.get("/batches/{batch_id}", response_model=BatchSchema)
async def get_batch(batch_id: str, db: Session = Depends(get_db)):
    batch = db.query(Batch).filter(Batch.id == batch_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")
    return batch

@router.patch("/batches/{batch_id}", response_model=BatchSchema)
async def update_batch(batch_id: str, batch_update: BatchUpdate, db: Session = Depends(get_db)):
    batch = db.query(Batch).filter(Batch.id == batch_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")
    for key, value in batch_update.dict(exclude_unset=True).items():
        if key == 'status':
            value = BatchStatus(value)
        setattr(batch, key, value)
    db.commit()
    db.refresh(batch)
    return batch

@router.delete("/batches/{batch_id}")
async def delete_batch(batch_id: str, db: Session = Depends(get_db)):
    batch = db.query(Batch).filter(Batch.id == batch_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")
    db.delete(batch)
    db.commit()
    return {"message": "Batch deleted successfully"}

@router.post("/batches/{batch_id}/duplicate", response_model=BatchSchema)
async def duplicate_batch(batch_id: str, db: Session = Depends(get_db)):
    batch = db.query(Batch).filter(Batch.id == batch_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")
    
    # Create a new batch with the same properties but new ID and " - Copy" name
    new_batch = Batch(
        id=str(uuid.uuid4()),
        name=f"{batch.name or batch.id} - copy",
        status=BatchStatus.draft,
        template_id=batch.template_id,
        created_by=batch.created_by,
        created_at=datetime.now(timezone.utc).isoformat(),
        total_calls=batch.total_calls,
        completed_calls=0,
        batch_speed=batch.batch_speed
    )
    db.add(new_batch)
    db.commit()
    db.refresh(new_batch)
    return new_batch
 