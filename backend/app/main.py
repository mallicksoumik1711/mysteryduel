"""
MysteryDuel - FastAPI Application Entry Point
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from sqlalchemy import text

from app.database.db import engine
from app.database.base import Base
from app.models.db_models import CharacterDB, QuestionDB


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create database tables if they do not exist.
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="MysteryDuel API",
    description="Backend for the 2-player character guessing game MysteryDuel.",
    version="0.1.0",
    lifespan=lifespan,
)


@app.get("/")
def main():
    return {"message": "Welcome to MysteryDuel API!"}


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/test-db")
def test_db():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))

    return {"database": result.scalar()}