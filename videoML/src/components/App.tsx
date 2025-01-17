import React from "react";
import { ProgramEditor } from "./editor/programEditor.tsx";
import { DragAndDrop } from "./upload/draganddrop.tsx";
import VideoPreview from "./visualisations/videoPrevisualisation.tsx";
import HelpButton from "./utils/help.tsx";
import EyamotionLogo from "./logos/eyamotionLogo.tsx";
import { TimelineVisualization } from "./timeline/timeline.tsx";
import GenerationButton from "./generation/generateButton.tsx";

import "../styles/styles.css";

const App: React.FC = () => {
  return (
    <div className="app">
      <div className="header">
        <HelpButton />
        <EyamotionLogo />
        <GenerationButton />
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
        
      </footer>
    </div>
  );
};

export default App;
