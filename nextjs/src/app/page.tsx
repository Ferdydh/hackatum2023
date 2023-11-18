import { Input } from "@/components/ui/input";
import { HelloComponent } from "~/app/_components/hello-test";
import { ProjectStructure } from "./_components/project-structure";
import { MyMenubar } from "./_components/my-menubar";

export default function Home() {
  return (
    <main className="min-h-screen items-center justify-center">
      {/* <HelloComponent />
        <Input></Input> */}

      <div className="w-screen h-12">
        <MyMenubar />
      </div>
      <ProjectStructure></ProjectStructure>
      <div>
        <div>Text Editor</div>
        <div>Console</div>
      </div>

    </main>
  );
}