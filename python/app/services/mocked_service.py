import os
from app.models import NewFile, OpenFile, EditFile, File, Folder, Directory, TerminalExecuteByHuman, TerminalResult

async def get_directory() -> list[Directory]:
    return [
        Folder(full_path="src", name="src", sub_directories=[
            File(full_path="src/hello.py", name="hello.py")
            ]
        ),
        File(full_path="README.md", name="README.md"),
    ]

async def new_file(new_file: NewFile) -> list[Directory]:
    base_name = os.path.basename(new_file.full_path)
    return [File(full_path=new_file.full_path, name=new_file.full_path.split('/')[-1])]

async def open_file(open_file: OpenFile) -> str:
    return f"import os\n\nprint('hello, {open_file.full_path}')"

async def edit_file(edit_file: EditFile) -> bool:
    return True

async def terminal_execute(terminal_execute: TerminalExecuteByHuman) -> TerminalResult:
    return TerminalResult(
        output="hello, world\nhello, cats\nhello, dogs\nhello, furkan\nhello, jiwoo\nhello, jay\nhello, ferdy\nand so on",
        new_project_directory=[
            File(full_path="terminal_update.py", name="terminal_update.py"),
            Folder(full_path=terminal_execute.command, name=terminal_execute.command, sub_directories=[]),
        ]
    )
