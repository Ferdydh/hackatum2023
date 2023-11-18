from __future__ import annotations

from enum import Enum
from typing import TypeAlias
from pydantic import BaseModel, Field


# Command Types for AI-triggered commands
# class Commands(str, Enum):
#     # file management
#     NEW_FILE = "NEW_FILE" # changes project directory
#     # RENAME_FILE = "RENAME_FILE" # changes project directory
#     # DELETE_FILE = "DELETE_FILE" # changes project directory

#     # file editing
#     OPEN_FILE = "OPEN_FILE"
#     EDIT_FILE = "EDIT_FILE"

#     # terminal
#     TERMINAL_EXECUTE = "TERMINAL_EXECUTE" # could potentially change project directory

#     # IDE settings
#     OPEN_SETTINGS = "OPEN_SETTINGS"
#     TOGGLE_THEME = "TOGGLE_THEME"


# Command Arguments
class NewFile(BaseModel):
    '''Create a new file, returns true if successful'''
    full_path: str

# class RenameFile(BaseModel):
#     '''Rename a file, returns true if successful'''
#     old_full_path: str
#     new_full_path: str

# class DeleteFile(BaseModel):
#     '''Delete a file, returns true if successful'''
#     full_path: str

class OpenFile(BaseModel):
    '''Open a file, returns the full contents of the file as str'''
    full_path: str

class EditFile(BaseModel):
    '''Save the contents of a file, returns true if successful'''
    full_path: str
    new_contents: str

class TerminalExecute(BaseModel):
    '''Execute a command in the terminal, returns the output of the command as str, along with new project directory'''
    command: str


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