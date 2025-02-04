import { Input } from "@/components/ui/input";
import React from "react";

function ImagePreview({ label, value, onHandleInputChange }) {
  return (
    <div>
      <label>{label}</label>
      <img
        src={value}
        alt="image"
        className="w-full h-[150px] object-cover border rounded-xl"
      />
      <Input
        className="mt-2"
        value={value}
        onChange={(e) => onHandleInputChange(e.target.value)}
      />
    </div>
  );
}

export default ImagePreview;
