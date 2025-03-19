import { Input } from "@/components/ui/input";
import React from "react";

function FormattedValue(value) {
  if (!value) return "";
  // Convert to string if it's a number
  const stringValue = String(value);
  return stringValue.replace(/[^0-9]/g, "");
}

function InputStyleField({ label, value = "", type = "px", onHandleChange }) {
  const handleChange = (e) => {
    const newValue = e.target.value;
    onHandleChange(newValue + type);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="relative">
        <Input
          type="text"
          value={FormattedValue(value)}
          onChange={handleChange}
          className="pr-8"
        />
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500">
          {type}
        </span>
      </div>
    </div>
  );
}

export default InputStyleField;
