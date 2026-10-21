# """
# WebSocket Connection & Game State Manager
# =========================================
# Manages all active WebSocket connections and per-room game state.

# Game state stored here is ephemeral (in-memory). It is scoped to a room
# and reset when the room empties. For persistence across server restarts,
# replace the dict with a Redis-backed store later.

# Turn model
# ----------
# - Two players connect to the same room_code.
# - The FIRST to connect is player1 (asks first).
# - Turns alternate: player1 asks → player2 answers → player2 asks → player1 answers → …
# - When it's your turn you SELECT a question and SUBMIT it → opponent sees it and
#   responds Yes / No → turn switches to the opponent.
# """

# from backend.app.models import room
# from __future__ import annotations

# import json
# from typing import Optional
# from fastapi import WebSocket


# # ---------------------------------------------------------------------------
# # Per-room game state
# # ---------------------------------------------------------------------------

# class RoomState:
#     """Holds the live state for a single game room."""

#     def __init__(self) -> None:
#         # player_id → WebSocket
#         self.connections: dict[str, WebSocket] = {}
#         # player_id → character_id (set when player picks their character)
#         self.characters: dict[str, str] = {}
#         # whose turn it is to ASK a question (player_id or None until 2 players joined)
#         self.current_turn: Optional[str] = None
#         # pending question waiting for an answer: {"question_id", "question_text", "asker_id"}
#         self.pending_question: Optional[dict] = None
#         # ordered log of resolved exchanges [{asker, text, answer, timestamp}]
#         self.history: list[dict] = []
#         # player_id -> {character_id: available | selected | eliminated}
#         self.boards: dict[str, dict[str, str]] = {}

#     @property
#     def player_ids(self) -> list[str]:
#         return list(self.connections.keys())

#     def other_player(self, player_id: str) -> Optional[str]:
#         for pid in self.connections:
#             if pid != player_id:
#                 return pid
#         return None

#     def is_full(self) -> bool:
#         return len(self.connections) >= 2


# # ---------------------------------------------------------------------------
# # Global manager
# # ---------------------------------------------------------------------------

# class ConnectionManager:
#     """Singleton that owns all room states and handles fan-out messaging."""

#     def __init__(self) -> None:
#         # room_code → RoomState
#         self._rooms: dict[str, RoomState] = {}

#     # ------------------------------------------------------------------
#     # Lifecycle helpers
#     # ------------------------------------------------------------------

#     def _get_or_create_room(self, room_code: str) -> RoomState:
#         if room_code not in self._rooms:
#             self._rooms[room_code] = RoomState()
#         return self._rooms[room_code]

#     async def connect(
#         self,
#         websocket: WebSocket,
#         room_code: str,
#         player_id: str,
#     ) -> tuple[bool, str]:
#         """
#         Accept the connection and register the player.

#         Returns (success, message).
#         Rejects if the room is already full with *different* players.
#         """
#         await websocket.accept()
#         room = self._get_or_create_room(room_code)

#         if player_id in room.connections:
#             # Reconnect: replace old socket
#             room.connections[player_id] = websocket
#             return True, "reconnected"

#         if room.is_full():
#             await websocket.send_text(
#                 json.dumps({"type": "error", "message": "Room is full"})
#             )
#             await websocket.close()
#             return False, "room_full"

#         room.connections[player_id] = websocket

#         # First player to join becomes turn-holder
#         if len(room.connections) == 1:
#             room.current_turn = player_id

#         return True, "connected"

#         room.boards.setdefault(player_id, {})

#     def disconnect(self, room_code: str, player_id: str) -> None:
#         room = self._rooms.get(room_code)
#         if not room:
#             return
#         room.connections.pop(player_id, None)
#         # Clean up empty rooms
#         if not room.connections:
#             self._rooms.pop(room_code, None)

    
#     async def handle_board_update(
#         self,
#         room_code: str,
#         player_id: str,
#         board_state: dict[str, str],
#     ):
#         room = self.rooms.get(room_code)
#         if room is None:
#             return

