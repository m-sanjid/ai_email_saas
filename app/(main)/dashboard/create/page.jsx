import AiInputBox from "@/components/custom/AiInputBox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles } from "lucide-react";
import React from "react";

function Create() {
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
          <TabsContent value="scratch">scratchhh</TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default Create;
