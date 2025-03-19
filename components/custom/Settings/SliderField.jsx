import React from "react";
import { Slider } from "@/components/ui/slider";

function SliderField({ label, value, type = "%", onHandleChange }) {
  const numericValue = typeof value === "string" ? parseInt(value) : value;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium">{label}</label>
        <span className="text-sm text-gray-600">{numericValue}{type}</span>
      </div>
      <Slider
        value={[numericValue]}
        min={0}
        max={100}
        step={1}
        onValueChange={([value]) => onHandleChange(value + type)}
        className="w-full"
      />
    </div>
  );
}

export default SliderField;
