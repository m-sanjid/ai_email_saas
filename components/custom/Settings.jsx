"use client";
import { useEmailTemplate, useSelectedElement } from "@/app/provider";
import React, { useEffect, useState, useCallback } from "react";
import InputField from "./Settings/InputField";
import ColorPickerField from "./Settings/ColorPickerField";
import InputStyleField from "./Settings/InputStyleField";
import SliderField from "./Settings/SliderField";
import ToggleGroupField from "./Settings/ToggleGroupField";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  CaseLower,
  CaseUpper,
  ArrowUp,
} from "lucide-react";
import DropdownField from "./Settings/DropdownField";
import ImagePreview from "./Settings/ImagePreview";

const TextAlignOptions = [
  { value: "left", icon: AlignLeft, label: "Left" },
  { value: "center", icon: AlignCenter, label: "Center" },
  { value: "right", icon: AlignRight, label: "Right" }
];

const TextTransformOptions = [
  { value: "uppercase", icon: CaseUpper, label: "Uppercase" },
  { value: "lowercase", icon: CaseLower, label: "Lowercase" },
  { value: "capitalize", icon: ArrowUp, label: "Capitalize" }
];

const JustifyContentOptions = [
  { value: "flex-start", label: "Left", icon: AlignLeft },
  { value: "center", label: "Center", icon: AlignCenter },
  { value: "flex-end", label: "Right", icon: AlignRight }
];

