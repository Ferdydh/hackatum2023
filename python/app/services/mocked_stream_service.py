import os
import json
import asyncio
from fastapi import Request
from fastapi.responses import StreamingResponse
from app.models import NewFile, OpenFile, EditFile, File, Folder, Directory, TerminalExecute, TerminalResult





async def terminal_execute(terminal_execute: TerminalExecute) -> TerminalResult:
    return TerminalResult(
        output="hello, world",
        new_project_directory=[
            File(full_path="terminal_update.py", name="terminal_update.py"),
            Folder(full_path=terminal_execute.command, name=terminal_execute.command, sub_directories=[]),
        ]
    )


async def prompt_generator(user_message: str, request: Request):
    new_message = {"role": "assistant", "message": ""}
    response = "ducks give no fucks " * 10
    for i in range(len(response)):
        # If client closes connection, stop sending events
        if await request.is_disconnected():
            break
        new_message['message'] = response[:i+1]
        yield f"data: {json.dumps(new_message)}\n\n"
        await asyncio.sleep(0.01)
