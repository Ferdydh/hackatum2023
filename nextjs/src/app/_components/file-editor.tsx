import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { Label } from "@/components/ui/label";

interface FileEditorProps extends React.HTMLAttributes<HTMLDivElement> {
  fileFullPath: string;
  fileContent: string;
  handleSaveFile: (fileContent: string) => void;
}

export function FileEditor({ fileContent, className, fileFullPath, handleSaveFile }: FileEditorProps) {
  const { theme } = useTheme();
  const [editorTheme, setEditorTheme] = useState("light");

  useEffect(() => {
    setEditorTheme(theme === "dark" ? "vs-dark" : "light");
  }, [theme]);


  const extension = fileFullPath?.split(".")[-1]!

  const programmingLanguages = {
    "py": "python",
    "js": "javascript",
    "jsx": "javascript",
    "ts": "typescript",
    "tsx": "typescript",
  }[extension] || "javascript"

  return (
    <div className="h-full min-h-full w-full overflow-hidden">
      <Label className="mx-3 text-xl">{fileFullPath}</Label>

      {/* TODO buttons to save */}

      <Editor
        defaultLanguage={programmingLanguages}
        defaultValue={duckAscii}
        options={{ readOnly: !fileFullPath }}
        theme={editorTheme}
        className="mt-2"
        value={fileContent}
        onChange={(value) => value !== undefined && handleSaveFile(value)}
      />
    </div>
  );
}

const duckAscii = `Welcome to Ducky!
Tip: Create a file to start editing
                              
        @@@@@@@@@             
      @@@@&@@@@@@@@           
     #@@@   @@@@@@@           
  @@@@@@@@@@@@@@@@@           
       @@@@@@@@@@@            
       @@@@@@@@@@@@@@         
     @@@@@@@@@@@@@@@@@@@@@@@@ 
    @@@@@@@@@@@@@@@@@@@@@@@@  
    @@@@@@@@@@@@@@@@@@@@@@@   
     @@@@@@@@@@@@@@@@@@@@@    
         @@@@@@@@@@@@@        
`;
