import React from "react";
import { useProgramStore } from "../editor/stores/programStore.ts";
import {LayerUI} from "./layers/layer.tsx";

export const TimelineVisualization: React.FC = () => {
  const ast = useProgramStore((state) => state.ast);

  if (!ast || !ast.layers || !Array.isArray(ast.layers)) {
    return (
      <div>
        <h2>Timeline Visualization</h2>
        <p style={{ color: "#fff" }}>Aucune donnée disponible.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "1rem", backgroundColor: "#1e1e1e", color: "#fff" }}>
      <h2>Timeline: {ast.name || "Unnamed"} Visualization</h2>
      {ast.layers.map((layer: any, index: number) => (
        <LayerUI key={index} layer={layer} />
      ))}
    </div>
  );
};