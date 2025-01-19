import React, { useState } from "react";
import { useProgramStore } from "../editor/stores/programStore.js";
import { useVideoStore } from "../upload/stores/videoStore.js";
import { useAudioStore } from "../upload/stores/audioStore.js";

import "../styles/button.css";

const GenerationButton: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const storePythonCode = useProgramStore((state) => state.pythonCode);
  const audioFiles = useAudioStore((state) => state.audioFiles);
  const videoFiles = useVideoStore((state) => state.videoFiles);

  const handleClick = async () => {
    setLoading(true);

    try {
      const formData = new FormData();
      videoFiles.forEach((file) => {
         formData.append("videos", file);
      });
      audioFiles.forEach((file) => {
        formData.append("audios", file);
      });
      const pythonBlob = new Blob([storePythonCode], { type: "text/plain" });
      formData.append("pythonScript", pythonBlob, "script.py"); 
      console.log("formData:", formData);
      const response2 = await fetch("http://localhost:3000/run-python", {
        method: "POST",
        body: formData,
      });
      console.log("response2:", response2);
      if (!response2.ok) throw new Error("Erreur lors de l'exécution du script Python");

 
      const data = await response2.json();
      console.log("Vidéo générée avec succès :", data);

    } catch (error) {
      console.error("Erreur :", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        className="generation-button"
        onClick={handleClick}
        disabled={loading}
      >
        Générer la vidéo
      </button>

      {/* Popup modal */}
      {loading && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="spinner-circle"></div>
            <p>Generating your video, please wait...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerationButton;
