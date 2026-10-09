"""
MysteryDuel - FastAPI Application Entry Point

TODO: Add middleware (CORS, auth, rate limiting) when APIs are implemented.
TODO: Mount routers for each domain (rooms, characters, questions, etc.)
TODO: Add lifespan events for DB connection pooling when a database is chosen.
"""

from fastapi import FastAPI
from sqlalchemy import text

from app.database.db import engine

app = FastAPI(
    title="MysteryDuel API",
    description="Backend for the 2-player character guessing game MysteryDuel.",
    version="0.1.0",
)


@app.get("/")
def main():
    return {"message": "Welcome to MysteryDuel API!"}

@app.get("/health")
def health_check():
    """Basic health check endpoint."""
    return {"status": "ok"}

@app.get("/test-db")
def test_db():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))

    return {"database": result.scalar()}