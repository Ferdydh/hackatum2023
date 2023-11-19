import os
import asyncio
import aiofiles.os
import logging

from app.models import Directory, File, Folder
from app.llm.userproject import global_messages, global_state

logger = logging.getLogger(__name__)
logger.setLevel(logging.CRITICAL)

def hello(query_string: str) -> str:
    logger.info("called")
    return "hello" + query_string


async def get_directory(path: str = "/project") -> list[Directory]:
    async def crawl_directory(path: str) -> list[Directory]:
        contents = []
        for entry in await aiofiles.os.listdir(path):
            full_path = os.path.join(path, entry)
            if await aiofiles.os.path.isdir(full_path):
                sub_dirs = await crawl_directory(full_path)
                contents.append(Folder(full_path=full_path.removeprefix("/project/")+"/", name=entry, sub_directories=sub_dirs))
            else:
                contents.append(File(full_path=full_path.removeprefix("/project/"), name=entry))
        return contents

    d = await crawl_directory(path)
    print(d)
    return d

async def new_file(new_file: File) -> list[Directory]:
    '''
    create a new file, automatically creates parent directories if they don't exist
    '''
    full_path = '/project/' + new_file.full_path
    if await aiofiles.os.path.exists(full_path):
        raise Exception("file already exists")
    await aiofiles.os.makedirs(os.path.dirname(full_path), exist_ok=True)
    await aiofiles.os.open(full_path, 'w').close()
    return await get_directory()