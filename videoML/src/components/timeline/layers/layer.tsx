import React from "react";
//import { useProgramStore } from "../../editor/stores/programStore.ts";
import { ClipUI } from "../clips/clip.tsx";
import { Layer } from "../../../cli/models/models.ts";
import { TransitionUI } from "../transition/transition.tsx";

export const LayerUI: React.FC<{ layer: Layer }> = ({ layer }) => {
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
            const width = 100; 
            return (
            <div key={idx} style={{display:"flex", alignItems:"center"}}>
              <ClipUI key={idx}  clip={element} width={width} />
              {idx < layer.elements.length - 1 && <TransitionUI />}
             </div>

            );

          })}
        </div>
      </div>
    );
  };