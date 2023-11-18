"use client";

import { Sidebar } from "./_components/sidebar";
import { Menu } from "./_components/menu";
import { Directory } from "~/lib/types";
import { FileEditor } from "./_components/file-editor";
import { Terminal } from "./_components/terminal";
import { ResizableBox } from "react-resizable";
import { useEffect, useState } from "react";
import { useWindowSize } from "./_hooks/useWindowSize";
import { api } from "~/trpc/react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const [editorWidth, setEditorWidth] = useState(0);
  const [sidebarWidth, setSidebarWidth] = useState(300);
  const [editorHeight, setEditorHeight] = useState(0);
  const [terminalHeight, setTerminalHeight] = useState(300);

  const windowSize = useWindowSize();

  const resizeWidth = (newSidebarWidth: number) => {
    setSidebarWidth(newSidebarWidth);
    setEditorWidth(windowSize.width - newSidebarWidth);
  };

  const resizeHeight = (newEditorHeight: number) => {
    setEditorHeight(newEditorHeight);
    setTerminalHeight(windowSize.height - newEditorHeight);
  };

  // On startup
  useEffect(() => {
    setEditorHeight(windowSize.height - 300);
    setEditorWidth(windowSize.width - 300);
  }, []);

  // on resizing browser window
  useEffect(() => {
    setEditorHeight(windowSize.height - terminalHeight)
    setEditorWidth(windowSize.width - sidebarWidth)
  }, [windowSize])

  const [rootFolder, setRootFolder] = useState<Directory[]>()

  const { data: rootFolderData, isLoading: rootFolderIsLoading } = api.root.get_project_directory.useQuery() // Should we make skeleton for sidebar?

  useEffect(() => {
    setRootFolder(rootFolderData?.root)
  }, [rootFolderData])




  return (
    <main className="min-h-screen w-screen items-center overflow-hidden">
      <div>
        <Menu />
      </div>
      <div className="flex ">
        <ResizableBox
          onResize={(_, { size }) => resizeWidth(size.width)}
          handle={
            <hr className=" absolute right-[-3px] top-[5%] z-10 h-full w-[10px] cursor-ew-resize border-solid " />
          }
          className="relative border-r-2 border-solid hover:border-r-4 hover:border-gray-400"
          width={300}
          axis="x"
        >
          <Sidebar root={rootFolder} className="w-full"></Sidebar>
        </ResizableBox>

        <ResizableBox
          width={editorWidth}
          axis="x"
          height={windowSize.height - 160}
        >
          <>
            {/** 150 is the header height */}
            <ResizableBox
              onResize={(_, { size }) => resizeHeight(size.height)}
              handle={
                <hr className="absolute bottom-[-37px] left-[0] right-[0] z-10 h-[10px] w-full cursor-ns-resize border-solid hover:border-r-4 hover:border-gray-400" />
              }
              className="relative border-b-2 border-solid "
              height={windowSize.height - 300}
              axis="y"
            >
              <>
                <Label className="mx-3 text-xl">File Name</Label>
                <FileEditor></FileEditor>
              </>
            </ResizableBox>
            <ResizableBox height={terminalHeight} axis="y">
              <Terminal></Terminal>
            </ResizableBox>
          </>
        </ResizableBox>
      </div>
    </main>
  )
}
