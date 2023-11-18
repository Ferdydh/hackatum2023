export type File = {
  name: string
  file_path: string
}

export type Folder = {
  name: string
  file_path: string
  sub_directories: Directory[]
}

export type Directory = File | Folder
