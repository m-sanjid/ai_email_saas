"use client";
import {
  useDragElementLayout,
  useEmailTemplate,
  useSelectedElement,
} from "@/app/provider";
import React, { useState } from "react";
import ButtonComponent from "../Element/ButtonComponent";
import TextComponent from "../Element/TextComponent";
import ImageComponent from "../Element/ImageComponent";
import LogoComponent from "../Element/LogoComponent";
import { ArrowDown, ArrowUp, Trash } from "lucide-react";
import { toast } from "sonner";

function ColumnLayout({ layout }) {
  const [dragOver, setDragOver] = useState(null);
  const { emailTemplate, setEmailTemplate } = useEmailTemplate();
  const { dragElementLayout, setDragElementLayout } = useDragElementLayout();
  const { selectedElement, setSelectedElement } = useSelectedElement();

  const onDragOverHandle = (event, columnIndex) => {
    event.preventDefault();
    event.stopPropagation();
    setDragOver(columnIndex);
  };

  const createElementStyles = (type) => {
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
            fontWeight: "400"
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

  const onDropHandle = (columnIndex) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (!dragElementLayout?.dragElement) return;
    
    const elementType = dragElementLayout.dragElement.type;
    const styles = createElementStyles(elementType);

    const newComponent = {
      ...dragElementLayout.dragElement,
      label: `${elementType} Element`,
      content: dragElementLayout.dragElement.content || "",
      ...styles,
      ...(elementType === "LogoHeader" && { imageUrl: "/logo.svg" }),
      ...(elementType === "Image" && { imageUrl: "/image.png" })
    };

    setEmailTemplate(prev => {
      const updatedTemplate = { ...prev };
      if (!updatedTemplate.design) {
        updatedTemplate.design = [];
      }

      const layoutIndex = updatedTemplate.design.findIndex(item => item === layout);
      if (layoutIndex !== -1) {
        updatedTemplate.design[layoutIndex] = {
          ...layout,
          [columnIndex]: newComponent
        };
      }

      return updatedTemplate;
    });

    setDragOver(null);
    setDragElementLayout(null); 
  };

  const GetElementComponent = (element) => {
    if (!element?.type) return null;

    const normalizeStyle = (style) => {
      if (!style) return {};
      
      const normalized = { ...style };
      ['padding', 'margin', 'width', 'borderRadius'].forEach(prop => {
        if (Array.isArray(normalized[prop])) {
          normalized[prop] = normalized[prop][0];
        }
      });
      return normalized;
    };

    const normalizeOuterStyle = (style) => {
      if (!style) return {};
      
      const normalized = { ...style };
      ['justifyContent', 'padding'].forEach(prop => {
        if (Array.isArray(normalized[prop])) {
          normalized[prop] = normalized[prop][0];
        }
      });
      return normalized;
    };

    const props = {
      ...element,
      style: normalizeStyle(element.style),
      outerStyle: normalizeOuterStyle(element.outerStyle)
    };

    switch (element.type) {
      case "Button":
        return <ButtonComponent {...props} />;
      case "Text":
        return <TextComponent {...props} />;
      case "Image":
        return <ImageComponent {...props} />;
      case "LogoHeader":
        return <LogoComponent {...props} />;
      default:
        return null;
    }
  };

  const deleteLayout = () => {
    setEmailTemplate(prev => {
      const updatedTemplate = { ...prev };
      updatedTemplate.design = updatedTemplate.design.filter(item => item !== layout);
      return updatedTemplate;
    });
    setSelectedElement(null);
    toast.success("Section removed");
  };

  const moveLayout = (direction) => {
    setEmailTemplate(prev => {
      const updatedTemplate = { ...prev };
      const currentIndex = updatedTemplate.design.findIndex(item => item === layout);
      
      if (direction === 'up' && currentIndex > 0) {
        [updatedTemplate.design[currentIndex], updatedTemplate.design[currentIndex - 1]] = 
        [updatedTemplate.design[currentIndex - 1], updatedTemplate.design[currentIndex]];
      } else if (direction === 'down' && currentIndex < updatedTemplate.design.length - 1) {
        [updatedTemplate.design[currentIndex], updatedTemplate.design[currentIndex + 1]] = 
        [updatedTemplate.design[currentIndex + 1], updatedTemplate.design[currentIndex]];
      }

      return updatedTemplate;
    });
  };

  return (
    <div className="relative group">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${layout?.numOfCol || 1}, 1fr)`,
          gap: "16px",
          padding: "8px"
        }}
        className={`relative transition-all ${
          selectedElement?.layout === layout ? 
          "border-2 border-blue-500 rounded-lg" : 
          "border border-transparent hover:border-gray-200 rounded-lg"
        }`}
      >
        {Array.from({ length: layout?.numOfCol || 1 }).map((_, index) => (
          <div
            key={index}
            className={`
              min-h-[100px] rounded-lg transition-all duration-200
              ${!layout?.[index]?.type ? 
                "bg-gray-50 border-2 border-dashed border-gray-200" : 
                "bg-white"
              }
              ${dragOver === index ? 
                "border-2 border-dashed border-blue-400 bg-blue-50 scale-[1.02]" : 
                ""
              }
              ${selectedElement?.layout === layout && selectedElement?.index === index ? 
                "ring-2 ring-blue-500" : 
                ""
              }
            `}
            onDragOver={(e) => onDragOverHandle(e, index)}
            onDrop={() => onDropHandle(index)}
            onDragLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragOver(null);
            }}
            onClick={() => setSelectedElement({ layout, index })}
          >
            {GetElementComponent(layout?.[index]) || (
              <div className="h-full flex items-center justify-center text-sm text-gray-400">
                Drop element here
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedElement?.layout === layout && (
        <div className="absolute -right-12 top-1/2 transform -translate-y-1/2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => moveLayout('up')}
            className="p-1.5 rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
            title="Move up"
          >
            <ArrowUp className="h-4 w-4 text-gray-600" />
          </button>
          <button
            onClick={() => moveLayout('down')}
            className="p-1.5 rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
            title="Move down"
          >
            <ArrowDown className="h-4 w-4 text-gray-600" />
          </button>
          <button
            onClick={deleteLayout}
            className="p-1.5 rounded-full bg-white border border-gray-200 hover:bg-red-50 hover:border-red-200 transition-colors"
            title="Delete section"
          >
            <Trash className="h-4 w-4 text-red-500" />
          </button>
        </div>
      )}
    </div>
  );
}

export default ColumnLayout;
