"""
seed_characters.py

One-shot script that reads characters/data/characters.json and upserts all
characters into the PostgreSQL `characters` table.

Usage (from the repo root):
    python -m backend.scripts.seed_characters

Or from the backend/ directory:
    python -m scripts.seed_characters

The script is idempotent: it uses INSERT ... ON CONFLICT (id) DO UPDATE so it
is safe to run multiple times. Re-running after regenerating characters will
update existing rows and add any new ones.
"""

import json
import os
import sys
from pathlib import Path

# Allow running from any working directory by resolving paths relative to this file.
REPO_ROOT = Path(__file__).resolve().parents[2]
CHARACTERS_JSON = REPO_ROOT / "characters" / "data" / "characters.json"

# Add repo root to sys.path so `app` package is importable.
sys.path.insert(0, str(REPO_ROOT / "backend"))

from sqlalchemy import text
from app.database.db import engine, SessionLocal
from app.database.base import Base
from app.models.db_models import CharacterDB


def load_characters() -> list[dict]:
    """Load and validate characters from the JSON source file."""
    if not CHARACTERS_JSON.exists():
        raise FileNotFoundError(
            f"characters.json not found at {CHARACTERS_JSON}.\n"
            "Run 'node characters/scripts/generate-characters.js' first."
        )
    with open(CHARACTERS_JSON, encoding="utf-8") as f:
        return json.load(f)


def upsert_characters(characters: list[dict]) -> None:
    """
    Upsert all characters into the DB.
    Uses raw SQL for ON CONFLICT DO UPDATE which is cleaner than merge().
    """
    upsert_sql = text("""
        INSERT INTO characters (id, name, image_url, gender, has_glasses, has_beard, hair_color, skin_color)
        VALUES (:id, :name, :image_url, :gender, :has_glasses, :has_beard, :hair_color, :skin_color)
        ON CONFLICT (id) DO UPDATE SET
            name        = EXCLUDED.name,
            image_url   = EXCLUDED.image_url,
            gender      = EXCLUDED.gender,
            has_glasses = EXCLUDED.has_glasses,
            has_beard   = EXCLUDED.has_beard,
            hair_color  = EXCLUDED.hair_color,
            skin_color  = EXCLUDED.skin_color
    """)

    with SessionLocal() as session:
        for char in characters:
            traits = char["traits"]
            session.execute(upsert_sql, {
                "id":          char["id"],
                "name":        char["name"],
                "image_url":   char["imageUrl"],
                "gender":      traits["gender"],
                "has_glasses": traits["hasGlasses"],
                "has_beard":   traits["hasBeard"],
                "hair_color":  traits["hairColor"],
                "skin_color":  traits["skinColor"],
            })
        session.commit()


def migrate_table() -> None:
    """
    Migrate the characters table from the old schema (attributes JSONB) to the
    new schema with explicit columns. Safe to run even if already migrated.
    """
    migrate_sql = text("""
        DO $$
        BEGIN
            -- Drop old generic attributes column if it exists
            IF EXISTS (
                SELECT 1 FROM information_schema.columns
                WHERE table_name='characters' AND column_name='attributes'
            ) THEN
                ALTER TABLE characters DROP COLUMN attributes;
            END IF;

            -- Add new columns if they don't already exist
            IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns
                WHERE table_name='characters' AND column_name='gender'
            ) THEN
                ALTER TABLE characters
                    ADD COLUMN gender      VARCHAR(10)  NOT NULL DEFAULT 'male',
                    ADD COLUMN has_glasses BOOLEAN      NOT NULL DEFAULT false,
                    ADD COLUMN has_beard   BOOLEAN      NOT NULL DEFAULT false,
                    ADD COLUMN hair_color  VARCHAR(20)  NOT NULL DEFAULT 'black',
                    ADD COLUMN skin_color  VARCHAR(10)  NOT NULL DEFAULT 'light';
            END IF;

            -- Ensure image_url is NOT NULL (old schema allowed NULL)
            ALTER TABLE characters ALTER COLUMN image_url SET NOT NULL;
        END $$;
    """)
    with engine.connect() as conn:
        conn.execute(migrate_sql)
        conn.commit()
    print("[OK] Table migration complete.")


def main() -> None:
    print(f"Reading characters from: {CHARACTERS_JSON}")
    characters = load_characters()
    print(f"Loaded {len(characters)} characters.")

    print("Ensuring 'characters' table exists...")
    Base.metadata.create_all(bind=engine, tables=[CharacterDB.__table__])

    print("Migrating table schema if needed...")
    migrate_table()

    print("Upserting characters into database...")
    upsert_characters(characters)

    print(f"[OK] Successfully seeded {len(characters)} characters into the database.")


if __name__ == "__main__":
    main()
