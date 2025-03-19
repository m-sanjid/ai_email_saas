"use client";

import AiInputBox from "@/components/custom/AiInputBox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles } from "lucide-react";
import React from "react";
import { useEmailTemplate } from "@/app/provider";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

function Create() {
  const { setEmailTemplate } = useEmailTemplate();
  const router = useRouter();

  const handleStartFromScratch = () => {
    const emptyTemplate = {
      design: [
        {
          "0": {
            type: "LogoHeader",
            label: "Logo Header",
            imageUrl: "/logo.svg",
            style: {
              backgroundColor: "#ffffff",
              padding: ["10px"],
              width: ["100%"],
              textAlign: "center"
            },
            outerStyle: {
              display: "flex",
              justifyContent: ["center"],
              backgroundColor: "#ffffff",
              width: "100%"
            }
          },
          label: "Column",
          type: "column",
          numOfCol: 1
        }
      ],
      description: "New Email Template",
      tid: null
    };
    
    setEmailTemplate(emptyTemplate);
    router.push("/editor/new");
  };

  return (
    <div className="px-10  md:px-28 lg:px-64 xl:px-72 mt-20">
      <div>
        <h2 className="font-bold text-3xl">CREATE NEW EMAIL TEMPLATE</h2>
        <p className="text-lg text-gray-400">
          Effortlessly design and customize professional AI-powered email
          templates with ease
        </p>
        <Tabs defaultValue="ai" className="w-[500px] mt-10">
          <TabsList>
            <TabsTrigger value="ai">
              Create with Ai <Sparkles className="h-5 w-5 ml-2" />
            </TabsTrigger>
            <TabsTrigger value="scratch">Start from scratch</TabsTrigger>
          </TabsList>
          <TabsContent value="ai">
            <AiInputBox />
          </TabsContent>
          <TabsContent value="scratch" className="flex flex-col gap-4">
            <p className="text-gray-600">
              Start with a blank template and build your email design from scratch.
            </p>
            <Button onClick={handleStartFromScratch} className="w-fit">
              Create Empty Template
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default Create;
