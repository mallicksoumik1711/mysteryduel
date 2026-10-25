"""
WebSocket router for MysteryDuel game rooms.

Endpoint: WS /ws/{room_code}/{player_id}

Message protocol (JSON, client → server):
  { "type": "ask_question",     "question_id": "...", "question_text": "..." }
  { "type": "answer",           "answer": true | false }
  { "type": "board_update",     "board_state": { "char-1": "eliminated" } }
  { "type": "elimination_done" }
  { "type": "guess_character",  "character_id": "char-5" }

Message protocol (JSON, server → client):
  { "type": "joined",             "player_id": "...", "is_your_turn": bool, "player_count": int }
  { "type": "opponent_joined",    "opponent_id": "...", "player_count": int }
  { "type": "game_start",         "current_turn": "..." }
  { "type": "question_sent",      "question_id": "...", "question_text": "..." }
  { "type": "question_received",  "question_id": "...", "question_text": "...", "asker_id": "..." }
  { "type": "answer_received",    "question_id": "...", "question_text": "...",
                                   "asker_id": "...", "answer": bool,
                                   "eliminating_player": "...", "next_turn": "...", "timestamp": "..." }
  { "type": "opponent_board_updated", "player_id": "...", "board_state": {...} }
  { "type": "my_board_restored",      "board_state": {...} }
  { "type": "elimination_done",   "player_id": "...", "next_turn": "..." }
  { "type": "guess_result",       "guesser_id": "...", "character_id": "...",
                                   "correct": bool, "timestamp": "..." }
  { "type": "game_over",          "winner_id": "...", "timestamp": "..." }
  { "type": "opponent_disconnected", "player_id": "..." }
  { "type": "error",              "message": "..." }
"""

import json

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.websocket.manager import manager

router = APIRouter()


@router.websocket("/ws/{room_code}/{player_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    room_code: str,
    player_id: str,
) -> None:
    success, _ = await manager.connect(websocket, room_code, player_id)
    if not success:
        return

    await manager.handle_player_joined(room_code, player_id)

    try:
        while True:
            raw = await websocket.receive_text()

            try:
                data = json.loads(raw)
            except json.JSONDecodeError:
                await manager.send_to(
                    room_code,
                    player_id,
                    {"type": "error", "message": "Invalid JSON"},
                )
                continue

            # Reject JSON values that are not objects.
            if not isinstance(data, dict):
                await manager.send_to(
                    room_code,
                    player_id,
                    {"type": "error", "message": "Message must be a JSON object"},
                )
                continue

            msg_type = data.get("type")

            if msg_type == "ask_question":
                await manager.handle_ask_question(
                    room_code,
                    player_id,
                    question_id=data.get("question_id", ""),
                    question_text=data.get("question_text", ""),
                )

            elif msg_type == "answer":
                raw_answer = data.get("answer")

                # Accept both booleans and "Yes"/"No" strings.
                if isinstance(raw_answer, bool):
                    answer = raw_answer
                elif isinstance(raw_answer, str):
                    answer = raw_answer.lower() in ("yes", "true", "1")
                else:
                    answer = bool(raw_answer)

                await manager.handle_answer(room_code, player_id, answer)

            elif msg_type == "board_update":
                board_state = data.get("board_state")

                if (
                    isinstance(board_state, dict)
                    and all(
                        isinstance(character_id, str)
                        and isinstance(state, str)
                        for character_id, state in board_state.items()
                    )
                ):
                    await manager.handle_board_update(
                        room_code=room_code,
                        player_id=player_id,
                        board_state=board_state,
                    )
                else:
                    await manager.send_to(
                        room_code,
                        player_id,
                        {
                            "type": "error",
                            "message": "Invalid board_state",
                        },
                    )

            elif msg_type == "set_character":
                char_id = data.get("character_id")

                if isinstance(char_id, str) and char_id:
                    await manager.handle_set_character(
                        room_code=room_code,
                        player_id=player_id,
                        character_id=char_id,
                    )
                else:
                    await manager.send_to(
                        room_code,
                        player_id,
                        {
                            "type": "error",
                            "message": "set_character requires a non-empty 'character_id' string",
                        },
                    )

            elif msg_type == "elimination_done":
                await manager.handle_elimination_done(room_code, player_id)

            elif msg_type == "guess_character":
                character_id = data.get("character_id")

                if isinstance(character_id, str) and character_id:
                    await manager.handle_guess(
                        room_code=room_code,
                        player_id=player_id,
                        character_id=character_id,
                    )
                else:
                    await manager.send_to(
                        room_code,
                        player_id,
                        {
                            "type": "error",
                            "message": "guess_character requires a non-empty 'character_id' string",
                        },
                    )

            else:
                await manager.send_to(
                    room_code,
                    player_id,
                    {
                        "type": "error",
                        "message": f"Unknown message type: {msg_type}",
                    },
                )

    except WebSocketDisconnect:
        manager.disconnect(room_code, player_id)
        await manager.handle_opponent_disconnected(room_code, player_id)
