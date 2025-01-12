import React from "react";

export const Download: React.FC = () => {
  const handleDownload = () => {
    console.log("Téléchargement lancé...");
  };

  return (
    <div>
      <h2>Téléchargement</h2>
      <button onClick={handleDownload}>Télécharger</button>
    </div>
  );
};
