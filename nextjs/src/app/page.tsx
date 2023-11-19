"use client";

import { Sidebar } from "./_components/sidebar";
import { Menu } from "./_components/menu";
import { Command, Directory } from "~/lib/types";
import { FileEditor } from "./_components/file-editor";
import { Terminal } from "./_components/terminal";
import { ResizableBox } from "react-resizable";
import { useEffect, useState } from "react";
import { useWindowSize } from "./_hooks/useWindowSize";
import { api } from "~/trpc/react";
import { AnimatedCursor } from "./_components/animated-cursor";
import { useTheme } from "next-themes";
import { useQueue } from 'react-use';

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
    setEditorHeight(windowSize.height - terminalHeight);
    setEditorWidth(windowSize.width - sidebarWidth);
  }, [windowSize]);

  const [rootFolder, setRootFolder] = useState<Directory[]>();

  const { data: rootFolderData, isLoading: rootFolderIsLoading } =
    api.root.get_project_directory.useQuery(); // Should we make skeleton for sidebar?

  useEffect(() => {
    setRootFolder(rootFolderData?.root);
  }, [rootFolderData]);

  const [fileContent, setFileContent] = useState<string>();
  const [fileFullPath, setFileFullPath] = useState<string>();

  const mutationOpenFile = api.root.open_file.useMutation({
    onSuccess: ({ file_content }) => {
      setFileContent(file_content);
    },
  });

  function handleOpenFile(fullPath: string) {
    mutationOpenFile.mutate({ full_path: fullPath });
    setFileFullPath(fullPath);
  }

  const mutationEditFile = api.root.edit_file.useMutation({
    onSuccess: ({ success }) => { },
  });

  function handleSaveFile(fileContent: string) {
    // Call edit file
    mutationEditFile.mutate({
      new_contents: fileContent,
      full_path: fileFullPath!,
    });
    setFileContent(fileContent);
  }

  const [selectedAvatar, setSelectedAvatar] = useState("ducky"); // State to track selected avatar


  const handleCommandStream = (eventSource: EventSource) => {
    eventSource.onmessage = (event) => {
      const newCommand = JSON.parse(event.data) as Command;
      processCommand(newCommand)
    }

    eventSource.onerror = (error) => {
      // Call backend and tell where we send an interruption
      console.error("EventSource failed:", error);
      eventSource.close();
    };
  };

  const [speechMessage, setSpeechMessage] = useState("");
  const [showPopover, setShowPopover] = useState(false);


  const [terminalOutput, setTerminalOutput] = useState("");
  const { theme, setTheme } = useTheme();

  function processCommand(command: Command) {
    setShowPopover(false)
    switch (command.commandType) {
      case "NewFile":
        // Cursor Movement to new file
        handleMoveAnimatedCursor("file-add");
        break;

      case "DirectoryUpdate":
        // Set the new rootdir
        setRootFolder(command.commandArgs.directories!)
        break;

      case "OpenFile":
        // Cursor movement to file
        handleMoveAnimatedCursor(command.commandArgs.full_path!)
        setFileFullPath(command.commandArgs.full_path)
        break;

      case "EditFile":
        // Set file_contents
        setFileContent(command.commandArgs.file_contents);
        break;

      case "TerminalExecute":
        // Cursor movement to terminal input
        handleMoveAnimatedCursor("terminal");
        break;

      case "TerminalUpdate":
        // set terminal content
        setTerminalOutput(command.commandArgs.terminal_contents!)
        break;

      case "SpeechBubble":
        // Set speech message state
        setShowPopover(true)
        setSpeechMessage(command.commandArgs.speech_message!)
        break;

      case "OpenSettings":
        // Cursor Movement to settings and open the dropdown
        handleMoveAnimatedCursor("settings");
        break;

      case "ToggleTheme":
        // Cursor to Toggle Dark Mode and toggle it
        handleMoveAnimatedCursor("dark-mode-toggle");
        setTheme(theme === "light" ? "dark" : "light");
        break;

      default:
        console.error("Unkown command type");
        break;
    }

  }

  const [targetX, setTargetX] = useState(0);
  const [targetY, setTargetY] = useState(0);

  function handleMoveAnimatedCursor(elementId: string) {
    const rect = document.getElementById(elementId)?.getBoundingClientRect();

    if (!rect) return;

    setTargetX(rect.x);
    setTargetY(rect.y);
  }

  return (
    <main className="min-h-screen w-screen items-center overflow-hidden">
      <AnimatedCursor targetX={targetX} targetY={targetY} />

      <div>
        <Menu
          showPopover={showPopover}
          setShowPopover={setShowPopover}
          handleCommandStream={handleCommandStream}
          speechMessage={speechMessage}
          selectedAvatar={selectedAvatar}
          setSelectedAvatar={setSelectedAvatar}
        />
      </div>
      <div className="flex ">
        <ResizableBox
          onResize={(_, { size }) => resizeWidth(size.width)}
          handle={
            <hr className=" absolute right-[-3px] top-[0%] z-10 h-full w-[2px] cursor-ew-resize border-solid hover:border-r-4 hover:border-gray-400" />
          }
          className="relative border-r-2 border-solid "
          width={300}
          axis="x"
        >
          <Sidebar
            root={rootFolder}
            setRootFolder={setRootFolder}
            handleOpenFile={handleOpenFile}
            className="w-full"
          ></Sidebar>
        </ResizableBox>

        <ResizableBox
          width={editorWidth}
          axis="x"
          height={windowSize.height - 160}
        >
          <>
            <ResizableBox
              onResize={(_, { size }) => resizeHeight(size.height)}
              handle={
                <hr className="absolute bottom-[-10px] left-[0] right-[0] z-10 h-[10px] w-full cursor-ns-resize border-solid hover:border-r-4 hover:border-gray-400" />
              }
              className="relative border-b-2 border-solid "
              height={windowSize.height - 300}
              axis="y"
            >
              <FileEditor
                fileFullPath={fileFullPath!}
                fileContent={fileContent!}
                handleSaveFile={handleSaveFile}
              ></FileEditor>
            </ResizableBox>
            <ResizableBox height={terminalHeight} axis="y">
              <Terminal
                terminalOutput={terminalOutput}
                setTerminalOutput={setTerminalOutput}
              ></Terminal>
            </ResizableBox>
          </>
        </ResizableBox>
      </div>
    </main>
  );
}
