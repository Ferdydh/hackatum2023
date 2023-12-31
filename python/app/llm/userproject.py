from pydantic import BaseModel, Field

from .utils import register_tool

class UserProject:
    # getters for the current state of the project
    def get_all_files(self) -> dict:
        pass
    def get_current_file(self) -> str:
        pass
    def read_current_file(self) -> str:
        pass
    def write_current_file(self, content: str) -> bool:
        pass

    # tools for AI
    async def new_file(self, full_path: str) -> str:
        pass
    async def open_file(self, full_path: str) -> str:
        pass
    async def remove_lines(self, start: int, end: int) -> str:
        pass
    async def insert_lines(self, at: int, append_content: str) -> str:
        pass
    async def replace_lines(self, start: int, end: int, new_content: str) -> str:
        pass
    async def execute_command(self, command: str) -> str:
        pass

    async def toggle_theme(self) -> str:
        pass

    async def preview_insert_lines(self, at: int, append_content: str) -> str:
        pass
    async def preview_replace_lines(self, start: int, end: int, new_content: str) -> str:
        pass
    
    def register_all_tools(self):
        return register_tool([
            (new_file, self.new_file),
            (open_file, self.open_file),
            (remove_lines, self.remove_lines),
        #    (insert_lines, self.insert_lines),
        #    (replace_lines, self.replace_lines),
            (execute_command, self.execute_command),
            (toggle_theme, self.toggle_theme),
            ]
        )
    

class FakeProject(UserProject):
    def __init__(self):
        self.files = {} # {full_path: content}
        self.current_file = None # set by open_file

    def get_all_files(self):
        return self.files
    
    def get_current_file(self):
        return self.current_file
    
    def read_current_file(self) -> str:
        if not self.current_file:
            return "BACKEND HAS NO OPEN FILE"
        return self.files[self.current_file]
    
    def write_current_file(self, content: str) -> bool:
        if not self.current_file:
            return False
        self.files[self.current_file] = content
        return True

    # tools for AI
    async def new_file(self, full_path: str):
        if full_path in self.files:
            return f"ERROR: File already exists at {full_path}"
        self.files[full_path] = ""
        return "success"
    
    async def open_file(self, full_path: str):
        if full_path not in self.files:
            return f"ERROR: File does not exist at {full_path}"
        self.current_file = full_path
        return "success: see [OPEN FILE CONTENT] for the content of the opened file"
    
    async def remove_lines(self, start: int, end: int):
        start, end = start - 1, end  # Adjust for zero-based indexing
        if start >= end:
            return "ERROR: Start line cannot be greater than or equal to end line."
        if not self.current_file:
            return "ERROR: No file is currently open, please open a file first using the open_file tool."
        
        lines = self.files[self.current_file].split("\n")
        if start >= len(lines):
            return "ERROR: Start line is greater than the number of lines in the file."
        if end > len(lines):
            return "ERROR: End line is greater than the number of lines in the file."
        
        self.files[self.current_file] = "\n".join(lines[:start] + lines[end:])
        return "success"

    async def insert_lines(self, at: int, append_content: str):
        at = at - 1  # Adjust for zero-based indexing
        if not self.current_file:
            return "ERROR: No file is currently open, please open a file first using the open_file tool."
        
        lines = self.files[self.current_file].split("\n")
        if at > len(lines):
            return "ERROR: Line number is greater than the number of lines in the file."
        
        self.files[self.current_file] = "\n".join(lines[:at] + [append_content] + lines[at:])
        return "success"
    
    async def preview_insert_lines(self, at: int, append_content: str):
        at = at - 1  # Adjust for zero-based indexing
        lines = self.files[self.current_file].split("\n")
        return "\n".join(lines[:at] + [append_content] + lines[at:])
    
    async def preview_replace_lines(self, start: int, end: int, new_content: str):
        start, end = start - 1, end  
        lines = self.files[self.current_file].split("\n")
        return "\n".join(lines[:start] + [new_content] + lines[end:])

    async def replace_lines(self, start: int, end: int, new_content: str):
        start, end = start - 1, end  # Adjust for zero-based indexing
        if start >= end:
            return "ERROR: Start line cannot be greater than or equal to end line."
        if not self.current_file:
            return "ERROR: No file is currently open, please open a file first using the open_file tool."
        
        lines = self.files[self.current_file].split("\n")
        if start >= len(lines):
            return "ERROR: Start line is greater than the number of lines in the file."
        if end > len(lines):
            return "ERROR: End line is greater than the number of lines in the file."
        
        self.files[self.current_file] = "\n".join(lines[:start] + [new_content] + lines[end:])
        return "success"
    
    async def execute_command(self, command: str):
        return command+"\nsuccess"
    
    async def toggle_theme(self):
        return "success"
    

global_messages = []
global_state = FakeProject()


class remove_lines(BaseModel):
    """
    For the currently open file, remove the lines between the given start and end line numbers. Returns "success" if successful, otherwise an error message.
    """
    start: int = Field(description="The line number to start removing at.")
    end: int = Field(description="The line number to stop removing at.")

class insert_lines(BaseModel):
    """
    For the currently open file, insert the given content at the given line number. Returns "success" if successful, otherwise an error message.
    """
    at: int = Field(description="The line number to insert at.")
    append_content: str = Field(description="The content to insert.")

class replace_lines(BaseModel):
    """
    For the currently open file, replace the lines between the given start and end line numbers with the given content. Returns "success" if successful, otherwise an error message.
    """
    start: int = Field(description="The line number to start replacing at.")
    end: int = Field(description="The line number to stop replacing at.")
    new_content: str = Field(description="The content to replace with.")

class new_file(BaseModel):
    """
    Create a new file at the given path. Returns "success" if successful, otherwise an error message.
    """
    full_path: str = Field(description="The full path of the file to create.")
    
class open_file(BaseModel):
    """
    Open the file at the given path and read the content. Returns the content of the file if successful, otherwise an error message.
    """
    full_path: str = Field(description="The full path of the file to open.")

class execute_command(BaseModel):
    """
    Execute the given command in the integrated terminal. Returns the output of the command.
    """
    command: str = Field(description="The command to execute.")

class toggle_theme(BaseModel):
    """
    Toggle between light and dark themes.
    """
    pass
