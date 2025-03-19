import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import React from "react";

function ToggleGroupField({ label, value, options, onHandleChange }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={(v) => {
          if (v) onHandleChange(v);
        }}
        className="flex gap-1"
      >
        {options.map((option, index) => (
          <ToggleGroupItem 
            key={index} 
            value={option.value} 
            className="flex-1 data-[state=on]:bg-blue-500 data-[state=on]:text-white"
          >
            {option.icon ? 
              React.createElement(option.icon, { className: "w-4 h-4 mx-auto" }) : 
              <span className="text-sm">{option.label}</span>
            }
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}

export default ToggleGroupField;
