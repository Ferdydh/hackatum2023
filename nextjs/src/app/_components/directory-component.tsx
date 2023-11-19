"use client";

import * as React from "react";
import { ChevronDown, Plus, X, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Directory, File, Folder } from "~/lib/types";

import { Folder as FolderIcon } from "lucide-react";
import { File as FileIcon } from "lucide-react";

interface DirectoryComponentProps {
  dir: Directory;
  handleOpenFile: (fullPath: string) => void;
  depth: number;
}

export function DirectoryComponent({
  dir,
  handleOpenFile,
  depth,
}: DirectoryComponentProps) {
  const isFolder = (dir as Folder).sub_directories;
  return isFolder ? (
    <FolderComponent
      folder={dir as Folder}
      handleOpenFile={handleOpenFile}
      depth={depth}
    />
  ) : (
    <FileComponent
      file={dir as File}
      handleOpenFile={handleOpenFile}
      depth={depth}
    />
  );
}

interface FolderComponentProps {
  folder: Folder;
  handleOpenFile: (fullPath: string) => void;
  depth: number;
}
export function FolderComponent({
  folder,
  handleOpenFile,
  depth,
}: FolderComponentProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className={`flex items-center px-4 ml-${depth * 8}`}>
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-[250px] space-y-1"
      >
        <div className="flex items-center">
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start font-normal"
            >
              {isOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}

              <FolderIcon size={20} className="ml-1 mr-2" />
              {folder.name}
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="space-y-1">
          {folder.sub_directories.map((dir) => (
            <DirectoryComponent
              dir={dir}
              handleOpenFile={handleOpenFile}
              depth={depth + 1}
            />
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

interface FileComponentProps {
  file: File;
  handleOpenFile: (fullPath: string) => void;
  depth: number;
}
function FileComponent({ file, handleOpenFile, depth }: FileComponentProps) {
  return (
    <div className={`px-9 ml-${depth * 8}`}>
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start font-normal"
        onClick={() => handleOpenFile(file.full_path)}
      >
        <FileIcon size={20} className="mr-2" />
        {file.name}
      </Button>
    </div>
  );
}