#         valid_states = {"available", "selected", "eliminated"}

#         if not all(state in valid_states for state in board_state.values()):
#             return

#         # Save the board belonging to this player.
#         room.boards[player_id] = board_state

#         # Send the update only to the other player.
#         for opponent_id, websocket in room.connections.items():
#             if opponent_id != player_id:
#                 await websocket.send_json({
#                     "type": "opponent_board_updated",
#                     "player_id": player_id,
#                     "board_state": board_state,
#                 })

#     # ------------------------------------------------------------------
#     # Send helpers
#     # ------------------------------------------------------------------

#     async def send_to(
#         self,
#         room_code: str,
#         player_id: str,
#         payload: dict,
#     ) -> None:
#         room = self._rooms.get(room_code)
#         if not room:
#             return
#         ws = room.connections.get(player_id)
#         if ws:
#             await ws.send_text(json.dumps(payload))

#     async def broadcast(self, room_code: str, payload: dict) -> None:
#         room = self._rooms.get(room_code)
#         if not room:
#             return
#         text = json.dumps(payload)
#         for ws in room.connections.values():
#             await ws.send_text(text)

#     # ------------------------------------------------------------------
#     # Game events
#     # ------------------------------------------------------------------

#     async def handle_player_joined(
#         self, room_code: str, player_id: str
#     ) -> None:
#         """Notify everyone in the room that a player joined."""
#         room = self._rooms[room_code]
#         player_count = len(room.connections)

#         # Tell the joining player their role
#         await self.send_to(
#             room_code,
#             player_id,
#             {
#                 "type": "joined",
#                 "player_id": player_id,
#                 "is_your_turn": room.current_turn == player_id,
#                 "player_count": player_count,
#             },
#         )

#         # Notify others that someone joined
#         other = room.other_player(player_id)
#         if other:
#             await self.send_to(
#                 room_code,
#                 other,
#                 {
#                     "type": "opponent_joined",
#                     "opponent_id": player_id,
#                     "player_count": player_count,
#                 },
#             )

#         # Both players present → game can start
#         if player_count == 2:
#             await self.broadcast(
#                 room_code,
#                 {
#                     "type": "game_start",
#                     "current_turn": room.current_turn,
#                 },
#             )

#     async def handle_ask_question(
#         self,
#         room_code: str,
#         player_id: str,
#         question_id: str,
#         question_text: str,
#     ) -> None:
#         """
#         The active player submits a question.
#         Store as pending and notify the opponent (who must answer Yes/No).
#         """
#         room = self._rooms.get(room_code)
#         if not room:
#             return

#         if room.current_turn != player_id:
#             await self.send_to(
#                 room_code,
#                 player_id,
#                 {"type": "error", "message": "Not your turn"},
#             )
#             return

#         room.pending_question = {
#             "question_id": question_id,
#             "question_text": question_text,
#             "asker_id": player_id,
#         }

#         opponent = room.other_player(player_id)

#         # Tell asker their question was sent
#         await self.send_to(
#             room_code,
#             player_id,
#             {
#                 "type": "question_sent",
#                 "question_id": question_id,
#                 "question_text": question_text,
#             },
#         )

#         # Tell opponent they need to answer
#         if opponent:
#             await self.send_to(
#                 room_code,
#                 opponent,
#                 {
#                     "type": "question_received",
#                     "question_id": question_id,
#                     "question_text": question_text,
#                     "asker_id": player_id,
#                 },
#             )

#     async def handle_answer(
#         self,
#         room_code: str,
#         player_id: str,
#         answer: bool,
#     ) -> None:
#         """
#         The non-active player answers Yes / No.
#         Broadcast the resolved exchange, switch turns.
#         """
#         room = self._rooms.get(room_code)
#         if not room:
#             return

#         if not room.pending_question:
#             await self.send_to(
#                 room_code,
#                 player_id,
#                 {"type": "error", "message": "No pending question to answer"},
#             )
#             return

