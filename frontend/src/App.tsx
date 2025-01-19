import React from "react";
import { ProgramEditor } from "./editor/programEditor";
import { DragAndDrop } from "./upload/draganddrop";
import VideoPreview from "./visualisations/videoPrevisualisation";
import HelpButton from "./utils/help";
import EyamotionLogo from "./logos/eyamotionLogo";
import { TimelineVisualization } from "./timeline/timeline";
import GenerationButton from "./generation/generateButton";

import "./styles/styles.css";

const App: React.FC = () => {
  return (
    <div className="app">
      <div className="header" >
        <HelpButton />
        <EyamotionLogo />
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
          <GenerationButton />
        </div>
      </div>
      <footer>
        <p style={{ fontStyle: "italic" }}>Powered by</p>
        
      </footer>
    </div>
  );
};

export default App;
