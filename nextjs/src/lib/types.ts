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
