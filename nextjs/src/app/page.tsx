import { Input } from "@/components/ui/input";
import { HelloComponent } from "~/app/_components/hello-test";
import { Sidebar } from "./_components/sidebar";
import { Menu } from "./_components/menu";

export default function Home() {
  return (
    <main className="min-h-screen items-center w-screen">
      {/* <HelloComponent />
        <Input></Input> */}

      <div className="h-12">
        <Menu />
      </div>
      <div className="grid grid-cols-5">
        <Sidebar project="testt" className="block col-span-2"></Sidebar>
        <div className="col-span-3 col-start-2">
          <div className="w-full h-full">Text Editor</div>
          <div>Console</div>
        </div>
      </div>
      <div className="App">
        <h1 className="bg-secondary">Hello CodeSandbox</h1>
        <h2>Start editing to see some magic happen!</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="border col-span-1">
            1
          </div>
          <div className="border col-span-1">
            2
          </div>
        </div>
      </div>
    </main>
  );
}