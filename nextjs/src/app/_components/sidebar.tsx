"use client";
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Directory } from "~/lib/types"
import { DirectoryComponent } from "./directory-component"

import { FolderPlus, FilePlus, FileIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { api } from "~/trpc/react";
interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  root: Directory[] | undefined,
  handleOpenFile: (fullPath: string) => void,
  setRootFolder: (directories: Directory[]) => void
}

export function Sidebar({ className, root, handleOpenFile, setRootFolder }: SidebarProps) {
  const [isAddingNewFile, setAddingNewFile] = useState(false)

  // TODO skeleton?
  if (!root) {
    root = mock_project_structure;
  }

  return (
    <div className={className}>
      <div className=" flex items-center justify-between py-3">
        <h2 className="relative px-5 text-lg font-semibold tracking-tight">
          Explorer
        </h2>
        <div>
          <Button variant="ghost" size="icon">
            <FolderPlus />
          </Button>

          <Button variant="ghost" size="icon" onClick={() => setAddingNewFile(true)}>
            <FilePlus />
          </Button>
        </div>
      </div>
      <ScrollArea className="h-[calc(100vh-150px)]">
        <div className="pl-4">
          {root.map((directory, i) => (
            <div key={`${directory.full_path}-${i}`}>
              <DirectoryComponent dir={directory} handleOpenFile={handleOpenFile} />
            </div>
          ))}
          {isAddingNewFile && <AddNewFileComponent setRootFolder={setRootFolder} setAddingNewFile={setAddingNewFile} />}
        </div>
      </ScrollArea>
    </div>
  )
}
interface AddNewFileComponentProps {
  setAddingNewFile: (isAddingNewFile: boolean) => void,
  setRootFolder: (directories: Directory[]) => void
}
function AddNewFileComponent({ setAddingNewFile, setRootFolder }: AddNewFileComponentProps) {
  const [open, setOpen] = useState(false)
  const [fileName, setFileName] = useState("");

  const mutationSaveNewFile = api.root.new_file.useMutation({
    onSuccess: ({ root }) => {
      setRootFolder(root)
    }
  })

  useEffect(() => {
    document.onmousedown = (e) => {
      e.preventDefault();
      if (!fileName) setOpen(true)
    }
  }, [])

  function handleKeyDown(e: { key: string; }) {
    if (e.key === 'Enter' && fileName) {
      // Call edit_file
      mutationSaveNewFile.mutate({ "full_path": fileName })

      setAddingNewFile(false);
      document.onmousedown = null
    }
  }

  function handleDiscardNewFileDialog() {
    setAddingNewFile(false);
    document.onmousedown = null
  }


  function handleSaveNewFileDialog() {
    mutationSaveNewFile.mutate({ "full_path": fileName })
    setAddingNewFile(false);
    document.onmousedown = null
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start font-normal"
      >
        <FileIcon size={20} className="mr-2" />
        <input className="w-full h-full z-10" autoFocus onKeyDown={handleKeyDown} value={fileName} onChange={(e) => setFileName(e.target.value)} />
      </Button>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Do you want to save your file?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleDiscardNewFileDialog}>Discard</AlertDialogCancel>
          <AlertDialogAction onClick={handleSaveNewFileDialog}>Save File</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}


const mock_project_structure: Directory[] = [
  {
    name: "file",
    full_path: "/file",
  },
]

