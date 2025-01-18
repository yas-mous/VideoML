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
  
      formData.append("pythonScript", new Blob([storePythonCode], { type: "text/plain" }));
  
      const response = await fetch("http://localhost:3000/api/generate-video", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) throw new Error("Erreur lors de la génération de la vidéo");
  
      const data = await response.json();
      console.log("Vidéo générée avec succès :", data);
      window.location.href = data.outputUrl;
  
    } catch (error) {
      console.error("Erreur :", error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <button
      className="generation-button"
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? "Loading..." : "Generate Video"}
    </button>
  );
};

export default GenerationButton;
