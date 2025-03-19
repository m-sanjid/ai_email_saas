import React from "react";

function ColorPickerField({ label, value, onHandleChange }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <input
        type="color"
        value={value}
        onChange={(e) => onHandleChange(e.target.value)}
        className="w-full h-8 rounded cursor-pointer"
      />
    </div>
  );
}

export default ColorPickerField;
