"use client"

import Editor from '@monaco-editor/react';

interface FileEditorProps extends React.HTMLAttributes<HTMLDivElement> {
}
export function FileEditor({ className }: FileEditorProps) {
  return <Editor defaultLanguage="javascript" defaultValue="// some comment" />;
}