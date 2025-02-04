"use client";
import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { Code, Monitor, Smartphone } from "lucide-react";
import { useScreenSize } from "@/app/provider";

function EditorHeader() {
  const { screenSize, setScreenSize } = useScreenSize();
  return (
    <div className="p-4 shadow-sm flex justify-between items-center">
      <Image src={"/logo.svg"} alt="log" width={30} height={40} />
      <div className="flex gap-3">
        <Button
          onClick={() => setScreenSize("desktop")}
          variant="ghost"
          className={`${screenSize == "desktop" && "bg-purple-100 text-primary"}`}
        >
          <Monitor /> Desktop
        </Button>
        <Button
          onClick={() => setScreenSize("mobile")}
          variant="ghost"
          className={`${screenSize == "mobile" && "bg-purple-100 text-primary"}`}
        >
          <Smartphone /> Mobile
        </Button>
      </div>
      <div className="flex gap-3">
        <Button variant="ghost" className="hover:text-primary">
          <Code />
        </Button>
        <Button variant="outline">Send Test Email</Button>
        <Button>Save Template</Button>
      </div>
    </div>
  );
}

export default EditorHeader;
