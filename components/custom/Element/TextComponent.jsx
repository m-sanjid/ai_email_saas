import React from "react";

function TextComponent({ style, content, outerStyle }) {
  // Ensure font weight is properly applied
  const textStyle = {
    ...style,
    fontWeight: style.fontWeight || "400",
  };

  return (
    <div style={outerStyle} className="w-full">
      <p style={textStyle}>{content || ""}</p>
    </div>
  );
}

export default TextComponent;
