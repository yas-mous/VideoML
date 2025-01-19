import React, { useState } from "react";
import { useProgramStore } from "../editor/stores/programStore.js";
import { useVideoStore } from "../upload/stores/videoStore.js";
import { useAudioStore } from "../upload/stores/audioStore.js";

import "../styles/button.css";

const GenerationButton: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null); // Pour stocker l'URL de la vidéo
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


      const response = await fetch("http://localhost:3000/run-python", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Erreur lors de l'exécution du script Python");

      const videoBlob = await response.blob();
      const videoUrl = URL.createObjectURL(videoBlob);  // Créer l'URL de la vidéo générée

      // Mettre l'URL dans l'état pour l'afficher dans le modal
      setVideoUrl(videoUrl);
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

      {/* Modal pour afficher la vidéo générée */}
      {videoUrl && (
        <div className="modal-overlay-video">
          <div className="modal-content_video">
            <video controls>
              <source src={videoUrl} type="video/mp4" />
              Video not supported
            </video>
            <button className="video-button" onClick={() => setVideoUrl(null)}>x</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerationButton;
