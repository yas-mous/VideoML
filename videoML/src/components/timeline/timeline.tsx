import React from "react";
import { useMappedTimeline } from "../editor/hooks/useMappedTimeline.tsx";
import { AST } from "../../cli/models/models.ts";
import { LayerUI } from "./layers/layer.tsx";



export const TimelineVisualization: React.FC = () => {



const mappedAst :AST = useMappedTimeline() as AST;
console.log("layers",mappedAst.layers);

//const ast = useProgramStore((state) => state.ast);

  if (!mappedAst || !mappedAst.layers || !Array.isArray(mappedAst.layers)) {
    //timeline vide
    return (
      <div>x
        <h2>Timeline Visualization</h2>
        <p style={{ color: "#fff" }}>Aucune donnée disponible.</p>
      </div>
    );
  }
  //sinon
  return (
    <div style={{ padding: "1rem", backgroundColor: "#1e1e1e", color: "#fff" }}>
      <h2>Timeline: {mappedAst.name || "Unnamed"} Visualization</h2>
      <div
        style={{
          maxHeight: "300px",
          overflowY: "auto",
          border: "1px solid #444",
          borderRadius: "8px",
          padding: "0.5rem",
          scrollbarWidth: "thin", //  Firefox
          scrollbarColor: "#1e4c85 #1e1e1e", //  Firefox
        }}
      >
        {/* Pour Chrome, Safari, Edge */}
        <style>
          {`
            ::-webkit-scrollbar {
              width: 8px;
            }
            ::-webkit-scrollbar-track {
              background-color: #333;
              border-radius: 8px;
            }
            ::-webkit-scrollbar-thumb {
              background-color: #1e4c85; /* Couleur bleu clair pour la poignée */
              border-radius: 8px;
            }
            ::-webkit-scrollbar-thumb:hover {
              background-color:rgb(74, 114, 140); /* Couleur bleu encore plus claire au survol */
            }
          `}
        </style>
        {mappedAst.layers.map((layer: any, index: number) => (
          <LayerUI key={index} layer={layer} />
        ))}
      </div>
    </div>
  );
};
