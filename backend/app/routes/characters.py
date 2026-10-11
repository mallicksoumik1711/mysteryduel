from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.db import SessionLocal
from app.models.db_models import CharacterDB
from app.models.character import Character

router = APIRouter(prefix="/characters", tags=["Characters"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=list[Character])
def get_all_characters(db: Session = Depends(get_db)):
    return (
        db.query(CharacterDB)
        .order_by(CharacterDB.id)
        .all()
    )
