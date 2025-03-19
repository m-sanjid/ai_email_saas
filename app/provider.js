"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";

// Create contexts directly in this file since you're defining providers here
export const ScreenSizeContext = createContext();
export const DragDropLayoutElement = createContext();
export const EmailTemplateContext = createContext();
export const SelectedElementContext = createContext();

function Provider({ children, session }) {
  const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);
  const [screenSize, setScreenSize] = useState("desktop");
  const [dragElementLayout, setDragElementLayout] = useState();
  const [emailTemplate, setEmailTemplate] = useState({
    design: [],
    description: "",
    tid: null,
  });
  const [selectedElement, setSelectedElement] = useState();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const emailTemplateStorage = JSON.parse(
        localStorage.getItem("emailTemplate") || "{}",
      );
      if (emailTemplateStorage) {
        // Ensure design is always an array
        setEmailTemplate({
          ...emailTemplateStorage,
          design: Array.isArray(emailTemplateStorage.design)
            ? emailTemplateStorage.design
            : [],
        });
      }
    }
  }, [pathname]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("emailTemplate", JSON.stringify(emailTemplate));
    }
  }, [emailTemplate]);

  useEffect(() => {
    if (selectedElement && emailTemplate.design) {
      const updatedDesign = Array.isArray(emailTemplate.design)
        ? [...emailTemplate.design]
        : [];
      const selectedIndex = updatedDesign.findIndex(
        (item) => item === selectedElement.layout,
      );
      if (selectedIndex !== -1) {
        updatedDesign[selectedIndex] = selectedElement.layout;
        setEmailTemplate((prev) => ({
          ...prev,
          design: updatedDesign,
        }));
      }
    }
  }, [selectedElement]);

  return (
    <SessionProvider session={session}>
      <ConvexProvider client={convex}>
        <ScreenSizeContext.Provider value={{ screenSize, setScreenSize }}>
          <DragDropLayoutElement.Provider
            value={{ dragElementLayout, setDragElementLayout }}
          >
            <EmailTemplateContext.Provider
              value={{ emailTemplate, setEmailTemplate }}
            >
              <SelectedElementContext.Provider
                value={{ selectedElement, setSelectedElement }}
              >
                <div>{children}</div>
              </SelectedElementContext.Provider>
            </EmailTemplateContext.Provider>
          </DragDropLayoutElement.Provider>
        </ScreenSizeContext.Provider>
      </ConvexProvider>
    </SessionProvider>
  );
}

export default Provider;

// Hook exports for easy context access
export const useScreenSize = () => useContext(ScreenSizeContext);
export const useDragElementLayout = () => useContext(DragDropLayoutElement);
export const useEmailTemplate = () => useContext(EmailTemplateContext);
export const useSelectedElement = () => useContext(SelectedElementContext);
