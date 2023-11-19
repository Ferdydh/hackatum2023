import json
import asyncio
from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse
from app.services import mocked_stream_service
from app.models import BaseModel, NewFile, RenameFile, DeleteFile, OpenFile, EditFile, TerminalExecute, File, Folder, Directory, TerminalResult
from sse_starlette.sse import EventSourceResponse

router = APIRouter()


# TEST
@router.get('/test_count')
async def message_stream(request: Request):
    async def event_generator():
        for t in range(10):
            # If client closes connection, stop sending events
            if await request.is_disconnected():
                break
            yield json.dumps({"hello": "world", "t": t})
            await asyncio.sleep(0.1)

    return StreamingResponse(event_generator(), media_type="application/json")


# Endpoints
SERVICE = mocked_stream_service
# SERVICE = api_service

@router.post("/terminal_execute")
async def terminal_execute_controller(terminal_execute: TerminalExecute) -> TerminalResult:
    result = await SERVICE.terminal_execute(terminal_execute)
    return result


@router.get("/prompt")
async def prompt_controller(user_message: str, request: Request):
    async def event_generator():
        new_message = {"role": "assistant", "message": ""}
        response = "ducks give no fucks " * 10
        for i in range(len(response)):
            # If client closes connection, stop sending events
            if await request.is_disconnected():
                break
            new_message['message'] = response[:i+1]
            yield f"data: {json.dumps(new_message)}\n\n"
            await asyncio.sleep(0.01)

    return StreamingResponse(event_generator(), media_type='text/event-stream')
