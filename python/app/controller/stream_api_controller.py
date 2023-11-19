import json
import asyncio
from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse
from app.services import mocked_stream_service, stream_service
from app.models import BaseModel, NewFile, OpenFile, EditFile, TerminalExecute, File, Folder, Directory, TerminalResult

router = APIRouter()


# TEST
@router.get('/test_count')
async def message_stream(request: Request):
    async def event_generator():
        for t in range(10):
            # If client closes connection, stop sending events
            if await request.is_disconnected():
                break
            yield f'data: {json.dumps({"hello": "world", "t": t})}\n\n'
            await asyncio.sleep(0.1)

    return StreamingResponse(event_generator(), media_type='text/event-stream')


# Endpoints
# SERVICE = mocked_stream_service
SERVICE = stream_service

@router.post("/terminal_execute")
async def terminal_execute_controller(terminal_execute: TerminalExecute) -> TerminalResult:
    result = await SERVICE.terminal_execute(terminal_execute)
    return result


@router.get("/prompt")
async def prompt_controller(user_message: str, request: Request):
    return StreamingResponse(SERVICE.prompt_generator(user_message, request), media_type='text/event-stream')
