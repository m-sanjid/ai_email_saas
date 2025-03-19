import { Input } from "@/components/ui/input";
import React from "react";

function InputField({ label, value, onHandleChange }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <Input
        value={value}
        onChange={(event) => onHandleChange(event.target.value)}
        className="w-full"
      />
    </div>
  );
}

export default InputField;
