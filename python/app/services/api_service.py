import os
import asyncio
import aiofiles.os
import logging

from app.models import Directory, File, Folder, NewFile, OpenFile, EditFile, TerminalResult, TerminalExecuteByHuman
from app.llm.userproject import global_messages, global_state

logger = logging.getLogger(__name__)
logger.setLevel(logging.CRITICAL)

def hello(query_string: str) -> str:
    logger.info("called")
    return "hello" + query_string


# convert to [{full_path: str, name: str} | {full_path: str, name: str, sub_directories: list[Directory]}]
def recursive_convert(d: dict) -> list[Directory]:
        contents = []
        for full_path, content in d.items():
            if os.path.isdir(full_path):
                sub_dirs = recursive_convert(content)
                contents.append(Folder(full_path=full_path.removeprefix("/project/")+"/", name=os.path.basename(full_path), sub_directories=sub_dirs))
            else:
                contents.append(File(full_path=full_path.removeprefix("/project/"), name=os.path.basename(full_path)))
        return contents

async def get_directory(path: str = "/project") -> list[Directory]:
    return recursive_convert(global_state.get_all_files())

    # actual disk
    # async def crawl_directory(path: str) -> list[Directory]:
    #     contents = []
    #     for entry in await aiofiles.os.listdir(path):
    #         full_path = os.path.join(path, entry)
    #         if await aiofiles.os.path.isdir(full_path):
    #             sub_dirs = await crawl_directory(full_path)
    #             contents.append(Folder(full_path=full_path.removeprefix("/project/")+"/", name=entry, sub_directories=sub_dirs))
    #         else:
    #             contents.append(File(full_path=full_path.removeprefix("/project/"), name=entry))
    #     return contents

    # d = await crawl_directory(path)
    # print(d)
    # return d

async def new_file(new_file: NewFile) -> list[Directory]:
    '''
    create a new file, automatically creates parent directories if they don't exist
    '''
    # actual disk
    # full_path = '/project/' + new_file.full_path
    # if await aiofiles.os.path.exists(full_path):
    #     raise Exception("file already exists")
    # await aiofiles.os.makedirs(os.path.dirname(full_path), exist_ok=True)
    # await aiofiles.os.open(full_path, 'w').close()
    # return await get_directory()

    await global_state.new_file(new_file.full_path)
    return recursive_convert(global_state.get_all_files())

async def open_file(open_file: OpenFile) -> str:
    await global_state.open_file(open_file.full_path)
    return global_state.read_current_file()

async def edit_file(edit_file: EditFile) -> bool:
    return global_state.write_current_file(edit_file.file_contents)

async def terminal_execute(terminal_execute: TerminalExecuteByHuman) -> TerminalResult:
    return TerminalResult(
        output="not implemented",
        new_project_directory=recursive_convert(global_state.get_all_files())
    )