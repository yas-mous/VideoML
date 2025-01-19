import React from "react";
import { FaBoltLightning } from "react-icons/fa6";

export const TransitionUI: React.FC = () => {
  return (
      <div
        style={{
          width: "20px",
          height: "20px",
          backgroundColor: "white",
          zIndex:1,
          marginLeft: "-4px",
          color:"black",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >    
      <FaBoltLightning />
      </div>
    );
};
  