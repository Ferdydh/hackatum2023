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
}

export function DirectoryComponent({ dir }: DirectoryComponentProps) {
  const isFolder = (dir as Folder).sub_directories;
  return isFolder ? (
    <FolderComponent folder={dir as Folder} />
  ) : (
    <FileComponent file={dir as File} />
  );
}

interface FolderComponentProps {
  folder: Folder;
}
export function FolderComponent({ folder }: FolderComponentProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-[350px] space-y-2"
    >
      <div className="flex items-center px-4">
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

            <FolderIcon size={20} className="mr-2" />
            {folder.name}
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-2">
        {folder.sub_directories.map((dir) => {
          return <DirectoryComponent dir={dir} />;
        })}
      </CollapsibleContent>
    </Collapsible>
  );
}

interface FileComponentProps {
  file: File;
}
function FileComponent({ file }: FileComponentProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="w-full justify-start font-normal"
    >
      <FileIcon size={20} className="mr-2" />
      {file.name}
    </Button>
  );
}
