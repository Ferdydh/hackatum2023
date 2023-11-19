import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { Label } from "@/components/ui/label";

interface FileEditorProps extends React.HTMLAttributes<HTMLDivElement> {
  fileFullPath: string,
  fileContent: string,
  handleSaveFile: (fileContent: string) => void
}

export function FileEditor({ fileContent, className, fileFullPath }: FileEditorProps) {
  const { theme } = useTheme();
  const [editorTheme, setEditorTheme] = useState("light");

  useEffect(() => {
    setEditorTheme(theme === "dark" ? "vs-dark" : "light");
  }, [theme]);

  return (
    <div className="w-full h-full min-h-full overflow-hidden">
      <Label className="mx-3 text-xl">{fileFullPath}</Label>

      {/* TODO buttons to save */}

      <Editor
        defaultLanguage="javascript"
        defaultValue={duckAscii}
        options={{ readOnly: true }}
        theme={editorTheme}
        className="mt-2"
        value={fileContent}
      />

    </div>
  );
}

const duckAscii = `READONLY: Open a file to start editing

,----,
___.\`      \`,
\`===  D     :
  \`'.      .'
     )    (                   ,
    /      \_________________/|
   /                          |
  |                           ;
  |               _____       /
  |      \       ______7    ,'
  |       \    ______7     /
   \       \`-,____7      ,'   
^~^~^~^\`\                  /~^~^~^~^
~^~^~^ \`----------------' ~^~^~^
~^~^~^~^~^^~^~^~^~^~^~^~^~^~^~^~
`