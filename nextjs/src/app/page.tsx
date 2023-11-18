import { Input } from "@/components/ui/input";
import { HelloComponent } from "~/app/_components/hello-test";
import { Sidebar } from "./_components/sidebar";
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
        <Sidebar project="testt"></Sidebar>
        <div>
          <div>Text Editor</div>
          <div>Console</div>
        </div>
      </div>
    </main>
  );
}