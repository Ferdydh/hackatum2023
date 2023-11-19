import json
import asyncio
from fastapi import APIRouter, WebSocket

router = APIRouter()

@router.websocket("/ws/prompt")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    user_message = await websocket.receive_text()
    messages = [
        {"role": "user", "message": user_message},
        {"role": "bot", "message": ""}
    ]
    response = "ducks give no fucks " * 10
    for i in range(len(response)):
        messages[1]['message'] = response[:i+1]
        await websocket.send_text(json.dumps(messages))
        await asyncio.sleep(0.01)

    await websocket.close()