#         pq = room.pending_question
#         if pq["asker_id"] == player_id:
#             await self.send_to(
#                 room_code,
#                 player_id,
#                 {"type": "error", "message": "You cannot answer your own question"},
#             )
#             return

#         import datetime
#         timestamp = datetime.datetime.utcnow().strftime("%H:%M")

#         entry = {
#             "question_id": pq["question_id"],
#             "question_text": pq["question_text"],
#             "asker_id": pq["asker_id"],
#             "answer": answer,
#             "timestamp": timestamp,
#         }
#         room.history.append(entry)
#         room.pending_question = None

#         # Switch turns
#         room.current_turn = pq["asker_id"]  # The asker already used their turn; now it's the OTHER player
#         room.current_turn = room.other_player(pq["asker_id"])

#         await self.broadcast(
#             room_code,
#             {
#                 "type": "answer_received",
#                 "question_id": entry["question_id"],
#                 "question_text": entry["question_text"],
#                 "asker_id": entry["asker_id"],
#                 "answer": answer,
#                 "next_turn": room.current_turn,
#                 "timestamp": timestamp,
#             },
#         )

#     async def handle_opponent_disconnected(
#         self, room_code: str, disconnected_id: str
#     ) -> None:
#         """Notify remaining player that opponent left."""
#         room = self._rooms.get(room_code)
#         if not room:
#             return
#         other = room.other_player(disconnected_id)
#         if other:
#             await self.send_to(
#                 room_code,
#                 other,
#                 {
#                     "type": "opponent_disconnected",
#                     "player_id": disconnected_id,
#                 },
#             )


# # Singleton instance
# manager = ConnectionManager()





































"""
WebSocket Connection & Game State Manager
=========================================
Manages all active WebSocket connections and per-room game state.

Game state stored here is ephemeral (in-memory). It is scoped to a room
and reset when the room empties. For persistence across server restarts,
replace the dict with a Redis-backed store later.

Turn model
----------
- Two players connect to the same room_code.
- The FIRST to connect is player1 (asks first).
- Turns alternate: player1 asks → player2 answers → player2 asks → player1 answers → …
- When it's your turn you SELECT a question and SUBMIT it → opponent sees it and
  responds Yes / No → turn switches to the opponent.
"""

from __future__ import annotations

import json
from typing import Optional

from fastapi import WebSocket


# ---------------------------------------------------------------------------
# Per-room game state
# ---------------------------------------------------------------------------

class RoomState:
    """Holds the live state for a single game room."""

    def __init__(self) -> None:
        # player_id → WebSocket
        self.connections: dict[str, WebSocket] = {}
        # player_id → character_id (set when player picks their character)
        self.characters: dict[str, str] = {}
        # whose turn it is to ASK a question (player_id or None until 2 players joined)
        self.current_turn: Optional[str] = None
        # player currently eliminating characters after receiving an answer
        self.eliminating_player: Optional[str] = None
        # pending question waiting for an answer: {"question_id", "question_text", "asker_id"}
        self.pending_question: Optional[dict] = None
        # ordered log of resolved exchanges [{asker, text, answer, timestamp}]
        self.history: list[dict] = []
        # player_id -> {character_id: available | selected | eliminated}
        self.boards: dict[str, dict[str, str]] = {}

    @property
    def player_ids(self) -> list[str]:
        return list(self.connections.keys())

    def other_player(self, player_id: str) -> Optional[str]:
        for pid in self.connections:
            if pid != player_id:
                return pid
        return None

    def is_full(self) -> bool:
        return len(self.connections) >= 2


# ---------------------------------------------------------------------------
# Global manager
# ---------------------------------------------------------------------------

