import os
import json
import asyncio
from fastapi import Request
from fastapi.responses import StreamingResponse
from app.llm.gpt import prompt_stream_chunk
from app.llm.userproject import global_messages, global_state
from app.models import command_to_json



async def prompt_generator(user_message: str, request: Request):
    response = prompt_stream_chunk(global_messages, user_message, global_state)
    async for c in response:
        if await request.is_disconnected():
            # client closes connection
            break
        
        print(f"EMITTED COMMAND: {c}")
        yield f'data: {json.dumps(command_to_json(c))}\n\n'
    # response.close()