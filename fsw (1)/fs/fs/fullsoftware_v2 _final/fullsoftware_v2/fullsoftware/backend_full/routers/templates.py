from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Template
from schemas import Template as TemplateSchema, TemplateCreate, TemplateUpdate
from typing import List
import uuid
from datetime import datetime, timezone

router = APIRouter()

@router.get("/templates", response_model=List[TemplateSchema])
async def get_templates(db: Session = Depends(get_db)):
    templates = db.query(Template).all()
    return templates

@router.get("/templates/{template_id}", response_model=TemplateSchema)
async def get_template(template_id: str, db: Session = Depends(get_db)):
    template = db.query(Template).filter(Template.id == template_id).first()
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    return template

@router.post("/templates", response_model=TemplateSchema)
async def create_template(template: TemplateCreate, db: Session = Depends(get_db)):
    db_template = Template(
        id=str(uuid.uuid4()),
        created_at=datetime.now(timezone.utc).isoformat(),
        **template.dict()
    )
    db.add(db_template)
    db.commit()
    db.refresh(db_template)
    return db_template

@router.patch("/templates/{template_id}", response_model=TemplateSchema)
async def update_template(template_id: str, template_update: TemplateUpdate, db: Session = Depends(get_db)):
    template = db.query(Template).filter(Template.id == template_id).first()
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    for key, value in template_update.dict(exclude_unset=True).items():
        setattr(template, key, value)
    db.commit()
    db.refresh(template)
    return template

@router.delete("/templates/{template_id}")
async def delete_template(template_id: str, db: Session = Depends(get_db)):
    template = db.query(Template).filter(Template.id == template_id).first()
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    db.delete(template)
    db.commit()
    return {"message": "Template deleted successfully"}

@router.post("/templates/{template_id}/duplicate", response_model=TemplateSchema)
async def duplicate_template(template_id: str, db: Session = Depends(get_db)):
    template = db.query(Template).filter(Template.id == template_id).first()
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    
    new_template = Template(
        id=str(uuid.uuid4()),
        name=f"{template.name} (Copy)",
        goal=template.goal,
        intro=template.intro,
        call_type=template.call_type,
        is_ivr_only=template.is_ivr_only,
        is_starred=False,
        status="Active",
        created_by_name=template.created_by_name,
        created_at=datetime.now(timezone.utc).isoformat(),
        datapoints=template.datapoints,
        questions=template.questions,
        conditions=template.conditions
    )
    db.add(new_template)
    db.commit()
    db.refresh(new_template)
    return new_template
