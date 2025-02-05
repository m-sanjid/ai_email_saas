"use client";
import { useSelectedElement } from "@/app/provider";
import React, { useEffect, useState } from "react";
import InputField from "./Settings/InputField";
import ColorPickerField from "./Settings/ColorPickerField";
import InputStyleField from "./Settings/InputStyleField";
import SliderField from "./Settings/SliderField";
import TextAreaField from "./Settings/TextAreaField";
import ToggleGroupField from "./Settings/ToggleGroupField";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  CaseLower,
  CaseUpper,
  AArrowUp,
} from "lucide-react";
import DropdownField from "./Settings/DropdownField";
import ImagePreview from "./Settings/ImagePreview";

const TextAlignOptions = [
  { value: "left", icon: AlignLeft },
  { value: "center", icon: AlignCenter },
  { value: "right", icon: AlignRight },
];

const TextTransformOptions = [
  { value: "uppercase", icon: CaseUpper },
  { value: "lowercase", icon: CaseLower },
  {
    value: "capitalize",
    icon: AArrowUp,
  },
];

function Settings() {
  const { selectedElement, setSelectedElement } = useSelectedElement();
  const [element, setElement] = useState();

  useEffect(() => {
    console.log(selectedElement?.layout[selectedElement?.index]);
    setElement(selectedElement?.layout[selectedElement?.index]);
  }, [selectedElement]);

  const onHandleInputChange = (fieldName, value) => {
    console.log(fieldName, "value" + value);
    //Copy of current selected element
    const updatedData = { ...selectedElement };
    //Update the field
    updatedData.layout[selectedElement.index][fieldName] = value;
    //Update original selected element
    setSelectedElement(updatedData);
  };

  const onHandleStyleChange = (fieldName, fieldValue) => {
    let updateElement = {
      ...selectedElement,
      layout: {
        ...selectedElement?.layout,
        [selectedElement?.index]: {
          ...selectedElement?.layout[selectedElement?.index],
          style: {
            ...selectedElement?.layout[selectedElement?.index]?.style,
            [fieldName]: fieldValue,
          },
        },
      },
    };
    setSelectedElement(updateElement);
  };

  const onHandleOuterStyleChange = (fieldName, fieldValue) => {
    let updateElement = {
      ...selectedElement,
      layout: {
        ...selectedElement?.layout,
        [selectedElement?.index]: {
          ...selectedElement?.layout[selectedElement?.index],
          outerStyle: {
            ...selectedElement?.layout[selectedElement?.index]?.outerStyle,
            [fieldName]: fieldValue,
          },
        },
      },
    };
    setSelectedElement(updateElement);
  };

  return (
    <div className="p-5">
      <h2 className="font-bold text-xl">Settings</h2>
      {element?.imageUrl && (
        <ImagePreview
          label={"Image Preview"}
          value={element?.imageUrl}
          onHandleInputChange={(value) =>
            onHandleInputChange("imageUrl", value)
          }
        />
      )}
      {element?.content && (
        <InputField
          label={"Content"}
          value={element?.content}
          onHandleInputChange={(value) => onHandleInputChange("content", value)}
        />
      )}
      {element?.textarea && (
        <TextAreaField
          label={"Text Area"}
          value={element?.textarea || ""}
          onHandleInputChange={(value) =>
            onHandleInputChange("textarea", value)
          }
        />
      )}
      {element?.url && (
        <InputField
          label={"url"}
          value={element?.url}
          onHandleInputChange={(value) => onHandleInputChange("url", value)}
        />
      )}
      {element?.style?.width && (
        <SliderField
          label={"Width"}
          value={element?.style?.width}
          type="%"
          onHandleStyleChange={(value) => onHandleStyleChange("width", value)}
        />
      )}
      {element?.style?.textAlign && (
        <ToggleGroupField
          label={"Text Align"}
          value={element?.style.textAlign}
          options={TextAlignOptions}
          onHandleStyleChange={(value) =>
            onHandleStyleChange("textAlign", value)
          }
        />
      )}
      {element?.style?.backgroundColor && (
        <ColorPickerField
          label="Background Color"
          value={element?.style?.backgroundColor}
          onHandleStyleChange={(value) =>
            onHandleStyleChange("backgroundColor", value)
          }
        />
      )}
      {element?.style?.color && (
        <ColorPickerField
          label="Text Color"
          value={element?.style.color}
          onHandleStyleChange={(value) => onHandleStyleChange("color", value)}
        />
      )}
      {element?.style?.fontSize && (
        <InputStyleField
          label={"Font Size"}
          value={element?.style?.fontSize}
          onHandleStyleChange={(value) =>
            onHandleStyleChange("fontSize", value)
          }
        />
      )}
      {element?.style?.textTransform && (
        <ToggleGroupField
          label={"Text Transform"}
          value={element?.style.textTransform}
          options={TextTransformOptions}
          onHandleStyleChange={(value) =>
            onHandleStyleChange("textTransform", value)
          }
        />
      )}

      {element?.style?.padding && (
        <InputStyleField
          label={"Padding"}
          value={element?.style?.padding}
          onHandleStyleChange={(value) => onHandleStyleChange("padding", value)}
        />
      )}

      {element?.style?.margin && (
        <InputStyleField
          label={"Margin"}
          value={element?.style?.margin}
          onHandleStyleChange={(value) => onHandleStyleChange("margin", value)}
        />
      )}

      {element?.style?.borderRadius && (
        <SliderField
          label={"Border Radius"}
          value={element?.style?.borderRadius}
          onHandleStyleChange={(value) =>
            onHandleStyleChange("borderRadius", value)
          }
        />
      )}

      {element?.style?.fontWeight && (
        <DropdownField
          label={"Font Weight"}
          value={element?.style?.fontWeight}
          options={["normal", "bold"]}
          onHandleStyleChange={(value) =>
            onHandleStyleChange("fontWeight", value)
          }
        />
      )}
      <div>
        <h2 className="font-bold mb-2">Outer Style</h2>
        {element?.outerStyle?.backgroundColor && (
          <ColorPickerField
            label="Background Color"
            value={element?.outerStyle?.backgroundColor}
            onHandleStyleChange={(value) =>
              onHandleOuterStyleChange("backgroundColor", value)
            }
          />
        )}
        {element?.outerStyle?.justifyContent && (
          <ToggleGroupField
            label={"Align"}
            value={element?.outerStyle?.justifyContent}
            options={TextAlignOptions}
            onHandleStyleChange={(value) =>
              onHandleOuterStyleChange("justifyContent", value)
            }
          />
        )}
      </div>
    </div>
  );
}

export default Settings;
