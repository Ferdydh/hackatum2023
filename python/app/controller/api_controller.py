from fastapi import APIRouter
from app.services import api_service, mocked_service
from app.models import NewFile, RenameFile, DeleteFile, OpenFile, EditFile, TerminalExecute, File, Folder, Directory, TerminalResult

router = APIRouter()


# TEST
@router.get("/test")
def hello_controller(query_string: str):
    result = api_service.hello(query_string)
    return result


# Endpoints
SERVICE = mocked_service
# SERVICE = api_service

@router.get("/get_project_directory")
async def get_directory_controller() -> list[Directory]:
    result = await SERVICE.get_directory()
    return result

@router.post("/new_file")
async def new_file_controller(new_file: NewFile) -> list[Directory]:
    result = await SERVICE.new_file(new_file)
    return result

# @router.post("/rename_file")
# async def rename_file_controller(rename_file: RenameFile) -> list[Directory]:
#     result = await SERVICE.rename_file(rename_file)
#     return result

# @router.post("/delete_file")
# async def delete_file_controller(delete_file: DeleteFile) -> list[Directory]:
#     result = await SERVICE.delete_file(delete_file)
#     return result

@router.post("/open_file")
async def open_file_controller(open_file: OpenFile) -> str:
    result = await SERVICE.open_file(open_file)
    return result

@router.post("/edit_file")
async def edit_file_controller(edit_file: EditFile) -> bool:
    result = await SERVICE.edit_file(edit_file)
    return result

@router.post("/terminal_execute")
async def terminal_execute_controller(terminal_execute: TerminalExecute) -> TerminalResult:
    result = await SERVICE.terminal_execute(terminal_execute)
    return result