import React from "react";

function ImageComponent({ outerStyle, style, imageUrl }) {
  return (
    <div style={outerStyle}>
      <img src={imageUrl} alt="image" style={style} />
    </div>
  );
}

export default ImageComponent;
