import React from "react";
import { LayerElement } from "../../../cli/models/models.ts";

export const ClipUI: React.FC<{ clip: LayerElement; width: number }> = ({ clip, width }) => {
  const color:string =clip.$type === "AudioClip" ? "#ffbb33" : "#6699ff";
  return (
      <div
        style={{
          width: `${width}px`,
          height: "40px",
          backgroundColor: color,
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius:"6px",
          marginLeft:"-6px",
        
        }}
      >
        {clip.clipName}
      </div>
    );
};
  