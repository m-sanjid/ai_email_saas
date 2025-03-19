import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

function DropdownField({ label, value, options, onHandleChange }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <Select
        onValueChange={(v) => onHandleChange(v)}
        defaultValue={value || options[0]?.value}
        value={value}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={options.find(opt => opt.value === value)?.label || "Select"} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option, index) => (
            <SelectItem key={index} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default DropdownField;
