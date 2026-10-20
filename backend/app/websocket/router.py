"""
WebSocket router for MysteryDuel game rooms.

Endpoint: WS /ws/{room_code}/{player_id}

Message protocol (JSON, client → server):
  { "type": "ask_question",   "question_id": "...", "question_text": "..." }
  { "type": "answer",         "answer": true | false }

Message protocol (JSON, server → client):
  { "type": "joined",             "player_id": "...", "is_your_turn": bool, "player_count": int }
  { "type": "opponent_joined",    "opponent_id": "...", "player_count": int }
  { "type": "game_start",         "current_turn": "..." }
  { "type": "question_sent",      "question_id": "...", "question_text": "..." }
  { "type": "question_received",  "question_id": "...", "question_text": "...", "asker_id": "..." }
  { "type": "answer_received",    "question_id": "...", "question_text": "...",
                                   "asker_id": "...", "answer": bool,
                                   "next_turn": "...", "timestamp": "..." }
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
                # Accept both booleans and "Yes"/"No" strings
                if isinstance(raw_answer, bool):
                    answer = raw_answer
                elif isinstance(raw_answer, str):
                    answer = raw_answer.lower() in ("yes", "true", "1")
                else:
                    answer = bool(raw_answer)

                await manager.handle_answer(room_code, player_id, answer)

            else:
                await manager.send_to(
                    room_code,
                    player_id,
                    {"type": "error", "message": f"Unknown message type: {msg_type}"},
                )

    except WebSocketDisconnect:
        manager.disconnect(room_code, player_id)
        await manager.handle_opponent_disconnected(room_code, player_id)
