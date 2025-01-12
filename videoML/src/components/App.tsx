import React from "react";
import { ProgramEditor } from "./editor/programEditor.tsx";

const App: React.FC = () => {
  return (
    <div style={{ width: "100%", height: "100vh", margin: 0 }}>
        <ProgramEditor />
    </div>
  )
}

export default App;