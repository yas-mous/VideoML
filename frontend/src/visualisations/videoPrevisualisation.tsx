import React, { useState } from "react";
import "../styles/videoPreview.css";

const VideoPreview: React.FC = () => {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const videoURL = URL.createObjectURL(file);
      setVideoSrc(videoURL);
    }
  };

  return (
    <div className="video-preview-container">
      <p>Prévisualisation Vidéo</p>
      {videoSrc ? (
        <video controls width="100%">
          <source src={videoSrc} type="video/mp4" />
          Votre navigateur ne supporte pas la balise vidéo.
        </video>
      ) : (
        <p>Aucune vidéo sélectionnée.</p>
      )}
      <input
        type="file"
        accept="video/mp4"
        onChange={handleFileUpload}
        className="video-upload-input"
      />
    </div>
  );
};

export default VideoPreview;
