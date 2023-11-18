import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  project: string
}

export function Sidebar({ className, project }: SidebarProps) {
  // TODO change project data model and display it

  return (
    <div className={cn("py-12", className)}>
      <div>
        <h2 className="relative px-7 text-lg font-semibold tracking-tight">
          Explorer
        </h2>
        {/* Add  icons on the right*/}
      </div>
      <ScrollArea className="h-[300px] px-1">
        <div className="space-y-1 p-2">
          {playlists?.map((playlist, i) => (
            <Button
              key={`${playlist}-${i}`}
              variant="ghost"
              className="w-full justify-start font-normal"
            >
              {/* ICON here */}
              {playlist}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}



export type Playlist = (typeof playlists)[number]

export const playlists = [
  "Recently Added",
  "Recently Played",
  "Top Songs",
  "Top Albums",
  "Top Artists",
]