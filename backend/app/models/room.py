"""
Room model/schema.

Represents a game room where two players duel.

Design notes:
- The Room is the primary container for all ephemeral game state:
  who joined, whose turn it is, what characters were picked, question history, etc.
- User model does NOT hold any of this state to keep concerns separated and
  avoid duplication.
- GameState is a nested model within Room so it stays co-located with the
  room it belongs to. If game sessions grow more complex, it can be extracted
  into its own model later.

TODO: Decide on room lifecycle management (TTL, cleanup on disconnect, etc.).
TODO: Add spectator support if needed in a future version.
TODO: When a database is chosen, consider whether Room is stored fully in-memory
      (e.g., Redis) or persisted to a relational DB. The schema is designed to
      support both approaches without changes.
"""

from enum import Enum
from typing import Optional

from pydantic import BaseModel


class RoomPrivacy(str, Enum):
    """Whether a room is open to anyone or requires an invite code."""

    PUBLIC = "public"
    PRIVATE = "private"


class RoomStatus(str, Enum):
    """Lifecycle phase of the room."""

    WAITING = "waiting"       # Waiting for the second player to join
    CHARACTER_SELECT = "character_select"  # Both players choosing characters
    IN_PROGRESS = "in_progress"  # Game is underway
    FINISHED = "finished"     # Game has ended


class GameState(BaseModel):
    """
    Ephemeral game state that lives inside a Room.

    All fields are Optional because they are populated progressively
    as the game moves through its phases.

    Attributes:
        current_turn_user_id:  user_id of the player whose turn it is to ask.
        player1_character_id:  Character selected by player 1 (room_owner).
        player2_character_id:  Character selected by player 2 (the joiner).
        question_history:      Ordered list of Response IDs from this game session.
        winner_user_id:        user_id of the winning player once the game ends.
    """

    current_turn_user_id: Optional[str] = None
    player1_character_id: Optional[str] = None  # character_id, not the full object
    player2_character_id: Optional[str] = None  # character_id, not the full object
    question_history: list[str] = []             # ordered list of response IDs
    winner_user_id: Optional[str] = None

    # TODO: Add a guess_history list if tracking failed guess attempts is required.


class Room(BaseModel):
    """
    A game room hosting a 2-player MysteryDuel session.

    Attributes:
        room_id:      Unique identifier for the room.
        total_rounds: Number of rounds agreed upon (reserved for future multi-round mode).
        room_privacy: PUBLIC or PRIVATE.
        room_owner:   user_id of the player who created the room (Player 1).
        room_members: List of user_ids currently in the room (max 2 for MVP).
        status:       Current lifecycle phase of the room.
        game_state:   All in-progress game data (turns, characters, history).
    """

    room_id: str
    total_rounds: int = 1  # MVP: single-round game; extendable later
    room_privacy: RoomPrivacy = RoomPrivacy.PUBLIC
    room_owner: str          # user_id
    room_members: list[str] = []  # list of user_ids; max length 2 for MVP
    status: RoomStatus = RoomStatus.WAITING
    game_state: GameState = GameState()

    # TODO: Add an invite_code field for PRIVATE rooms.
    # TODO: Add a deck_id or character_set_id if multiple character decks are supported.
