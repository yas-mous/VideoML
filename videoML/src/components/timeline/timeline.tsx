import React from "react";
import { useProgramStore } from "../editor/stores/programStore.ts";

export const TimelineVisualization: React.FC = () => {
  const ast = useProgramStore((state) => state.ast);

  return (
    <div>
      <h2>Timeline Visualization</h2>
      <div id="visualization-root" style={{ height: "100%", backgroundColor: "#1e1e1e" , color: "#ffffff", padding: "1rem", overflow: "auto"}}>
        {ast ? <pre>{JSON.stringify(ast, null, 2)}</pre> : <p>Aucune donnée disponible.</p>}
      </div>
    </div>
  );
};
