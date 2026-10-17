"""
User model/schema.

Represents a player identity in MysteryDuel.

Design notes:
- Kept intentionally minimal for MVP. The user entity only holds identity info.
- Game-specific state (selected character, turn info, score) lives in Room/GameSession,
  not here, to avoid duplicating state across models.

TODO: Add authentication fields (hashed_password, email, etc.) when auth is introduced.
TODO: Add a persistent DB model (e.g., SQLAlchemy ORM class) when a database is chosen.
"""

from pydantic import BaseModel


class User(BaseModel):
    """
    A registered or guest player.

    Attributes:
        user_id: Unique identifier for the user.
        name:    Display name shown to other players.
    """

    user_id: str
    name: str
