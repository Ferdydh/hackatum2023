import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";

interface FileEditorProps extends React.HTMLAttributes<HTMLDivElement> {}

export function FileEditor({ className }: FileEditorProps) {
  const { theme } = useTheme();
  const [editorTheme, setEditorTheme] = useState("light");

  useEffect(() => {
    setEditorTheme(theme === "dark" ? "vs-dark" : "light");
  }, [theme]);

  return (
    <Editor
      defaultLanguage="javascript"
      defaultValue="// some comment"
      theme={editorTheme}
    />
  );
}
