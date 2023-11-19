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

import { SlidersHorizontal, LogOut, Save } from "lucide-react";

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
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useTheme } from "next-themes";

export function Menu() {
  const { theme, setTheme } = useTheme();
  const [showPopover, setShowPopover] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
      e.preventDefault(); // Prevent default to avoid any form submission
    }
  };

  const handleSubmit = () => {
    const url = "http://192.168.137.17:8002/v1/stream_api/prompt";
    const data = { user_message: prompt };

    const eventSource = new EventSource(
      url + "?user_message=" + encodeURIComponent(data.user_message),
    );

    eventSource.onmessage = (event) => {
      setShowPopover(true);
      const newMessages = JSON.parse(event.data).message;
      setMessages(newMessages);
    };

    eventSource.onerror = (error) => {
      console.error("EventSource failed:", error);
      eventSource.close();
    };
  };

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
      <Button variant="outline">
        <Save size={20} className="mr-2" />
        Save
      </Button>

      <Popover>
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
        {showPopover && (
          <PopoverContent>
            <div>{messages}</div>
          </PopoverContent>
        )}
      </Popover>

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
