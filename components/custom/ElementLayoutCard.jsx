import React from "react";

function ElementLayoutCard({ layout }) {
  return (
    <div className="flex flex-col border-dashed border p-3 rounded-xl items-center justify-center group hover:shadow-md hover:border-primary cursor-pointer">
      {
        <layout.icon className="p-2 h-9 w-9 bg-gray-200 group-hover:textprimary group-hover:bg-purple-100 rounded-full" />
      }
      <h2 className="text-sm group-hover:text-primary">{layout.label}</h2>
    </div>
  );
}

export default ElementLayoutCard;
