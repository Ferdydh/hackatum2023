from __future__ import annotations

from enum import Enum
from typing import TypeAlias
from pydantic import BaseModel, Field


# all command Types for AI-triggered (not neccesarily directly) commands
# Command argument schema from AI to frontend
class NewFile(BaseModel):
    '''Create a new file, returns the updated state of the project directory'''
    full_path: str

class DirectoryUpdate(BaseModel):
    directories: list[Directory]

class OpenFile(BaseModel):
    '''Open a file, returns the full contents of the file as str'''
    full_path: str

class EditFile(BaseModel):
    '''Save the contents of a file, returns true if successful'''
    file_contents: str

class TerminalExecute(BaseModel):
    '''Execute a command in the terminal, returns the output of the command as str, along with new project directory'''
    pass

class TerminalUpdate(BaseModel):
    terminal_contents: str

class SpeechBubble(BaseModel):
    speech_message: str

class OpenSettings(BaseModel):
    pass

class ToggleTheme(BaseModel):
    pass


# helper function to convert command to json format
def command_to_json(command: BaseModel) -> dict:
    return {
        "commandType": command.__class__.__name__,
        "commandArgs": command.model_dump()
    }


# Return Values

class File(BaseModel):
    '''File as shown on the directory tree'''
    full_path: str
    name: str

class Folder(BaseModel):
    full_path: str
    name: str
    sub_directories: list[Directory]

Directory: TypeAlias = File | Folder

class TerminalResult(BaseModel):
    '''Result of a terminal command'''
    output: str
    new_project_directory: list[Directory]