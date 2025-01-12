import React from "react";
import { ProgramEditor } from "./editor/programEditor.tsx";
import { TimelineVisualization } from "./timeline/timeline.tsx";
import { DragAndDrop } from "./download/draganddrop.tsx";
import VideoPreview from "./visualisations/videoPrevisualisation.tsx";
import HelpButton from "./utils/help.tsx";

import "../styles/styles.css";

const App: React.FC = () => {
  return (
    <div className="app">
      <div className="header">
        <HelpButton />
        <h1>EYAMOTION</h1>
      </div>
      <div className="grid-container">
        <div className="editor">
          <ProgramEditor />
        </div>
        <div className="drag-drop-download">
          
          <div className="download">
            <DragAndDrop />
          </div>
        </div>
        <div className="video-preview">
          <VideoPreview />
        </div>
        <div className="visualization">
          <TimelineVisualization />
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
};

export default App;
