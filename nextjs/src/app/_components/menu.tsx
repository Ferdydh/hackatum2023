"use client";

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
import { Separator } from "@/components/ui/separator";
import Ducky from "../img/Ducky.png";
import Image from "next/image";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useTheme } from "next-themes";

export function Menu() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Menubar className="flex items-center justify-between">
      <div className="flex items-center">
        <Image
          src={Ducky}
          alt="Ducky"
          className="mx-3 h-7 w-10 object-contain"
        />
        <Label className="text-xl">Ducky</Label>
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
            <div className="m-3 flex items-center justify-between">
              <Label htmlFor="dark-mode" className="mr-5">
                Dark Mode
              </Label>
              <Switch onClick={toggleTheme} />
            </div>
            <div className="m-3 flex items-center  justify-between">
              <Label className="mr-5">Experimental Mode</Label>
              <Switch />
            </div>
            <Select>
              <SelectTrigger className="">
                <SelectValue placeholder="Select an Avatar" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="apple">Ducky</SelectItem>
                  <SelectItem value="banana">GPT</SelectItem>
                  <SelectItem value="blueberry">Random</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </MenubarContent>
        </MenubarMenu>

        <Separator orientation="vertical" className="mx-1" />

        <Button variant="ghost">
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
