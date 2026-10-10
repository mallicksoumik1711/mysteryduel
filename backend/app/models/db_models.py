import uuid

from sqlalchemy import String, Integer, Boolean
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class CharacterDB(Base):
    __tablename__ = "characters"

    id: Mapped[str] = mapped_column(
        String,
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    image_url: Mapped[str | None] = mapped_column(
        String,
        nullable=True,
    )
    attributes: Mapped[dict] = mapped_column(
        JSONB,
        nullable=False,
        default=dict,
    )


class QuestionDB(Base):
    __tablename__ = "questions"

    id: Mapped[str] = mapped_column(
        String, primary_key=True,
        default=lambda: str(uuid.uuid4())
    )
    text: Mapped[str] = mapped_column(String(255), nullable=False)
    attribute_key: Mapped[str] = mapped_column(
        String(100), nullable=False
    )
    

class RoomDB(Base): 
    __tablename__ = "rooms" 
    room_id: Mapped[str] = mapped_column(
        String, primary_key=True, 
        default=lambda: str(uuid.uuid4())
    ) 
    room_code: Mapped[str] = mapped_column(
        String(10), 
        unique=True, 
        nullable=False
    )
    total_rounds: Mapped[int] = mapped_column(
        Integer, 
        nullable=False
    )
    room_privacy: Mapped[bool] = mapped_column(
        Boolean, 
        default=False, 
        nullable=False
    )
    room_members: Mapped[list] = mapped_column(
        JSONB, 
        default=list, 
        nullable=False
    )