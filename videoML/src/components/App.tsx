import React from "react";
import { ProgramEditor } from "./editor/programEditor.tsx";
import { TimelineVisualization } from "./timeline/timeline.tsx";
import { Download } from "./download/download.tsx";
import "../styles/styles.css";
const App: React.FC = () => {
    return (
        <div className="app">
          <h1>EYAMOTION</h1>
          <div className="grid-container">
            <div className="editor">
              <ProgramEditor />
            </div>
            <div className="visualization">
              <TimelineVisualization />
            </div>
            <div className="download">
              <Download />
            </div>
          </div>
          <footer>
            <p style={{ fontStyle: "italic" }}>Powered by</p>
            <img
              width="125"
              src="https://langium.org/assets/langium_logo_w_nib.svg"
              alt="Langium"
            />
          </footer>
        </div>
      );
    }

export default App;