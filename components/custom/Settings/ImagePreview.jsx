import Image from "next/image";
import React from "react";

function ImagePreview({ label, value, onHandleChange }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="relative aspect-video rounded-lg overflow-hidden border">
        <Image
          src={value}
          alt={label}
          fill
          className="object-contain"
        />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onHandleChange(e.target.value)}
        className="w-full px-3 py-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

export default ImagePreview;
