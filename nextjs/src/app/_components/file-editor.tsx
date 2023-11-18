import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { Label } from "@/components/ui/label";

interface FileEditorProps extends React.HTMLAttributes<HTMLDivElement> { }

export function FileEditor({ className }: FileEditorProps) {
  const { theme } = useTheme();
  const [editorTheme, setEditorTheme] = useState("light");

  useEffect(() => {
    setEditorTheme(theme === "dark" ? "vs-dark" : "light");
  }, [theme]);

  return (
    <div className="w-full h-full min-h-full overflow-hidden">
      <Label className="mx-3 text-xl">File Name</Label>

      <Editor
        defaultLanguage="javascript"
        defaultValue="// some comment"
        theme={editorTheme}
        className="mt-2"
      />

    </div>
  );
}
