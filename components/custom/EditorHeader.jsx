"use client";
import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { Code, Monitor, Smartphone } from "lucide-react";
import { useEmailTemplate, useScreenSize } from "@/app/provider";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

function EditorHeader({ viewHTMLCode }) {
  const { screenSize, setScreenSize } = useScreenSize();
  const updateEmailTemplate = useMutation(
    api.emailTemplate.UpdateTemplateDesign,
  );
  const { templateId } = useParams();
  const { emailTemplate, setEmailTemplate } = useEmailTemplate();

  const onSaveTemplate = async () => {
    await updateEmailTemplate({
      tid: templateId,
      design: emailTemplate,
    });
    toast("Email Template Saved Successfully");
  };

  return (
    <div className="p-4 shadow-sm flex justify-between items-center">
      <Link href={"/"}>
        <Image src={"/logo.svg"} alt="log" width={30} height={40} />
      </Link>
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
        <Button
          variant="ghost"
          className="hover:text-primary"
          onClick={() => viewHTMLCode(true)}
        >
          <Code />
        </Button>
        <Button variant="outline">Send Test Email</Button>
        <Button onClick={onSaveTemplate}>Save Template</Button>
      </div>
    </div>
  );
}

export default EditorHeader;
