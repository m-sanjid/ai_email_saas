"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { 
  Code, 
  Save, 
  ArrowLeft, 
  Settings, 
  Menu, 
  User, 
  LogOut, 
  FileText,
  HelpCircle,
  Share2,
  Send
} from "lucide-react";
import { useEmailTemplate } from "@/app/provider";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { useUserDetail } from "@/app/provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "../ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMediaQuery } from "@/hooks/use-media-query";
import { shareTemplate as shareTemplateService } from "@/lib/emailService";

function EditorHeader({ viewHTMLCode }) {
  const router = useRouter();
  const convex = useConvex();
  const { templateId } = useParams();
  const { emailTemplate, setEmailTemplate } = useEmailTemplate();
  const { userDetail } = useUserDetail();
  const [saving, setSaving] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [autosaveTimer, setAutosaveTimer] = useState(null);
  const [lastSaved, setLastSaved] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Initialize template name from template description
  useEffect(() => {
    if (emailTemplate?.description) {
      setTemplateName(emailTemplate.description);
    } else {
      setTemplateName("Untitled Template");
    }
  }, [emailTemplate?.description]);

  // Setup autosave timer
  useEffect(() => {
    // Clear the previous timer if there is one
    if (autosaveTimer) {
      clearTimeout(autosaveTimer);
    }

    // Set a new timer to save the template after 30 seconds of inactivity
    const timer = setTimeout(() => {
      if (emailTemplate?.design?.length > 0) {
        onSaveTemplate(true);
      }
    }, 30000);

    setAutosaveTimer(timer);

    // Cleanup function to clear the timer if the component unmounts
    return () => {
      if (autosaveTimer) {
        clearTimeout(autosaveTimer);
      }
    };
  }, [emailTemplate]);

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleNameChange = async () => {
    if (!templateName.trim()) {
      setTemplateName(emailTemplate.description || "Untitled Template");
      setIsEditingName(false);
      return;
    }

    setEmailTemplate(prev => ({
      ...prev,
      description: templateName
    }));

    // Save the template with the new name
    await onSaveTemplate(true);
    setIsEditingName(false);
  };

  const shareTemplate = async () => {
    if (!shareEmail.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    try {
      // Use our email service instead of simulating
      await shareTemplateService({
        to: shareEmail,
        templateName: templateName || "Untitled Template",
        templateId: templateId,
        message: `This template was shared with you by ${userDetail?.email || "a user"}.`
      });
      
      toast.success(`Template shared with ${shareEmail}`);
      setShowShareDialog(false);
      setShareEmail("");
    } catch (error) {
      toast.error("Failed to share template: " + error.message);
    }
  };

  const onSaveTemplate = async (isAutoSave = false) => {
    if (!userDetail?.email) {
      toast.error("Please log in to save templates");
      return;
    }

    if (!templateId) {
      toast.error("Invalid template ID");
      return;
    }

    try {
      setSaving(true);
      const toastId = isAutoSave ? null : toast.loading("Saving template...");

      const cleanTemplate = JSON.parse(JSON.stringify(emailTemplate));

      if (!cleanTemplate || !Array.isArray(cleanTemplate?.design)) {
        throw new Error("Invalid template structure");
      }

      const isValid = cleanTemplate.design.every(layout => {
        return layout && typeof layout === 'object' &&
          (layout.numOfCol === 1 || layout.numOfCol === 2);
      });

      if (!isValid) {
        throw new Error("Invalid template layout structure");
      }

      const result = await convex.mutation(api.emailTemplate.SaveTemplate, {
        tid: templateId,
        design: cleanTemplate.design,
        email: userDetail.email,
        description: templateName || cleanTemplate.description || "Untitled Template"
      });

      if (!result?.success) {
        throw new Error(result?.error || "Failed to save template");
      }

      if (toastId) {
        toast.dismiss(toastId);
        toast.success("Template saved successfully!");
      }
      
      setLastSaved(new Date().toISOString());
    } catch (error) {
      console.error("Error saving template:", error);
      if (!isAutoSave) {
        toast.dismiss();
        toast.error(error.message || "Failed to save template. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  const exportTemplate = async () => {
    try {
      setIsExporting(true);
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const blob = new Blob(
        [JSON.stringify(emailTemplate, null, 2)], 
        { type: 'application/json' }
      );
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${templateName.replace(/\s+/g, '-').toLowerCase()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Template exported successfully");
    } catch (error) {
      toast.error("Failed to export template: " + error.message);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-2 md:p-4 shadow-sm flex justify-between items-center border-b bg-white">
      <div className="flex items-center gap-2">
        <Button 
          onClick={() => router.push('/templates')} 
          variant="ghost" 
          size="icon" 
          className="text-muted-foreground hover:text-primary" 
          title="Back to Templates"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <Link href="/" className="hidden md:flex items-center gap-2">
          <Image src="/logo.svg" alt="logo" width={24} height={24} className="object-contain" />
          <span className="font-semibold text-primary">Email Builder</span>
        </Link>
      </div>

      <div className="flex-1 flex justify-center items-center">
        {isEditingName ? (
          <div className="relative max-w-xs">
            <Input
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              onBlur={handleNameChange}
              onKeyDown={(e) => e.key === 'Enter' && handleNameChange()}
              className="font-medium text-center pr-8"
              autoFocus
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 bottom-0"
              onClick={handleNameChange}
            >
              <Save className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div 
            onClick={() => setIsEditingName(true)} 
            className="cursor-pointer hover:bg-gray-100 px-3 py-1 rounded flex items-center gap-2 max-w-xs group transition-colors"
            title="Click to edit template name"
          >
            <h2 className="font-medium text-sm md:text-base truncate">{templateName || "Untitled Template"}</h2>
            <Settings className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {lastSaved && (
          <div className="text-xs text-muted-foreground hidden md:block">
            Last saved: {formatTime(lastSaved)}
          </div>
        )}
        
        {!isMobile && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => viewHTMLCode(true)}
              className="hidden md:flex items-center gap-1"
              title="View HTML Code"
            >
              <Code className="h-4 w-4" />
              HTML
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowShareDialog(true)}
              className="hidden md:flex items-center gap-1"
              title="Share Template"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </>
        )}
        
        <Button 
          onClick={() => onSaveTemplate(false)}
          disabled={!userDetail?.email || saving}
          size="sm"
          className="flex items-center gap-1"
        >
          {saving ? (
            <>
              <div className="animate-spin h-4 w-4 border-t-2 border-b-2 border-current rounded-full" />
              {!isMobile && "Saving..."}
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {!isMobile && "Save"}
            </>
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Template Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => onSaveTemplate(false)}>
                <Save className="mr-2 h-4 w-4" />
                <span>Save Template</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => viewHTMLCode(true)}>
                <Code className="mr-2 h-4 w-4" />
                <span>View HTML Code</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowShareDialog(true)}>
                <Share2 className="mr-2 h-4 w-4" />
                <span>Share Template</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportTemplate}>
                <FileText className="mr-2 h-4 w-4" />
                <span>Export Template</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/templates">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  <span>Back to Templates</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/account">
                  <User className="mr-2 h-4 w-4" />
                  <span>Account Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/help">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Help & Support</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/logout" className="text-red-500">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Share Template Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Template</DialogTitle>
            <DialogDescription>
              Share this template with your team members or clients
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Input
                placeholder="Enter email address"
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              Recipients will receive an email with a link to this template.
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowShareDialog(false)}>
              Cancel
            </Button>
            <Button onClick={shareTemplate} className="gap-2">
              <Send className="h-4 w-4" />
              Share
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EditorHeader;
