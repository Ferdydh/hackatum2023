"use client";
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Directory } from "~/lib/types"
import { DirectoryComponent } from "./directory-component"
import { api } from "~/trpc/react";

import { FolderPlus, FilePlus } from "lucide-react";
// Note from FERDY
// Leave here in case we need to bring the data fetching up to page
interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  root: Directory[];
}

export function Sidebar({ className, root }: SidebarProps) {
  const { data, isLoading } = api.root.get_project_directory.useQuery()

  if (isLoading || !data) {
    // TODO skeleton?
    return <div></div>
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

          <Button variant="ghost" size="icon">
            <FilePlus />
          </Button>
        </div>
      </div>
      <ScrollArea className="h-[calc(100vh-150px)]">
        <div className="pl-4">
          {data.root.map((directory, i) => (
            <div key={`${directory.full_path}-${i}`}>
              <DirectoryComponent dir={directory} />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
