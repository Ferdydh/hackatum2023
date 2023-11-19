export type File = {
  name: string
  full_path: string
}

export type Folder = {
  name: string
  full_path: string
  sub_directories: Directory[]
}

export type Directory = File | Folder

export type CommandType = "NewFile" | "DirectoryUpdate" |
  "OpenFile" | "EditFile" |
  "TerminalExecute" | "SpeechBubble" | "TerminalUpdate" |
  "OpenSettings" | "ToggleDarkMode"

export type Command = {
  commandType: CommandType,
  commandArgs: {
    directories?: Directory[]
    full_path?: string, // New File, Open file
    file_contents?: string, // Edit File
    speech_message?: string, // Speech Bubble
    terminal_contents?: string, // Terminal update

  }
}