class ConnectionManager:
    """Singleton that owns all room states and handles fan-out messaging."""

    def __init__(self) -> None:
        # room_code → RoomState
        self._rooms: dict[str, RoomState] = {}

    # ------------------------------------------------------------------
    # Lifecycle helpers
    # ------------------------------------------------------------------

    def _get_or_create_room(self, room_code: str) -> RoomState:
        if room_code not in self._rooms:
            self._rooms[room_code] = RoomState()
        return self._rooms[room_code]

    async def connect(
        self,
        websocket: WebSocket,
        room_code: str,
        player_id: str,
    ) -> tuple[bool, str]:
        """
        Accept the connection and register the player.

        Returns (success, message).
        Rejects if the room is already full with *different* players.
        """
        await websocket.accept()
        room = self._get_or_create_room(room_code)

        if player_id in room.connections:
            # Reconnect: replace old socket
            room.connections[player_id] = websocket
            room.boards.setdefault(player_id, {})
            return True, "reconnected"

        if room.is_full():
            await websocket.send_text(
                json.dumps({"type": "error", "message": "Room is full"})
            )
            await websocket.close()
            return False, "room_full"

        room.connections[player_id] = websocket
        room.boards.setdefault(player_id, {})

        # First player to join becomes turn-holder
        if len(room.connections) == 1:
            room.current_turn = player_id

        return True, "connected"

    def disconnect(self, room_code: str, player_id: str) -> None:
        room = self._rooms.get(room_code)
        if not room:
            return

        room.connections.pop(player_id, None)

        # Clean up empty rooms
        if not room.connections:
            self._rooms.pop(room_code, None)

    async def handle_board_update(
        self,
        room_code: str,
        player_id: str,
        board_state: dict[str, str],
    ) -> None:
        """Save a player's board and send the update to their opponent."""
        room = self._rooms.get(room_code)

        if room is None or player_id not in room.connections:
            return

        valid_states = {"available", "selected", "eliminated"}

        if not all(
            isinstance(character_id, str)
            and isinstance(state, str)
            and state in valid_states
            for character_id, state in board_state.items()
        ):
            return

        # Save the board belonging to this player.
        room.boards[player_id] = board_state.copy()

        # Send the update only to the opponent.
        for opponent_id, websocket in room.connections.items():
            if opponent_id != player_id:
                await websocket.send_json({
                    "type": "opponent_board_updated",
                    "player_id": player_id,
                    "board_state": room.boards[player_id],
                })

    # ------------------------------------------------------------------
    # Send helpers
    # ------------------------------------------------------------------

    async def send_to(
        self,
        room_code: str,
        player_id: str,
        payload: dict,
    ) -> None:
        room = self._rooms.get(room_code)
        if not room:
            return

        ws = room.connections.get(player_id)
        if ws:
            await ws.send_text(json.dumps(payload))

    async def broadcast(self, room_code: str, payload: dict) -> None:
        room = self._rooms.get(room_code)
        if not room:
            return

        text = json.dumps(payload)
        for ws in room.connections.values():
            await ws.send_text(text)

    # ------------------------------------------------------------------
    # Game events
    # ------------------------------------------------------------------

    async def handle_player_joined(
        self, room_code: str, player_id: str
    ) -> None:
        """Notify everyone in the room that a player joined."""
        room = self._rooms[room_code]
        player_count = len(room.connections)

        # Tell the joining player their role
        await self.send_to(
            room_code,
            player_id,
            {
                "type": "joined",
                "player_id": player_id,
                "is_your_turn": room.current_turn == player_id,
                "player_count": player_count,
            },
        )

        # Restore the joining player's own board.
        await self.send_to(
            room_code,
            player_id,
            {
                "type": "my_board_restored",
                "board_state": room.boards.get(player_id, {}),
            },
        )

        # Notify others that someone joined
        other = room.other_player(player_id)
        if other:
            await self.send_to(
                room_code,
                other,
                {
                    "type": "opponent_joined",
                    "opponent_id": player_id,
                    "player_count": player_count,
                },
            )

            # Send the opponent's current board to the joining player.
            await self.send_to(
                room_code,
                player_id,
                {
                    "type": "opponent_board_updated",
                    "player_id": other,
                    "board_state": room.boards.get(other, {}),
                },
            )

        # Both players present → game can start
        if player_count == 2:
            await self.broadcast(
                room_code,
                {
                    "type": "game_start",
                    "current_turn": room.current_turn,
                },
            )

    async def handle_ask_question(
        self,
        room_code: str,
        player_id: str,
        question_id: str,
        question_text: str,
    ) -> None:
        """
        The active player submits a question.
        Store as pending and notify the opponent (who must answer Yes/No).
        """
        room = self._rooms.get(room_code)
        if not room:
            return

        if room.eliminating_player:
            await self.send_to(
                room_code,
                player_id,
                {"type": "error", "message": "Opponent is currently eliminating characters"},
            )
            return

        if room.current_turn != player_id:
            await self.send_to(
                room_code,
                player_id,
                {"type": "error", "message": "Not your turn"},
            )
            return

        room.pending_question = {
            "question_id": question_id,
            "question_text": question_text,
            "asker_id": player_id,
        }

        opponent = room.other_player(player_id)

        # Tell asker their question was sent
        await self.send_to(
            room_code,
            player_id,
            {
                "type": "question_sent",
                "question_id": question_id,
                "question_text": question_text,
            },
        )

        # Tell opponent they need to answer
        if opponent:
            await self.send_to(
                room_code,
                opponent,
                {
                    "type": "question_received",
                    "question_id": question_id,
                    "question_text": question_text,
                    "asker_id": player_id,
                },
            )

    async def handle_answer(
        self,
        room_code: str,
        player_id: str,
        answer: bool,
    ) -> None:
        """
        The non-active player answers Yes / No.
        Broadcast the resolved exchange and enter elimination phase for the asker.
        """
        room = self._rooms.get(room_code)
        if not room:
            return

        if not room.pending_question:
            await self.send_to(
                room_code,
                player_id,
                {"type": "error", "message": "No pending question to answer"},
            )
            return

        pq = room.pending_question
        if pq["asker_id"] == player_id:
            await self.send_to(
                room_code,
                player_id,
                {"type": "error", "message": "You cannot answer your own question"},
            )
            return

        import datetime
        timestamp = datetime.datetime.utcnow().strftime("%H:%M")

        asker_id = pq["asker_id"]
        entry = {
            "question_id": pq["question_id"],
            "question_text": pq["question_text"],
            "asker_id": asker_id,
            "answer": answer,
            "timestamp": timestamp,
        }
        room.history.append(entry)
        room.pending_question = None

        # Asker enters the elimination phase
        room.eliminating_player = asker_id
        # While elimination is happening, no player can ask questions yet
        room.current_turn = None

        await self.broadcast(
            room_code,
            {
                "type": "answer_received",
                "question_id": entry["question_id"],
                "question_text": entry["question_text"],
                "asker_id": asker_id,
                "answer": answer,
                "eliminating_player": asker_id,
                "next_turn": room.other_player(asker_id),
                "timestamp": timestamp,
            },
        )

    async def handle_elimination_done(
        self,
        room_code: str,
        player_id: str,
    ) -> None:
        """
        The eliminating player notifies that they finished eliminating characters.
        The turn now officially shifts to the opponent to ask their question.
        """
        room = self._rooms.get(room_code)
        if not room:
            return

        if room.eliminating_player and room.eliminating_player != player_id:
            await self.send_to(
                room_code,
                player_id,
                {"type": "error", "message": "You are not the eliminating player"},
            )
            return

        room.eliminating_player = None
        next_turn = room.other_player(player_id)
        room.current_turn = next_turn

        await self.broadcast(
            room_code,
            {
                "type": "elimination_done",
                "player_id": player_id,
                "next_turn": next_turn,
            },
        )

    async def handle_opponent_disconnected(
        self, room_code: str, disconnected_id: str
    ) -> None:
        """Notify remaining player that opponent left."""
        room = self._rooms.get(room_code)
        if not room:
            return

        other = room.other_player(disconnected_id)
        if other:
            await self.send_to(
                room_code,
                other,
                {
                    "type": "opponent_disconnected",
                    "player_id": disconnected_id,
                },
            )


# Singleton instance
manager = ConnectionManager()