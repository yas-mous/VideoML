import React from "react";
//import { useProgramStore } from "../../editor/stores/programStore.ts";
import { ClipUI } from "../clips/clip";
import { Layer } from "videoML/src/cli/models/models.js";
import { TransitionUI } from "../transition/transition";
import { MdMusicVideo } from "react-icons/md";
import { FaVideo } from "react-icons/fa";

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
            padding:"5px",
          }}
        > 
        {layer.elements[0]?.$type === "AudioClip" && (<span style={{marginRight:"20px"}}><MdMusicVideo /></span> )}
        {layer.elements[0]?.$type !== "AudioClip" && (<span style={{marginRight:"20px"}}> <FaVideo /> </span>)        }
        {layer.elements.map((element: any, idx: number) => {
            return (
            <div key={idx} style={{display:"flex", alignItems:"center"}}>
              <ClipUI key={idx}  clip={element}  />
              {idx < layer.elements.length - 1 && <TransitionUI />}
             </div>
            );

          })}
        </div>
      </div>
    );
  };       
  