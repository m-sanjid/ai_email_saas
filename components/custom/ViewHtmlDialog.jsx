import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import React, { useRef } from "react";
import { toast } from "sonner";
import { Copy } from "lucide-react";

function ViewHtmlDialog({ htmlCode, open, onClose }) {
  const textareaRef = useRef(null);

  const copyToClipboard = () => {
    if (textareaRef.current) {
      textareaRef.current.select();
      document.execCommand("copy");
      toast.success("HTML code copied to clipboard");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>HTML Code</DialogTitle>
          <DialogDescription>
            Copy and paste this HTML code into your email marketing service
          </DialogDescription>
        </DialogHeader>
        <div className="p-2 border rounded-md bg-muted/20">
          <Textarea
            ref={textareaRef}
            value={htmlCode || ""}
            readOnly
            className="min-h-[300px] font-mono text-sm"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={copyToClipboard} className="flex items-center gap-2">
            <Copy className="h-4 w-4" />
            Copy HTML
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ViewHtmlDialog;
