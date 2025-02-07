"use client";
import React, { useState } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import Prompt from "@/Data/Prompt";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { v4 as uuidv4 } from "uuid";
import { useUserDetail } from "@/app/provider";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

function AiInputBox() {
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const SaveTemplate = useMutation(api.emailTemplate.SaveTemplate);
  const { userDetail, setUserDetail } = useUserDetail();
  const router = useRouter();
  const OnGenerate = async () => {
    const PROMPT = Prompt.EMAIL_PROMPT + "\n-" + userInput;
    const tid = uuidv4();
    setLoading(true);
    try {
      const result = await axios.post("/api/ai-email-generate", {
        prompt: PROMPT,
      });
      console.log(result.data);
      // Save in DB
      const response = await SaveTemplate({
        tid: tid,
        design: result.data,
        email: userDetail?.email,
        description: userInput,
      });
      console.log(response);
      router.push("/editor/" + tid);
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  return (
    <div className="mt-5">
      <p className="mb-2">
        Provide details about the email template you'd like to create
      </p>
      <Textarea
        placeholder="Start writing here"
        className="text-xl"
        rows="5"
        onChange={(e) => setUserInput(e.target.value)}
      />
      <Button
        className="w-full mt-7"
        disabled={userInput?.length == 0 || loading}
        onClick={OnGenerate}
      >
        {loading ? (
          <span className="flex gap-2">
            <Loader2 className="animate-spin" /> Please wait...
          </span>
        ) : (
          "Generate"
        )}
      </Button>
    </div>
  );
}

export default AiInputBox;
