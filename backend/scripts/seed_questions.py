"""
seed_questions.py

One-shot script to seed the 11 character-guessing questions
into the PostgreSQL questions table.

Run from the repository root:
    python -m backend.scripts.seed_questions

Or from the backend/ directory:
    python -m scripts.seed_questions

Idempotent: existing question IDs are updated instead of duplicated.
"""

import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]

# Make the backend app package importable.
sys.path.insert(0, str(REPO_ROOT / "backend"))

from sqlalchemy import text
from app.database.db import SessionLocal


QUESTIONS = [
    {
        "id": "q1",
        "text": "Is the character male?",
        "attribute_key": "gender:male",
    },
    {
        "id": "q2",
        "text": "Is the character female?",
        "attribute_key": "gender:female",
    },
    {
        "id": "q3",
        "text": "Does the character have black hair?",
        "attribute_key": "hair_color:black",
    },
    {
        "id": "q4",
        "text": "Does the character have brown hair?",
        "attribute_key": "hair_color:brown",
    },
    {
        "id": "q5",
        "text": "Does the character have blonde hair?",
        "attribute_key": "hair_color:blonde",
    },
    {
        "id": "q6",
        "text": "Does the character have grey hair?",
        "attribute_key": "hair_color:grey",
    },
    {
        "id": "q7",
        "text": "Does the character have red hair?",
        "attribute_key": "hair_color:red",
    },
    {
        "id": "q8",
        "text": "Is the character wearing glasses?",
        "attribute_key": "has_glasses:true",
    },
    {
        "id": "q9",
        "text": "Does the character have a beard?",
        "attribute_key": "has_beard:true",
    },
    {
        "id": "q10",
        "text": "Does the character have light skin?",
        "attribute_key": "skin_color:light",
    },
    {
        "id": "q11",
        "text": "Does the character have dark skin?",
        "attribute_key": "skin_color:dark",
    },
]


def seed_questions() -> None:
    upsert_sql = text("""
        INSERT INTO questions (id, text, attribute_key)
        VALUES (:id, :text, :attribute_key)
        ON CONFLICT (id) DO UPDATE SET
            text = EXCLUDED.text,
            attribute_key = EXCLUDED.attribute_key
    """)

    with SessionLocal() as session:
        for question in QUESTIONS:
            session.execute(upsert_sql, question)

        session.commit()

    print(
        f"[OK] Successfully seeded {len(QUESTIONS)} questions."
    )


if __name__ == "__main__":
    seed_questions()