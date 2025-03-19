import { useEmailTemplate } from "@/app/provider";
import { useUserDetail } from "@/app/provider";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useConvex } from "convex/react";
import { Send } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid"; 

function AiInputBox() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { emailTemplate, setEmailTemplate } = useEmailTemplate();
  const { userDetail } = useUserDetail();
  const params = useParams();
  const convex = useConvex();

  const templateId = params?.templateId || uuidv4();

  const OnGenerate = async () => {
    if (!input.trim()) {
      toast.error("Please enter a prompt");
      return;
    }
  
    try {
      setLoading(true);
      toast.loading("Generating your template...");
  
      const response = await fetch("/api/ai-email-generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: input,
          email: userDetail?.email,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate template");
      }
  
      const result = await response.json();
  
      const templateData = {
        tid: templateId,
        design: result.design || {}, 
        email: userDetail?.email,
        description: input,
      };
  
      await convex.mutation(api.emailTemplate.SaveTemplate, templateData);
  
      setEmailTemplate(templateData);
  
      toast.dismiss();
      toast.success("Template generated successfully!");
      setInput("");
    } catch (error) {
      console.error("Generation error:", error);
      toast.dismiss();
      toast.error(error.message || "Failed to generate template");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-4 border-t border-gray-200">
      <div className="flex items-center gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 min-h-[80px] resize-none px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Describe the email template you want to create..."
          disabled={loading}
        />
        <Button
          onClick={OnGenerate}
          disabled={loading || !input.trim()}
          className="h-10 ml-2"
        >
          {loading ? (
            <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-white rounded-full" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
      <p className="mt-2 text-xs text-gray-500">
        Try: "Create a welcome email template for new users" or "Generate a product announcement email for our new feature"
      </p>
    </div>
  );
}

export default AiInputBox;
 