"""
Response model/schema.

Represents a single question-and-answer exchange during a game round.

Design notes:
- A Response is an immutable game event: one player asked a question,
  the other answered. It belongs to a round/turn log, not to either player.
- responder_id identifies who answered (i.e., whose character is being described).
  This is useful for audit/history purposes and avoids ambiguity in multi-round games.
- The Response does NOT store the full Question or User objects to avoid
  state duplication; it references them by ID only.

TODO: Decide whether Responses are persisted per-round in a DB or kept in-memory
      for the duration of a game session.
TODO: Add a timestamp field if a move history/replay feature is desired later.
"""

from pydantic import BaseModel


class Response(BaseModel):
    """
    A recorded question-and-answer exchange within a game turn.

    Attributes:
        question_id:   ID of the Question that was asked.
        answer:        The responder's yes/no answer.
        responder_id:  user_id of the player who answered
                       (i.e., the player whose character is being guessed).
    """

    question_id: str
    answer: bool
    responder_id: str  # user_id of the player who answered
