import React from "react";

export const ClipUI: React.FC<{ clipName: string; width: number }> = ({ clipName, width }) => {
    return (
      <div
        style={{
          width: `${width}px`,
          height: "100%",
          backgroundColor: "#4caf50",
          color: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid #fff",
          marginRight: "2px",
        }}
      >
        {clipName}
      </div>
    );
};
  