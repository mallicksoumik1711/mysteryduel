from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.db import SessionLocal
from app.models.db_models import QuestionDB
from app.models.question import Question

router = APIRouter(prefix="/questions", tags=["Questions"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=list[Question])
def get_all_questions(db: Session = Depends(get_db)):
    return (
        db.query(QuestionDB)
        .order_by(QuestionDB.id)
        .all()
    )