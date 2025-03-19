import React from "react";
import { Plus } from "lucide-react"; 

function ElementLayoutCard({ layout }) {
  const IconComponent = typeof layout.icon === 'function' ? layout.icon : Plus;
  
  return (
    <div className="flex flex-col border-dashed border p-3 rounded-xl items-center justify-center group hover:shadow-md hover:border-primary cursor-pointer">
      <div className="p-2 h-9 w-9 bg-gray-200 group-hover:text-primary group-hover:bg-purple-100 rounded-full flex items-center justify-center">
        <IconComponent className="h-5 w-5" />
      </div>
      <h2 className="text-sm group-hover:text-primary">{layout.label}</h2>
    </div>
  );
}

export default ElementLayoutCard;