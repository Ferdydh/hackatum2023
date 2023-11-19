import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { api } from "~/trpc/react";

interface TerminalProps {
  terminalOutput: string,
  setTerminalOutput: (value: React.SetStateAction<string>) => void
}
export function Terminal({ terminalOutput, setTerminalOutput }: TerminalProps) {
  const [command, setCommand] = useState("");
  const terminalExecuteMutation = api.root.terminal_execute.useMutation();

  const handleExecute = async () => {
    try {
      const result = await terminalExecuteMutation.mutateAsync({ command });
      setTerminalOutput(
        (prevOutput) => prevOutput + `\n$ ${command}\n${result.output}`,
      );
      setCommand(""); // Clear the command input after execution
    } catch (error) {
      console.error("Failed to execute command", error);
      setTerminalOutput((prevOutput) => prevOutput + "\nError executing command");
    }
  };

  return (
    <div>
      <Label className="mx-3 text-xl">Terminal</Label>
      <div className=" no-scrollbar ml-4 max-h-[20vh] overflow-y-auto">
        <div>
          <pre>{terminalOutput}</pre>
        </div>
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="_"
          className="w-full bg-transparent focus:outline-none"
          onKeyDown={(e) => e.key === "Enter" && handleExecute()}
          id="terminal"
        />
      </div>
    </div>
  );
}
