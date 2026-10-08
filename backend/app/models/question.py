"""
Question model/schema.

Represents a yes/no question that players can ask during a duel.

Design notes:
- Questions are pre-defined and tied to a specific character attribute key.
  This allows the game engine to evaluate answers automatically against
  a character's attributes dict without custom logic per question.
- A question is a data record, not a game event. The game event (asking + answering)
  lives in the Response model.

TODO: Decide where the question dataset lives (DB table vs. static file).
TODO: Consider adding a category or tag field for grouping related questions later.
"""

from pydantic import BaseModel


class Question(BaseModel):
    """
    A pre-defined yes/no question about a character's attributes.

    Attributes:
        id:             Unique identifier for the question.
        text:           The question as shown to the player.
                        Example: "Does your character wear glasses?"
        attribute_key:  The key in Character.attributes this question evaluates.
                        Example: "has_glasses"
    """

    id: str
    text: str
    attribute_key: str  # Maps directly to a key in Character.attributes
