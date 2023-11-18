"use client"

import { Sidebar } from "./_components/sidebar";
import { Menu } from "./_components/menu";
import { Directory } from "~/lib/types";
import { FileEditor } from "./_components/file-editor";
import { Terminal } from "./_components/terminal";
import { ResizableBox } from 'react-resizable';
import { useEffect, useState } from "react";
import { useWindowSize } from "./_hooks/useWindowSize";



export default function Home() {
  const [editorWidth, setEditorWidth] = useState(0)
  const [sidebarWidth, setSidebarWidth] = useState(300)
  const [editorHeight, setEditorHeight] = useState(0)
  const [terminalHeight, setTerminalHeight] = useState(300)

  const windowSize = useWindowSize();

  const resizeWidth = (newSidebarWidth: number) => {
    setSidebarWidth(newSidebarWidth);
    setEditorWidth(windowSize.width - newSidebarWidth);
  }

  const resizeHeight = (newEditorHeight: number) => {
    setEditorHeight(newEditorHeight);
    setTerminalHeight(windowSize.height - newEditorHeight);
  }

  // On startup
  useEffect(() => {
    setEditorHeight(windowSize.height - 300)
    setEditorWidth(windowSize.width - 300)
  }, [])

  // on resizing browser window
  useEffect(() => {
    setEditorHeight(windowSize.height - terminalHeight)
    setEditorWidth(windowSize.width - sidebarWidth)
  }, [windowSize])

  return (
    <main className="min-h-screen items-center w-screen overflow-hidden">
      <div className="h-12">
        <Menu />
      </div>
      <div className="flex">
        <ResizableBox
          onResize={(_, { size }) => resizeWidth(size.width)}
          handle={<div className="absolute right-[-15px] top-[50%] z-10">text</div>}
          className="relative border-solid border-r-2 " width={300} axis="x"
        >
          <Sidebar root={mock_project_structure} className="w-full"></Sidebar>
        </ResizableBox>

        <ResizableBox width={editorWidth} axis="x" height={windowSize.height - 150}> {/** 150 is the header height */}
          <ResizableBox
            onResize={(_, { size }) => resizeHeight(size.height)}
            handle={<div className="absolute bottom-[-15px] left-[50%] z-10">text</div>}
            className="relative border-solid border-b-2" height={windowSize.height - 300} axis="y"
          >
            <FileEditor></FileEditor>
          </ResizableBox>
          <ResizableBox height={terminalHeight} axis="y">
            <Terminal></Terminal>
          </ResizableBox>
        </ResizableBox>
      </div>
    </main>
  );
}


const mock_project_structure: Directory[] = [
  {
    name: "Folder 1",
    file_path: "/Folder 1",
    sub_directories: [
      {
        name: "Folder 2",
        file_path: "/Folder 1/Folder 2",
        sub_directories: [
          {
            name: "test.py",
            file_path: "/Folder 1/Folder 2/test.py",
          },
        ],
      },
    ],
  },
  {
    name: "folder",
    file_path: "/folder",
    sub_directories: [],
  },
  {
    name: "file",
    file_path: "/file",
  },
  {
    name: "folder",
    file_path: "/folder",
    sub_directories: [],
  },
  {
    name: "file",
    file_path: "/file",
  },
  {
    name: "folder",
    file_path: "/folder",
    sub_directories: [],
  },
  {
    name: "file",
    file_path: "/file",
  },
  {
    name: "folder",
    file_path: "/folder",
    sub_directories: [],
  },
  {
    name: "file",
    file_path: "/file",
  },
  {
    name: "folder",
    file_path: "/folder",
    sub_directories: [],
  },
  {
    name: "file",
    file_path: "/file",
  },
  {
    name: "folder",
    file_path: "/folder",
    sub_directories: [],
  },
  {
    name: "file",
    file_path: "/file",
  },
  {
    name: "folder",
    file_path: "/folder",
    sub_directories: [],
  },
  {
    name: "file",
    file_path: "/file",
  },
  {
    name: "folder",
    file_path: "/folder",
    sub_directories: [],
  },
  {
    name: "file",
    file_path: "/file",
  },
  {
    name: "folder",
    file_path: "/folder",
    sub_directories: [],
  },
  {
    name: "file",
    file_path: "/file",
  },
  {
    name: "folder",
    file_path: "/folder",
    sub_directories: [],
  },
  {
    name: "file",
    file_path: "/file",
  },
  {
    name: "folder",
    file_path: "/folder",
    sub_directories: [],
  },
  {
    name: "file",
    file_path: "/file",
  },

]

