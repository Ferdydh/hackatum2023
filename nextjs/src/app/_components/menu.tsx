"use client";

import React, { useState, useEffect } from "react";

import {
  Menubar,
  MenubarContent,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { SlidersHorizontal, LogOut, Save } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import Ducky from "../img/Ducky.png";
import MrDucky from "../img/MrDucky.png";
import Image from "next/image";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useTheme } from "next-themes";
import { AnimatedCursor } from "./animated-cursor";

interface MenuProps {
  handleCommandStream: (eventSource: EventSource) => void;
  speechMessage: string;
  setShowPopover: (x: boolean) => void,
  showPopover: boolean,
}
export function Menu({ handleCommandStream, speechMessage, showPopover, setShowPopover }: MenuProps) {
  const { theme, setTheme } = useTheme();
  const [prompt, setPrompt] = useState("");
  const [isMrDuckySelected, setIsMrDuckySelected] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
      e.preventDefault(); // Prevent default to avoid any form submission
    }
  };

  const [selectedAvatar, setSelectedAvatar] = useState("ducky"); // State to track selected avatar

  const avatarImageSrc = selectedAvatar === "ducky" ? Ducky : MrDucky;

  const handleSubmit = () => {
    const url = "http://192.168.137.17:8002/v1/stream_api/prompt";
    const data = { user_message: prompt };

    const eventSource = new EventSource(
      url + "?user_message=" + encodeURIComponent(data.user_message),
    );

    handleCommandStream(eventSource);
  };

  useEffect(() => {
    if (showPopover) {
      document.onmousedown = ((e) => {
        setShowPopover(false)
      })
    }
  }, [showPopover])

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Menubar className="flex items-center justify-between">
      <div className="flex items-center">
        <Image
          src={avatarImageSrc}
          alt="Avatar"
          className="mx-3 h-7 w-10 object-contain"
        />
        <Label className="text-xl">Ducky</Label>
      </div>
      {/* <Button variant="outline">
        <Save size={20} className="mr-2" />
        Save
      </Button> */}

      <Popover open={showPopover}>
        <PopoverTrigger asChild>
          <Input
            type="text"
            placeholder="What can I do for you?"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown} // Use onKeyDown event here
            className="w-1/2"
          />
        </PopoverTrigger>
        <PopoverContent>
          <div>{speechMessage}</div>
        </PopoverContent>
      </Popover>

      <div className="flex items-center">
        <MenubarMenu>
          <MenubarTrigger id="settings">
            <SlidersHorizontal size={20} className="mr-2" />
            Settings
          </MenubarTrigger>
          <MenubarContent>
            <div className="m-3 flex items-center justify-between">
              <Label htmlFor="dark-mode" className="mr-5">
                Dark Mode
              </Label>
              <Switch onClick={toggleTheme} id="dark-mode-toggle" />
            </div>
            <div className="m-3 flex items-center  justify-between">
              <Label className="mr-5">Experimental Mode</Label>
              <Switch />
            </div>
            <Select
              onValueChange={(e) => {
                const newValue = e; // Assuming `e` directly gives the value. If it's an event, use e.target.value
                setSelectedAvatar(newValue);
                setIsMrDuckySelected(newValue === "mrducky"); // Check if Mr Ducky is selected
              }}
              value={selectedAvatar}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an Avatar" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="ducky">Ducky</SelectItem>
                  <SelectItem value="mrducky">Mr Ducky</SelectItem>
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
      {isMrDuckySelected && (
        <AlertDialog
          open={isMrDuckySelected}
          onOpenChange={setIsMrDuckySelected}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>You have selected Mr Ducky</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>
              <Image
                src={MrDucky}
                alt="Avatar"
                className="h-29 my-2 object-contain"
              />
              Mr Ducky is a better, faster, and more intelligent version of
              Ducky. He is still in beta and is not recommended for use in
              production. Use with caution.
            </AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsMrDuckySelected(false)}>
                Accept
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </Menubar>
  );
}
