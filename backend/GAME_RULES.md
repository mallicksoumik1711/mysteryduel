# MysteryDuel — Game Rules & Mental Model

## 1. Project Purpose

MysteryDuel is a real-time, 2-player web game inspired by *Guess Who?*. Each player secretly selects a character; the goal is to deduce the opponent's character before they deduce yours by asking strategic yes/no questions about character attributes.

---

## 2. Core Entities

| Entity | Purpose |
|---|---|
| **User** | Player identity (who is playing). |
| **Room** | The game session container (where the duel happens). |
| **GameState** | Ephemeral in-game data nested inside Room (turn, characters, history). |
| **Character** | A selectable character with a fixed set of boolean attributes. |
| **Question** | A pre-defined yes/no question tied to one character attribute. |
| **Response** | A recorded question-and-answer exchange (one turn's ask+answer pair). |

---

## 3. Entity Relationships

```
User ──────────────────────────────────────────────────────────┐
  │ (room_owner)                                                │ (room_members)
  ▼                                                             ▼
Room ──────────── contains ──────────── GameState
  │                                          │
  │                              ┌───────────┼───────────────┐
  │                              │           │               │
  │                     player1_character  player2_character  question_history[]
  │                              │                               │
  ▼                              ▼                               ▼
Character                   Character                        Response[]
  │                                                              │
  │ (attributes dict)                                            │
  ▼                                                              ▼
{ "has_glasses": true, ... }                               Question (by id)
```

**Key design rule:** `User` holds only identity. All game state (character selection, turn order, question history, winner) lives inside `Room.game_state`. This prevents stale state if a user joins multiple games over time.

---

## 4. Game State

A room progresses through four phases:

| Phase | `Room.status` | Description |
|---|---|---|
| **Waiting** | `waiting` | Room created; waiting for the second player to join. |
| **Character Select** | `character_select` | Both players are secretly choosing their characters. |
| **In Progress** | `in_progress` | Players are taking turns asking questions. |
| **Finished** | `finished` | A player guessed correctly; the game is over. |

---

## 5. Turn Flow

```
Room enters IN_PROGRESS
        │
        ▼
 Player 1 (room_owner) asks a Question
        │
        ▼
 Player 2 answers Yes / No  ──► Response recorded in question_history
        │
        ▼
 Player 2 may attempt a Guess
   ├── Correct ──► Player 2 wins; Room → FINISHED
   └── Incorrect ──► Turn continues
        │
        ▼
 Player 2 asks a Question
        │
        ▼
 Player 1 answers Yes / No  ──► Response recorded in question_history
        │
        ▼
 Player 1 may attempt a Guess
   ├── Correct ──► Player 1 wins; Room → FINISHED
   └── Incorrect ──► Return to top
```

**Turn ownership** is tracked by `GameState.current_turn_user_id`. The game alternates between Player 1 and Player 2 each round.

---

## 6. Character Selection Rules

- Each player selects exactly **one character** from the available character set/deck.
- Character selection is **secret** — neither player can see the other's choice.
- A player **cannot select the same character** as their opponent.
  > **Note:** Enforcement of uniqueness is a business rule for the service layer.
- Once both players have selected a character, the room moves to `in_progress`.
- Characters cannot be changed after selection begins.

`GameState.player1_character_id` and `GameState.player2_character_id` store these references by ID only, never by full object, to avoid duplicating character data.

---

## 7. Question & Answer Rules

- Only **pre-defined Questions** can be asked (no free-text input for MVP).
- Each Question maps to exactly one `attribute_key` in `Character.attributes`.
- The answering player must respond truthfully (**Yes / No**) based on their secretly selected character's attributes.
  > **Note:** Truthfulness enforcement is not a technical concern for MVP; it is a game-design/social contract.
- The game engine can automatically **validate** answers by looking up the character's attribute for the given `question.attribute_key`.
- All responses are appended to `GameState.question_history` (ordered list of Response IDs) to support move replay and debugging later.

---

## 8. Guess / Win Condition

- On their turn, instead of asking a question, a player may **attempt to guess** the opponent's character.
- If the guess is **correct** → the guessing player wins.
  - `GameState.winner_user_id` is set to the winner's `user_id`.
  - `Room.status` transitions to `finished`.
- If the guess is **incorrect** → the player **loses their turn** (the guessing opportunity is forfeited).
  > The cost of an incorrect guess (lose turn vs. lose game) is a design decision to be finalised.
- Only one winner is possible per game.

---

## 9. Basic Room Rules

- A room supports **exactly 2 players** for MVP.
- The player who creates the room is the **room_owner** (Player 1) and asks first.
- The room_owner is always included in `room_members`.
- A room may be **PUBLIC** (anyone can join) or **PRIVATE** (join by invite/code).
- `total_rounds` defaults to `1` for MVP. Multi-round mode is reserved for future iterations.
- A player may not be in more than one active room at a time.
  > Enforcement is a business rule for the service layer, not the schema.

---

## 10. Future Considerations

| Area | Notes |
|---|---|
| **Authentication** | Add user accounts with hashed passwords / OAuth. The `User` model is ready to receive these fields. |
| **Database** | No DB chosen yet. The schema uses plain Pydantic models. A repository layer can be added later with PostgreSQL (SQLAlchemy/asyncpg) or an in-memory store (Redis) without changing core models. |
| **WebSockets** | Real-time turn-taking and room events will require WebSocket support in FastAPI. |
| **Multi-round mode** | `Room.total_rounds` is already present. Extend `GameState` with a `current_round` counter when implementing. |
| **Character Decks** | Characters may be grouped into themed decks. Add a `deck_id` to `Room` and a loader/repository layer for `Character`. |
| **Private rooms** | Add an `invite_code` field to `Room` and a generation/validation utility. |
| **Guess history** | Track failed guesses in `GameState` for scoring or penalties. |
| **Spectators** | `room_members` currently holds active players only. A separate `spectators` list can be added to `Room`. |
| **Leaderboard / Stats** | `GameState.winner_user_id` provides the hook. A stats service can aggregate results from finished rooms. |
| **AI opponent** | The alternating-turn model supports replacing one player with an AI agent in a later version. |
