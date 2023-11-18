import { Input } from "@/components/ui/input";
import { HelloComponent } from "~/app/_components/hello-test";
import { ProjectStructure } from "./_components/project-structure";
import { Menu } from "./_components/menu";

export default function Home() {
  return (
    <main className="min-h-screen items-center justify-center">
      {/* <HelloComponent />
        <Input></Input> */}

      <div className="w-screen h-12">
        <Menu />
      </div>
      <div className="w-screen flex flex-row">
        <ProjectStructure></ProjectStructure>
        <div>
          <div>Text Editor</div>
          <div>Console</div>
        </div>
      </div>
    </main>
  );
}