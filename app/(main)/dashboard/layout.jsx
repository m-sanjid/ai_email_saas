import Header from "@/components/custom/Header";
import React from "react";

function layout({ children }) {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
}

export default layout;
