import React, { useState } from "react";

export const Download: React.FC = () => {
  const [fileNames, setFileNames] = useState<string[]>([]); 

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); 
    const files = e.dataTransfer.files;
    const fileNamesArray = Array.from(files).map((file) => file.name);

    
    const newFiles = fileNamesArray.filter(
      (fileName) => !fileNames.includes(fileName) 
    );

    if (newFiles.length > 0) {
      setFileNames((prevFileNames) => [...prevFileNames, ...newFiles]); 
    } else {
      alert("Certains fichiers sont déjà ajoutés.");
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); 
  };

  const handleDownload = () => {
    console.log("Téléchargement lancé...");
  };

  const handleDeleteFile = (fileName: string) => {
    setFileNames((prevFileNames) =>
      prevFileNames.filter((name) => name !== fileName)
    );
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      style={{
        padding: "20px",
        backgroundColor: "lightgray",
        minHeight: "150px",
        textAlign: "center",
        border: "2px dashed #ccc",
        marginTop: "20px",
      }}
    >
      <h2>Téléchargement</h2>
      <button onClick={handleDownload}>Télécharger</button>
      <p>Glissez un fichier ici pour le télécharger</p>
      {fileNames.length > 0 && (
        <div>
          <h3>Fichiers déposés :</h3>
          <ul>
            {fileNames.map((fileName, index) => (
              <li key={index}>
                {fileName}
                <button onClick={() => handleDeleteFile(fileName)} style={{ marginLeft: "10px", color: "red" }}>
                  X
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
