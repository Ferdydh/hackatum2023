import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";

import { SlidersHorizontal, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function Menu() {
  return (
    <Menubar className="flex items-center justify-between ">
      <div>
        <Label className="text-white">Logo</Label>
      </div>

      <Input
        type="prompt"
        placeholder="What can I do for you?"
        className="w-1/2"
      />

      <div className="flex items-center">
        <MenubarMenu>
          <MenubarTrigger>
            <SlidersHorizontal size={20} className="mr-2" />
            Settings
          </MenubarTrigger>
          <MenubarContent>
            <div className="m-3 flex items-center">
              <Label htmlFor="dark-mode" className="mr-5">
                Dark Mode
              </Label>
              <Switch id="dark-mode" />
            </div>

            <MenubarItem inset>Edit...</MenubarItem>

            <MenubarItem inset>Add Profile...</MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <Button variant="ghost" className=" text-white">
          <LogOut size={20} className="mr-2" />
          Logout
        </Button>

        <Avatar className="mx-5">
          <AvatarImage alt="@shadcn" />
          <AvatarFallback>JB</AvatarFallback>
        </Avatar>
      </div>
    </Menubar>
  );
}
