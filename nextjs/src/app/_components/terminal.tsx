import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { api } from "~/trpc/react";
import { Button } from "@/components/ui/button";

export function Terminal() {
  const [command, setCommand] = useState("");
  const [output, setOutput] = useState("");
  const terminalExecuteMutation = api.root.terminal_execute.useMutation();

  const handleExecute = async () => {
    try {
      const result = await terminalExecuteMutation.mutateAsync({ command });
      setOutput(
        (prevOutput) => prevOutput + `\n$ ${command}\n${result.output}`,
      );
      setCommand(""); // Clear the command input after execution
    } catch (error) {
      console.error("Failed to execute command", error);
      setOutput((prevOutput) => prevOutput + "\nError executing command");
    }
  };

  return (
    <div>
      <Label className="mx-3 text-xl">Terminal</Label>
      <div className=" no-scrollbar ml-4 max-h-[20vh] overflow-y-auto">
        <div>
          <pre>{output}</pre>
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
