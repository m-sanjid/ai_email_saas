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
import DividerComponent from "../Element/DividerComponent";

function ColumnLayout({ layout }) {
  const [dragOver, setDragOver] = useState();
  const { emailTemplate, setEmailTemplate } = useEmailTemplate();
  const { dragElementLayout, setDragElementLayout } = useDragElementLayout();
  const { selectedElement, setSelectedElement } = useSelectedElement();

  const onDragOverHandle = (event, index) => {
    event.preventDefault();
    setDragOver({
      index: index,
      columnId: layout?.id,
    });
  };

  const onDropHandle = () => {
    const index = dragOver.index;
    setEmailTemplate((prevItem) =>
      prevItem?.map((col) =>
        col.id === layout?.id
          ? { ...col, [index]: dragElementLayout?.dragElement }
          : col,
      ),
    );
    console.log(emailTemplate);
    setDragOver(null);
  };

  const GetElementComponent = (element) => {
    if (element?.type === "Button") {
      return <ButtonComponent {...element} />;
    } else if (element?.type === "Text") {
      return <TextComponent {...element} />;
    } else if (element?.type === "Image") {
      return <ImageComponent {...element} />;
    } else if (element?.type === "Logo") {
      return <LogoComponent {...element} />;
    } else if (element?.type === "Divider") {
      return <DividerComponent {...element} />;
    }
    return element?.type;
  };

  const deleteLayout = (layoutId) => {
    const updateEmailTemplate = emailTemplate?.filter(
      (item) => item.id !== layoutId,
    );
    setEmailTemplate(updateEmailTemplate);
    setSelectedElement(null);
  };

  const moveItemUp = (layoutId) => {
    const index = emailTemplate.findIndex((item) => item.id === layoutId);
    if (index > 0) {
      setEmailTemplate((prevItems) => {
        const updatedItems = [...prevItems]; // Create a copy
        [updatedItems[index], updatedItems[index - 1]] = [
          updatedItems[index - 1],
          updatedItems[index],
        ];
        return updatedItems;
      });
    }
  };

  const moveItemDown = (layoutId) => {
    const index = emailTemplate.findIndex((item) => item.id === layoutId);
    if (index < emailTemplate.length - 1) {
      setEmailTemplate((prevItems) => {
        const updatedItems = [...prevItems]; // Create a copy
        [updatedItems[index], updatedItems[index + 1]] = [
          updatedItems[index + 1],
          updatedItems[index],
        ];
        return updatedItems;
      });
    }
  };

  return (
    <div className="relative">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${layout?.numOfCol},1fr)`,
          gap: "0px",
        }}
        className={`${selectedElement?.layout?.id == layout?.id && "border border-dashed border-blue-500"}`}
      >
        {Array.from({ length: layout?.numOfCol }).map((_, index) => (
          <div
            key={index}
            className={`flex items-center justify-center bg-white h-full w-full cursor-pointer
border-blue-500
${!layout?.[index]?.type ? "bg-gray-100 border border-dashed" : ""}
  ${index == dragOver?.index && dragOver?.columnId && "bg-green-200"}
${selectedElement?.layout?.id == layout?.id && selectedElement?.index == index && "border-blue-500 border-2"}
`}
            onDragOver={(event) => onDragOverHandle(event, index)}
            onDrop={onDropHandle}
            onClick={() => setSelectedElement({ layout: layout, index: index })}
          >
            {GetElementComponent(layout?.[index]) ?? "Drag Element Here"}
          </div>
        ))}
        {selectedElement?.layout?.id == layout.id && (
          <div className="absolute -right-10 flex flex-col gap-2">
            <div
              className="bg-gray-100 cursor-pointer hover:scale-105 transition-all hover:shadow-md p-2 rounded-full"
              onClick={() => deleteLayout(layout?.id)}
            >
              <Trash className="h-4 w-4 text-red-500" />
            </div>
            <div
              className="bg-gray-100 cursor-pointer hover:scale-105 transition-all hover:shadow-md p-2 rounded-full"
              onClick={() => moveItemUp(layout?.id)}
            >
              <ArrowUp className="h-4 w-4" />
            </div>{" "}
            <div
              className="bg-gray-100 cursor-pointer hover:scale-105 transition-all hover:shadow-md p-2 rounded-full"
              onClick={() => moveItemDown(layout?.id)}
            >
              <ArrowDown className="h-4 w-4" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ColumnLayout;
