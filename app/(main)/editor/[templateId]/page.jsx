"use client";
import { useEmailTemplate } from "@/app/provider";
import { useUserDetail } from "@/app/provider";
import Canvas from "@/components/custom/Canvas";
import EditorHeader from "@/components/custom/EditorHeader";
import ElementsSideBar from "@/components/custom/ElementSideBar";
import Settings from "@/components/custom/Settings";
import { api } from "@/convex/_generated/api";
import { useConvex } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutGrid, Sidebar, Sliders, Smartphone, Tablet, Monitor, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

function Editor() {
  const [viewHTMLCode, setViewHTMLCode] = useState(false);
  const { templateId } = useParams();
  const { userDetail } = useUserDetail();
  const [loading, setLoading] = useState(true);
  const [activeSidebar, setActiveSidebar] = useState("elements");
  const [devicePreview, setDevicePreview] = useState("desktop");
  const [isMobileView, setIsMobileView] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { emailTemplate, setEmailTemplate } = useEmailTemplate();
  const convex = useConvex();
  const router = useRouter();

  // Check for mobile viewport
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobileView(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarCollapsed(true);
      }
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  useEffect(() => {
    if (!userDetail?.email) {
      toast.error("Please log in to access templates");
      router.push("/login");
      return;
    }

    if (templateId === "new") {
      const newId = crypto.randomUUID();
      
      setEmailTemplate({
        tid: newId,
        design: [],
        description: "New template",
      });

      // Then save to database
      convex.mutation(api.emailTemplate.SaveTemplate, {
        tid: newId,
        design: [],
        email: userDetail.email,
        description: "New template",
      }).then(() => {
        router.replace(`/editor/${newId}`);
        setLoading(false);
      }).catch(error => {
        toast.error("Failed to create new template: " + (error.message || "Unknown error"));
        router.push("/templates");
        setLoading(false);
      });
      return;
    }

    if (userDetail?.email && templateId) {
      GetTemplateData();
    }
  }, [userDetail, templateId]);

  const GetTemplateData = async () => {
    try {
      const result = await convex.query(api.emailTemplate.GetTemplateDesign, {
        tid: templateId,
        email: userDetail.email,
      });
      
      if (!result) {
        await convex.mutation(api.emailTemplate.SaveTemplate, {
          tid: templateId,
          design: [],
          email: userDetail.email,
          description: "New template",
        });
        
        setEmailTemplate({
          tid: templateId,
          design: [],
          description: "New template",
        });
        
        toast.success("Created a new empty template");
      } else {
        // Update the emailTemplate context with the fetched data
        setEmailTemplate({
          tid: templateId,
          design: result.design || [],
          description: result.description || "",
        });
      }

    } catch (error) {
      toast.error("Failed to load template: " + (error.message || "Unknown error"));
      router.push("/templates");
    } finally {
      setLoading(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Handle back navigation
  const goBack = () => {
    router.push('/templates');
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <EditorHeader viewHTMLCode={(v) => setViewHTMLCode(v)} />
      {!loading ? (
        <>
          {/* Mobile Top Bar with Back Button and Device Preview */}
          {isMobileView && (
            <div className="p-2 flex justify-between items-center border-b">
              <Button variant="ghost" size="sm" onClick={goBack}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <div className="flex items-center space-x-1">
                <Button
                  variant={devicePreview === "mobile" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setDevicePreview("mobile")}
                  className="h-8 w-8"
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
                <Button
                  variant={devicePreview === "tablet" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setDevicePreview("tablet")}
                  className="h-8 w-8"
                >
                  <Tablet className="h-4 w-4" />
                </Button>
                <Button
                  variant={devicePreview === "desktop" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setDevicePreview("desktop")}
                  className="h-8 w-8"
                >
                  <Monitor className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="h-8 w-8"
              >
                <Sidebar className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Desktop Layout */}
          {!isMobileView && (
            <ResizablePanelGroup
              direction="horizontal"
              className="flex-1"
            >
              <ResizablePanel
                defaultSize={20}
                minSize={10}
                maxSize={30}
                collapsible={true}
                collapsedSize={5}
                onCollapse={() => setIsSidebarCollapsed(true)}
                onExpand={() => setIsSidebarCollapsed(false)}
                className="min-h-0"
              >
                <div className="h-full">
                  <ElementsSideBar />
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={60} minSize={40} className="min-h-0">
                <div className={`h-full flex flex-col ${devicePreview !== "desktop" ? "items-center py-4" : ""}`}>
                  <div className="flex justify-center mb-2">
                    <div className="bg-background border rounded-lg flex items-center p-1 shadow-sm">
                      <Button
                        variant={devicePreview === "mobile" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setDevicePreview("mobile")}
                        className="h-8"
                      >
                        <Smartphone className="h-4 w-4 mr-1" />
                        Mobile
                      </Button>
                      <Button
                        variant={devicePreview === "tablet" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setDevicePreview("tablet")}
                        className="h-8"
                      >
                        <Tablet className="h-4 w-4 mr-1" />
                        Tablet
                      </Button>
                      <Button
                        variant={devicePreview === "desktop" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setDevicePreview("desktop")}
                        className="h-8"
                      >
                        <Monitor className="h-4 w-4 mr-1" />
                        Desktop
                      </Button>
                    </div>
                  </div>
                  <div 
                    className={`flex-1 overflow-auto ${
                      devicePreview === "mobile" 
                        ? "w-[375px] border rounded-lg shadow-sm" 
                        : devicePreview === "tablet" 
                          ? "w-[768px] border rounded-lg shadow-sm" 
                        : "w-full"
                    }`}
                  >
                    <Canvas
                      viewHTMLCode={viewHTMLCode}
                      closeDialog={() => setViewHTMLCode(false)}
                      devicePreview={devicePreview}
                    />
                  </div>
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel
                defaultSize={20}
                minSize={10}
                maxSize={35}
                collapsible={true}
                className="min-h-0"
              >
                <div className="h-full">
                  <Settings />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          )}

          {/* Mobile Layout */}
          {isMobileView && (
            <div className="flex-1 flex flex-col">
              {/* Canvas Area */}
              <div className={`flex-1 ${isSidebarCollapsed ? 'block' : 'hidden'}`}>
                <div className={`h-full flex flex-col ${devicePreview !== "desktop" ? "items-center py-4" : ""}`}>
                  <div 
                    className={`flex-1 overflow-auto ${
                      devicePreview === "mobile" 
                        ? "w-full max-w-[375px] mx-auto border rounded-lg shadow-sm" 
                        : devicePreview === "tablet" 
                          ? "w-full max-w-[640px] mx-auto border rounded-lg shadow-sm" 
                        : "w-full"
                    }`}
                  >
                    <Canvas
                      viewHTMLCode={viewHTMLCode}
                      closeDialog={() => setViewHTMLCode(false)}
                      devicePreview={devicePreview}
                    />
                  </div>
                </div>
              </div>
              
              {/* Bottom Tab Navigation for Mobile */}
              {!isSidebarCollapsed && (
                <div className="h-[calc(100vh-112px)]">
                  <Tabs defaultValue="elements" value={activeSidebar} onValueChange={setActiveSidebar} className="h-full flex flex-col">
                    <TabsList className="grid grid-cols-2 mb-2">
                      <TabsTrigger value="elements">
                        <LayoutGrid className="h-4 w-4 mr-2" />
                        Elements
                      </TabsTrigger>
                      <TabsTrigger value="settings">
                        <Sliders className="h-4 w-4 mr-2" />
                        Settings
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="elements" className="flex-1 overflow-hidden">
                      <ElementsSideBar />
                    </TabsContent>
                    <TabsContent value="settings" className="flex-1 overflow-hidden">
                      <Settings />
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center h-[calc(100vh-60px)] gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading your template...</p>
        </div>
      )}
    </div>
  );
}

export default Editor;