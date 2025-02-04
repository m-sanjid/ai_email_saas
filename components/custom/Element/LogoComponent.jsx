import React from "react";

function LogoComponent({ style, imageUrl, outerStyle }) {
  return (
    <div style={outerStyle}>
      <img src={imageUrl} style={style} />
    </div>
  );
}

export default LogoComponent;
