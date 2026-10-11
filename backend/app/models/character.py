"""
Character model/schema.

Represents a selectable character in the game.

Traits mirror those produced by the character generator (generate-characters.js)
and stored in characters/data/characters.json:
  - gender:      "male" | "female"
  - has_glasses: bool
  - has_beard:   bool
  - hair_color:  "black" | "brown" | "blonde" | "grey" | "red"
  - skin_color:  "light" | "dark"
"""

from pydantic import BaseModel
from typing import Literal


class Character(BaseModel):
    """
    A selectable character that players guess against.

    Attributes:
        id:          Unique identifier (e.g., "char-1").
        name:        Display name (e.g., "Felix").
        image_url:   Path to the character SVG served by the frontend (e.g., "/characters/char-1.svg").
        gender:      "male" or "female" — determines hairstyle group used in avatar generation.
        has_glasses: Whether the character wears glasses.
        has_beard:   Whether the character has a beard.
        hair_color:  One of: black, brown, blonde, grey, red.
        skin_color:  One of: light, dark.
    """

    id: str
    name: str
    image_url: str
    gender: Literal["male", "female"]
    has_glasses: bool
    has_beard: bool
    hair_color: Literal["black", "brown", "blonde", "grey", "red"]
    skin_color: Literal["light", "dark"]
