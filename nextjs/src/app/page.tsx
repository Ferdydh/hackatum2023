import { Sidebar } from "./_components/sidebar";
import { Menu } from "./_components/menu";
import { DirectoryComponent } from "./_components/directory-component";
import { Directory } from "~/lib/types";

export default function Home() {
  return (
    <main className="min-h-screen items-center w-screen">
      <div className="h-12">
        <Menu />
      </div>
      <div className="grid grid-cols-6">
        <Sidebar root={mock_project_structure} className="col-span-2 border-solid border-r-2"></Sidebar>
        <div className="col-span-2 col-start-3">
          <div className="w-full">Text Editor</div>
          <div>Console</div>
        </div>
      </div>
    </main>
  );
}


const mock_project_structure: Directory[] = [
  {
    name: "Folder 1",
    file_path: "/Folder 1",
    sub_directories: [
      {
        name: "Folder 2",
        file_path: "/Folder 1/Folder 2",
        sub_directories: [
          {
            name: "test.py",
            file_path: "/Folder 1/Folder 2/test.py",
          },
        ],
      },
    ],
  },
  {
    name: "folder",
    file_path: "/folder",
    sub_directories: [],
  },
  {
    name: "file",
    file_path: "/file",
  },
]

