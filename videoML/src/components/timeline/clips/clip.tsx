import React from "react";

export const ClipUI: React.FC<{ clipName: string; width: number }> = ({ clipName, width }) => {
    return (
      <div
        style={{
          width: `${width}px`,
          height: "30px",
          backgroundColor: "#4caf50",
          color: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginRight: "2px",
          borderRadius:"6px",
        
        }}
      >
        {clipName}
      </div>
    );
};
  