function Settings() {
  const { emailTemplate, setEmailTemplate } = useEmailTemplate();
  const { selectedElement, setSelectedElement } = useSelectedElement();
  const [element, setElement] = useState(null);

  useEffect(() => {
    if (!selectedElement?.layout || selectedElement?.index === undefined) {
      setElement(null);
      return;
    }
    setElement(selectedElement.layout[selectedElement.index]);
  }, [selectedElement]);

  const updateTemplate = useCallback((updatedElement) => {
    if (!selectedElement?.layout || selectedElement?.index === undefined || !emailTemplate?.design) return;

    const updatedDesign = [...emailTemplate.design];
    const layoutIndex = updatedDesign.findIndex(layout => layout === selectedElement.layout);
    
    if (layoutIndex === -1) return;

    const updatedLayout = { ...selectedElement.layout };
    updatedLayout[selectedElement.index] = updatedElement;
    updatedDesign[layoutIndex] = updatedLayout;

    // Update both contexts
    setEmailTemplate(prev => ({
      ...prev,
      design: updatedDesign
    }));
    
    setSelectedElement({
      layout: updatedLayout,
      index: selectedElement.index
    });
  }, [emailTemplate, selectedElement, setEmailTemplate, setSelectedElement]);

  const onHandleInputChange = useCallback((fieldName, value) => {
    if (!element) return;
    const updatedElement = { ...element, [fieldName]: value };
    updateTemplate(updatedElement);
  }, [element, updateTemplate]);

  const onHandleStyleChange = useCallback((fieldName, fieldValue) => {
    if (!element?.style) return;

    const value = ["width", "padding", "margin", "borderRadius"].includes(fieldName)
      ? Array.isArray(fieldValue) ? fieldValue : [fieldValue]
      : fieldValue;

    const updatedElement = {
      ...element,
      style: { ...element.style, [fieldName]: value }
    };
    updateTemplate(updatedElement);
  }, [element, updateTemplate]);

  const onHandleOuterStyleChange = useCallback((fieldName, fieldValue) => {
    if (!element?.outerStyle) return;

    const value = fieldName === "justifyContent"
      ? Array.isArray(fieldValue) ? fieldValue : [fieldValue]
      : fieldValue;

    const updatedElement = {
      ...element,
      outerStyle: { ...element.outerStyle, [fieldName]: value }
    };
    updateTemplate(updatedElement);
  }, [element, updateTemplate]);

  if (!element) {
    return (
      <div className="p-5">
        <h2 className="font-bold text-xl">Settings</h2>
        <p className="text-sm text-gray-500 mt-2">Select an element to edit its properties</p>
      </div>
    );
  }

  return (
    <div className="p-5 space-y-4 overflow-auto max-h-[calc(100vh-60px)]">
      <h2 className="font-bold text-xl sticky top-0 bg-white pb-2 border-b">Settings</h2>
      
      {/* Basic Properties */}
      <div className="space-y-4">
        {element?.imageUrl !== undefined && (
          <ImagePreview
            label="Image"
            value={element.imageUrl}
            onHandleChange={(value) => onHandleInputChange("imageUrl", value)}
          />
        )}
        {element?.content !== undefined && (
          <InputField
            label="Content"
            value={element.content || ""}
            onHandleChange={(value) => onHandleInputChange("content", value)}
          />
        )}
        {element?.url !== undefined && (
          <InputField
            label="URL"
            value={element.url || ""}
            onHandleChange={(value) => onHandleInputChange("url", value)}
          />
        )}
      </div>

      {/* Style Properties */}
      <div className="space-y-4">
        <h3 className="font-semibold text-sm text-gray-500">Style</h3>
        
        {element?.style?.width !== undefined && (
          <SliderField
            label="Width"
            value={Array.isArray(element.style.width) ? element.style.width[0] : element.style.width}
            type="%"
            onHandleChange={(value) => onHandleStyleChange("width", value)}
          />
        )}
        
        {element?.style?.textAlign !== undefined && (
          <ToggleGroupField
            label="Text Align"
            value={element.style.textAlign}
            options={TextAlignOptions}
            onHandleChange={(value) => onHandleStyleChange("textAlign", value)}
          />
        )}

        {element?.style?.backgroundColor !== undefined && (
          <ColorPickerField
            label="Background Color"
            value={element.style.backgroundColor}
            onHandleChange={(value) => onHandleStyleChange("backgroundColor", value)}
          />
        )}

        {element?.style?.color !== undefined && (
          <ColorPickerField
            label="Text Color"
            value={element.style.color}
            onHandleChange={(value) => onHandleStyleChange("color", value)}
          />
        )}

        {element?.style?.fontSize !== undefined && (
          <InputStyleField
            label="Font Size"
            value={element.style.fontSize}
            onHandleChange={(value) => onHandleStyleChange("fontSize", value)}
          />
        )}

        {element?.style?.lineHeight !== undefined && (
          <InputStyleField
            label="Line Height"
            value={element.style.lineHeight}
            onHandleChange={(value) => onHandleStyleChange("lineHeight", value)}
          />
        )}

        {/* Always show font weight for text elements */}
        {(element?.type === "Text" || element?.style?.fontWeight !== undefined) && (
          <DropdownField
            label="Font Weight"
            value={element.style.fontWeight || "400"}
            options={[
              { value: "100", label: "Thin" },
              { value: "200", label: "Extra Light" },
              { value: "300", label: "Light" },
              { value: "400", label: "Regular" },
              { value: "500", label: "Medium" },
              { value: "600", label: "Semi Bold" },
              { value: "700", label: "Bold" },
              { value: "800", label: "Extra Bold" },
              { value: "900", label: "Black" }
            ]}
            onHandleChange={(value) => onHandleStyleChange("fontWeight", value)}
          />
        )}

        {element?.style?.textTransform !== undefined && (
          <ToggleGroupField
            label="Text Transform"
            value={element.style.textTransform}
            options={TextTransformOptions}
            onHandleChange={(value) => onHandleStyleChange("textTransform", value)}
          />
        )}

        {element?.style?.padding !== undefined && (
          <InputStyleField
            label="Padding"
            value={Array.isArray(element.style.padding) ? element.style.padding[0] : element.style.padding}
            onHandleChange={(value) => onHandleStyleChange("padding", value)}
          />
        )}

        {element?.style?.margin !== undefined && (
          <InputStyleField
            label="Margin"
            value={Array.isArray(element.style.margin) ? element.style.margin[0] : element.style.margin}
            onHandleChange={(value) => onHandleStyleChange("margin", value)}
          />
        )}

        {element?.style?.borderRadius !== undefined && (
          <SliderField
            label="Border Radius"
            value={Array.isArray(element.style.borderRadius) ? element.style.borderRadius[0] : element.style.borderRadius}
            onHandleChange={(value) => onHandleStyleChange("borderRadius", value)}
          />
        )}
      </div>

      {/* Outer Style Properties */}
      <div className="space-y-4">
        <h3 className="font-semibold text-sm text-gray-500">Container Style</h3>
        
        {element?.outerStyle?.backgroundColor !== undefined && (
          <ColorPickerField
            label="Container Background"
            value={element.outerStyle.backgroundColor}
            onHandleChange={(value) => onHandleOuterStyleChange("backgroundColor", value)}
          />
        )}

        {element?.outerStyle?.justifyContent !== undefined && (
          <ToggleGroupField
            label="Alignment"
            value={Array.isArray(element.outerStyle.justifyContent) 
              ? element.outerStyle.justifyContent[0] 
              : element.outerStyle.justifyContent}
            options={JustifyContentOptions}
            onHandleChange={(value) => onHandleOuterStyleChange("justifyContent", value)}
          />
        )}

        {element?.outerStyle?.padding !== undefined && (
          <InputStyleField
            label="Container Padding"
            value={Array.isArray(element.outerStyle.padding) 
              ? element.outerStyle.padding[0] 
              : element.outerStyle.padding}
            onHandleChange={(value) => onHandleOuterStyleChange("padding", value)}
          />
        )}
      </div>
    </div>
  );
}

export default Settings;
