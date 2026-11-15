# MysteryDuel

MysteryDuel is a real-time 2-player character guessing game.

Each player secretly picks a character from a shared roster. Players take turns asking Yes/No questions about their opponent's character, eliminating candidates from their board based on the answers.

The first player to correctly guess the opponent's secret character wins.

---

## Project Structure

```
mysteryduel/
├── backend/          # FastAPI backend (Python)
├── frontend/         # React + TypeScript frontend (Vite)
└── characters/       # Character generation scripts (Node.js / DiceBear)
```

---

## Tech Stack

### Frontend
- **React 19** + **TypeScript**
- **Vite** (dev server & build)
- **Tailwind CSS v4**
- **React Router v7**
- **Native WebSocket API** (via `useGameSocket` hook)
- **Lucide React** (icons)

### Backend
- **FastAPI** + **Uvicorn**
- **WebSockets** (native FastAPI support)
- **SQLAlchemy 2** + **PostgreSQL** (via `psycopg[binary]`)
- **Pydantic v2**
- **python-dotenv**

### Characters
- **DiceBear** (`@dicebear/core`, `@dicebear/styles`) — SVG avatar generation
- Node.js generation script (`characters/scripts/generate-characters.js`)

---

## Pages & Routes

| Route | Page | Description |
|---|---|---|
| `/` | `HomePage` | Landing page with game intro |
| `/create-room` | `CreateRoomPage` | Create a new game room |
| `/join-room` | `JoinRoomPage` | Join an existing room by code |
| `/pick-character` | `PickCharacterPage` | Pick a secret character before the game |
| `/game-room` | `GameRoomPage` | Main in-game screen |

---

## Implemented Features

- **Room creation & joining** via short room codes
- **Character selection** — each player picks a secret character from a shared set
- **Turn-based gameplay** — players alternate asking and answering
- **Predefined Yes/No questions** — served from the database
- **Character board** — players mark characters as available, selected, or eliminated
- **Board sync** — board state is synced to the opponent via WebSocket
- **Real-time game updates** — WebSocket connection managed by `useGameSocket`
- **Guess mechanic** — players can guess the opponent's character at any time
- **Win / lose detection** — game ends and result is broadcast when a correct guess is made
- **Opponent disconnect handling** — the remaining player is notified
- **Board restoration on reconnect** — a player's board is restored if they rejoin

---

## WebSocket Protocol

**Endpoint:** `WS /ws/{room_code}/{player_id}`

### Client → Server

| Type | Fields |
|---|---|
| `ask_question` | `question_id`, `question_text` |
| `answer` | `answer` (bool or `"Yes"` / `"No"`) |
| `board_update` | `board_state` (`{char-id: "available" \| "selected" \| "eliminated"}`) |
| `elimination_done` | — |
| `guess_character` | `character_id` |
| `set_character` | `character_id` |

### Server → Client

| Type | Key Fields |
|---|---|
| `joined` | `player_id`, `is_your_turn`, `player_count` |
| `opponent_joined` | `opponent_id`, `player_count` |
| `game_start` | `current_turn` |
| `question_sent` | `question_id`, `question_text` |
| `question_received` | `question_id`, `question_text`, `asker_id` |
| `answer_received` | `question_text`, `answer`, `eliminating_player`, `next_turn`, `timestamp` |
| `opponent_board_updated` | `player_id`, `board_state` |
| `my_board_restored` | `board_state` |
| `elimination_done` | `player_id`, `next_turn` |
| `guess_result` | `guesser_id`, `character_id`, `correct`, `timestamp` |
| `game_over` | `winner_id`, `timestamp` |
| `opponent_disconnected` | `player_id` |
| `error` | `message` |

---

## Database

PostgreSQL with three tables managed by SQLAlchemy:

- **`characters`** — id, name, image_url, gender, has_glasses, has_beard, hair_color, skin_color
- **`questions`** — id, text, attribute_key
- **`rooms`** — room_id, room_code, total_rounds, room_privacy, room_members (JSONB)

Room game state (turns, boards, pending questions, winner) is held **in-memory** in the WebSocket manager and is scoped to the active connection session.

---

## Getting Started

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate      # Windows
pip install -r requirements.txt
# create a .env file with your DATABASE_URL
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Character Generation

```bash
cd characters
npm install
npm run generate
```

---

## Status

🚧 In development
