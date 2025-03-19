"use client";
import {
  useDragElementLayout,
  useEmailTemplate,
  useScreenSize,
  useUserDetail,
} from "@/app/provider";
import React, { useEffect, useRef, useState } from "react";
import ColumnLayout from "./LayoutElements/ColumnLayout";
import ViewHtmlDialog from "./ViewHtmlDialog";
import { Button } from "../ui/button";
import { 
  PlusCircle, 
  Undo,
  Redo,
  Save,
  Send,
  Grid,
  Eye,
  Copy,
  Phone,
  Rows,
  Trash,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Switch } from "../ui/switch";
import { ScrollArea } from "../ui/scroll-area";
import { sendTestEmail as sendTestEmailService } from "@/lib/emailService";

function Canvas({ viewHTMLCode, closeDialog, devicePreview = "desktop" }) {
  const htmlRef = useRef();
  const { screenSize, setScreenSize } = useScreenSize();
  const { dragElementLayout, setDragElementLayout } = useDragElementLayout();
  const { emailTemplate, setEmailTemplate } = useEmailTemplate();
  const { userDetail } = useUserDetail();
  const [dragOver, setDragOver] = useState(false);
  const [htmlCode, setHtmlCode] = useState();
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [showTestEmailDialog, setShowTestEmailDialog] = useState(false);
  const [testEmailData, setTestEmailData] = useState({
    to: "",
    subject: "Test Email - " + (emailTemplate?.description || "My Template"),
    sendToSelf: true,
    includeDesignNotes: false
  });
  const [previewMode, setPreviewMode] = useState("desktop");
  const [sendingEmail, setSendingEmail] = useState(false);

  const GetHTMLCode = () => {
    if (htmlRef.current) {
      setHtmlCode(htmlRef.current.innerHTML);
    }
  };

  // Save current state to undo stack for history management
  const saveToHistory = () => {
    setUndoStack(prev => [...prev, JSON.stringify(emailTemplate.design)]);
    setRedoStack([]);
  };

  // Handle undo operation
  const handleUndo = () => {
    if (undoStack.length === 0) return;
    
    // Save current state to redo stack
    setRedoStack(prev => [...prev, JSON.stringify(emailTemplate.design)]);
    
    // Pop last state from undo stack
    const newStack = [...undoStack];
    const lastState = newStack.pop();
    setUndoStack(newStack);
    
    // Apply the previous state
    setEmailTemplate(prev => ({
      ...prev,
      design: JSON.parse(lastState)
    }));
    
    toast.info("Undo successful");
  };

  // Handle redo operation
  const handleRedo = () => {
    if (redoStack.length === 0) return;
    
    // Save current state to undo stack
    setUndoStack(prev => [...prev, JSON.stringify(emailTemplate.design)]);
    
    // Pop last state from redo stack
    const newStack = [...redoStack];
    const nextState = newStack.pop();
    setRedoStack(newStack);
    
    // Apply the next state
    setEmailTemplate(prev => ({
      ...prev,
      design: JSON.parse(nextState)
    }));
    
    toast.info("Redo successful");
  };

  // Save template
  const saveTemplate = () => {
    toast.success("Template saved successfully");
  };

  // Open test email dialog
  const openTestEmailDialog = () => {
    GetHTMLCode();
    setShowTestEmailDialog(true);
    if (userDetail?.email) {
      setTestEmailData(prev => ({
        ...prev,
        to: testEmailData.sendToSelf ? userDetail.email : prev.to
      }));
    }
  };

  // Send test email
  const sendTestEmail = async () => {
    if (!testEmailData.to) {
      toast.error("Please enter a recipient email address");
      return;
    }

    setSendingEmail(true);
    
    try {
      // Call our email service instead of simulating
      await sendTestEmailService({
        to: testEmailData.to,
        subject: testEmailData.subject,
        htmlContent: htmlCode || "<p>No content to preview</p>",
        includeDesignNotes: testEmailData.includeDesignNotes
      });
      
      setSendingEmail(false);
      setShowTestEmailDialog(false);
      toast.success("Test email sent successfully to " + testEmailData.to);
    } catch (error) {
      setSendingEmail(false);
      toast.error("Failed to send test email: " + error.message);
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const createDefaultStyles = (type) => {
    const baseStyle = {
      backgroundColor: "#ffffff",
      padding: ["10px"],
      width: ["100%"]
    };

    const baseOuterStyle = {
      display: "flex",
      justifyContent: ["center"],
      backgroundColor: "#ffffff",
      width: "100%"
    };

    switch (type) {
      case "Text":
        return {
          style: {
            ...baseStyle,
            textAlign: "left",
            fontSize: "16px",
            lineHeight: "1.6",
            color: "#374151",
            fontWeight: "400" // Using numeric font weight for better compatibility
          },
          outerStyle: baseOuterStyle
        };
      case "Button":
        return {
          style: {
            ...baseStyle,
            backgroundColor: "#3b82f6",
            color: "#ffffff",
            padding: ["10px", "20px"],
            width: ["auto"],
            borderRadius: ["4px"],
            textAlign: "center"
          },
          outerStyle: {
            ...baseOuterStyle,
            padding: ["20px"]
          }
        };
      case "LogoHeader":
        return {
          style: {
            ...baseStyle,
            width: ["20%"],
            textAlign: "center"
          },
          outerStyle: baseOuterStyle
        };
      case "Image":
        return {
          style: {
            ...baseStyle,
            width: ["100%"]
          },
          outerStyle: baseOuterStyle
        };
      default:
        return {
          style: baseStyle,
          outerStyle: baseOuterStyle
        };
    }
  };

  const createNewElement = (type, content = "") => {
    const styles = createDefaultStyles(type);
    const element = {
      type,
      label: `${type} Element`,
      content: content || getDefaultContent(type),
      ...styles
    };

    if (type === "LogoHeader") {
      element.imageUrl = "/logo.svg";
    } else if (type === "Image") {
      element.imageUrl = "/image.png";
    }

    return {
      "0": element,
      label: `${type} Section`,
      type: "column",
      numOfCol: 1
    };
  };

  const getDefaultContent = (type) => {
    switch (type) {
      case "Text":
        return "Add your text here";
      case "Button":
        return "Click Here";
      default:
        return "";
    }
  };

  const createTemplateFromScratch = () => {
    // Save current state to history before making changes
    saveToHistory();
    
    const newTemplate = [
      createNewElement("LogoHeader"),
      createNewElement("Text", "Welcome to our newsletter!"),
      {
        "0": {
          type: "Text",
          label: "Feature 1",
          content: "First amazing feature",
          ...createDefaultStyles("Text"),
        },
        "1": {
          type: "Text",
          label: "Feature 2",
          content: "Second amazing feature",
          ...createDefaultStyles("Text"),
        },
        label: "Features Section",
        type: "column",
        numOfCol: 2
      },
      createNewElement("Button", "Get Started →")
    ];

    setEmailTemplate({
      ...emailTemplate,
      design: newTemplate
    });
  };

  const onDropHandle = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragOver(false);
    
    if (dragElementLayout?.dragElement) {
      // Save current state to history before making changes
      saveToHistory();
      
      const elementType = dragElementLayout.dragElement.type;
      const content = dragElementLayout.dragElement.content || getDefaultContent(elementType);

      // Handle layout drops
      if (dragElementLayout.dragType === "layout") {
        const newElement = {
          "0": {
            ...dragElementLayout.dragElement,
            content,
            ...createDefaultStyles(elementType)
          },
          "1": dragElementLayout.dragElement.numOfCol === 2 ? {
            ...dragElementLayout.dragElement,
            content: getDefaultContent(elementType),
            ...createDefaultStyles(elementType)
          } : undefined,
          label: `${elementType} Section`,
          type: "column",
          numOfCol: dragElementLayout.dragElement.numOfCol || 1
        };

        setEmailTemplate(prev => ({
          ...prev,
          design: Array.isArray(prev.design) ? [...prev.design, newElement] : [newElement]
        }));
      } else {
        // Handle element drops
        const newElement = createNewElement(elementType, content);
        setEmailTemplate(prev => ({
          ...prev,
          design: Array.isArray(prev.design) ? [...prev.design, newElement] : [newElement]
        }));
      }

      // Clear drag state
      setDragElementLayout(null);
    }
  };

  const clearTemplate = () => {
    if (confirm("Are you sure you want to clear the template? This cannot be undone.")) {
      saveToHistory();
      setEmailTemplate(prev => ({
        ...prev,
        design: []
      }));
      toast.info("Template cleared");
    }
  };

  const getLayoutComponent = (layout) => {
    if (layout?.type === "column") {
      return <ColumnLayout layout={layout} />;
    }
    return null;
  };

  // Get max width based on device preview
  const getPreviewMaxWidth = () => {
    switch(devicePreview) {
      case "mobile":
        return "max-w-sm"; // ~375px
      case "tablet":
        return "max-w-xl"; // ~768px
      case "desktop":
      default:
        return "max-w-2xl"; // ~1024px
    }
  };

  useEffect(() => {
    viewHTMLCode && GetHTMLCode();
  }, [viewHTMLCode]);

  useEffect(() => {
    // Update screenSize when devicePreview changes
    setScreenSize(devicePreview);
  }, [devicePreview, setScreenSize]);

  return (
    <div className="flex flex-col items-center">
      {/* Action Buttons */}
      <div className="sticky top-0 z-10 flex justify-center mb-4 gap-2 w-full bg-background p-2 shadow-sm rounded-md flex-wrap">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleUndo}
            disabled={undoStack.length === 0}
            title="Undo"
            className="h-9 w-9 p-0"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRedo}
            disabled={redoStack.length === 0}
            title="Redo"
            className="h-9 w-9 p-0"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={saveTemplate}
            title="Save Template"
            className="h-9"
          >
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={openTestEmailDialog}
            title="Send Test Email"
            className="h-9"
          >
            <Send className="h-4 w-4 mr-1" />
            Test Email
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={GetHTMLCode}
            title="View HTML"
            className="h-9"
          >
            <Eye className="h-4 w-4 mr-1" />
            View HTML
          </Button>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearTemplate}
            title="Clear Template"
            className="h-9 text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <Trash className="h-4 w-4 mr-1" />
            Clear
          </Button>
        </div>
      </div>

      <div
        ref={htmlRef}
        className={`relative p-6 w-full transition-all duration-200 rounded-lg ${
          getPreviewMaxWidth()
        } ${
          dragOver 
            ? "bg-zinc-50 border-2 border-dashed border-zinc-400 shadow-lg scale-[1.02]" 
            : "bg-white border border-gray-200 shadow-sm"
        }`}
        onDragOver={onDragOver}
        onDrop={onDropHandle}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragOver(false);
        }}
      >
        {emailTemplate?.design?.length > 0 ? (
          emailTemplate.design.map((layout, index) => (
            <div key={index} className="mb-4 last:mb-0">
              {getLayoutComponent(layout)}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="text-gray-500 mb-4">
              Drag and drop elements here to build your email template
            </p>
            <Button
              variant="outline"
              onClick={createTemplateFromScratch}
              className="flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Create Template
            </Button>
          </div>
        )}
      </div>

      {/* Test Email Dialog */}
      <Dialog open={showTestEmailDialog} onOpenChange={setShowTestEmailDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Send Test Email</DialogTitle>
            <DialogDescription>
              Send a test email to preview your template
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="preview" className="w-full h-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Email Preview
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Grid className="h-4 w-4" />
                Send Options
              </TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="mt-0">
              <div className="flex justify-center mb-3 space-x-2">
                <Button
                  variant={previewMode === "desktop" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPreviewMode("desktop")}
                  className="flex items-center gap-1"
                >
                  <Rows className="h-4 w-4" />
                  Desktop
                </Button>
                <Button
                  variant={previewMode === "mobile" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPreviewMode("mobile")}
                  className="flex items-center gap-1"
                >
                  <Phone className="h-4 w-4" />
                  Mobile
                </Button>
              </div>

              <div className={`border rounded-md overflow-hidden ${previewMode === "mobile" ? "max-w-[375px] mx-auto" : "w-full"}`}>
                <div className="bg-gray-100 p-2 border-b">
                  <div className="text-sm font-medium">Subject: {testEmailData.subject}</div>
                  <div className="text-xs text-gray-500">To: {testEmailData.to || "recipient@example.com"}</div>
                </div>
                <ScrollArea className={`${previewMode === "mobile" ? "h-[400px]" : "h-[500px]"}`}>
                  <div className="p-4 bg-white" dangerouslySetInnerHTML={{ __html: htmlCode || "<p>No content to preview</p>" }} />
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="mt-0 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recipient">Recipient Email</Label>
                <Input
                  id="recipient"
                  placeholder="recipient@example.com"
                  value={testEmailData.to}
                  onChange={(e) => setTestEmailData({ ...testEmailData, to: e.target.value })}
                  disabled={testEmailData.sendToSelf}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Email Subject</Label>
                <Input
                  id="subject"
                  placeholder="Test Email Subject"
                  value={testEmailData.subject}
                  onChange={(e) => setTestEmailData({ ...testEmailData, subject: e.target.value })}
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="sendToSelf"
                  checked={testEmailData.sendToSelf}
                  onCheckedChange={(checked) => {
                    setTestEmailData({
                      ...testEmailData,
                      sendToSelf: checked,
                      to: checked ? userDetail?.email : ""
                    });
                  }}
                />
                <Label htmlFor="sendToSelf">Send to myself ({userDetail?.email || "not logged in"})</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="includeNotes"
                  checked={testEmailData.includeDesignNotes}
                  onCheckedChange={(checked) => setTestEmailData({ ...testEmailData, includeDesignNotes: checked })}
                />
                <Label htmlFor="includeNotes">Include design notes and debug information</Label>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTestEmailDialog(false)}>
              Cancel
            </Button>
            <Button onClick={sendTestEmail} disabled={sendingEmail}>
              {sendingEmail ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Test Email
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ViewHtmlDialog
        htmlCode={htmlCode}
        open={viewHTMLCode}
        onClose={closeDialog}
      />
    </div>
  );
}

export default Canvas;
