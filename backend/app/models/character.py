"""
Character model/schema.

Represents a selectable character in the game.

Design notes:
- Attributes are stored as a free-form dict so the character dataset can grow
  without requiring schema changes. Keys are attribute names (e.g., "has_glasses"),
  values are booleans.
- This makes it easy to add new characters and attributes without modifying this model.

TODO: Decide whether characters live in a DB table or are loaded from a static dataset
      (JSON / YAML file). A repository/loader layer will handle this later.
TODO: Add image_url or avatar_ref when the frontend character picker is built.
"""

from pydantic import BaseModel


class Character(BaseModel):
    """
    A selectable character that players guess against.

    Attributes:
        id:         Unique identifier for the character.
        name:       Display name (e.g., "Alice", "Baron von Gruff").
        attributes: Extensible dict of boolean traits.
                    Example: {"has_glasses": True, "has_beard": False, "is_male": True}
    """

    id: str
    name: str
    attributes: dict[str, bool]
