import React from "react";
//import { useProgramStore } from "../../editor/stores/programStore.ts";
import { ClipUI } from "../clips/clip.tsx";

export const LayerUI: React.FC<{ layer: any }> = ({ layer }) => {
    return (
      <div style={{ marginBottom: "1rem" }}>
        <h3>{layer.layerName}</h3>
        <div
          style={{
            position: "relative",
            backgroundColor: "#333",
            borderRadius: "8px",
            overflow: "hidden",
            display: "flex",
            alignItems:"center",
            padding:"5px"
          }}
        >
          {layer.elements.map((element: any, idx: number) => {
            const clipName = element.clipName || `Clip ${idx + 1}`;
            const width = 100; 
            return <ClipUI key={idx} clipName={clipName} width={width} />;
          })}
        </div>
      </div>
    );
  };