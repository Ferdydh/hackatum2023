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
      setOutput(result.output);
    } catch (error) {
      console.error("Failed to execute command", error);
      setOutput("Error executing command");
    }
  };

  return (
    <div className="h-20vh mt-8">
      <Label className="mx-3 text-xl">Terminal</Label>
      <div className="ml-4">
        <pre>{output}</pre>
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="_"
          className=" w-full bg-transparent focus:outline-none"
          onKeyDown={(e) => e.key === "Enter" && handleExecute()}
        />
      </div>
    </div>
  );
}
