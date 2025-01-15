import React, { useState, useCallback } from "react";

export const DragAndDrop: React.FC = () => {
  const [fileNames, setFileNames] = useState<string[]>([]); 
  const [files, setFiles] = useState<File[]>([]); 
  const [selectedFile, setSelectedFile] = useState<File | null>(null); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [dragOver, setDragOver] = useState(false); 

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);

    const validFiles = droppedFiles.filter((file) => file.type.startsWith("audio/") || file.type.startsWith("video/"));
    const newFileNames = validFiles.map((file) => file.name);
    const newFiles = newFileNames.filter((fileName) => !fileNames.includes(fileName));

    if (newFiles.length > 0) {
      setFileNames((prevFileNames) => [...prevFileNames, ...newFiles]);
      setFiles((prevFiles) => [...prevFiles, ...validFiles]);
    } else {
      alert("Certains fichiers sont déjà ajoutés.");
    }
    setDragOver(false);
  }, [fileNames]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDeleteFile = (fileName: string) => {
    setFileNames((prevFileNames) => prevFileNames.filter((name) => name !== fileName));
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  const handleClickVideo = (file: File) => {
    setSelectedFile(file); 
    setIsModalOpen(true); 
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); 
    setSelectedFile(null); 
  };

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{
          padding: "20px",
          backgroundColor: dragOver ? "#ffffff" : "#4CAF50", 
          minHeight: "120px",
          textAlign: "center",
          border: dragOver ? "2px dashed #4CAF50" : "2px dashed #fff", 
          marginTop: "20px",
          borderRadius: "12px",
          boxShadow: dragOver ? "0 6px 18px rgba(0, 0, 0, 0.2)" : "0 4px 12px rgba(0, 0, 0, 0.1)", 
          transition: "all 0.3s ease",
        }}
        onDragEnter={() => setDragOver(true)} 
        onDragLeave={() => setDragOver(false)} 
      >
        <p style={{ color: dragOver ? "#4CAF50" : "#fff", fontSize: "16px", fontWeight: "500" }}>
          Glissez vos fichiers vidéo ou audio ici
        </p>
      </div>
      {fileNames.length > 0 && (
        <div>
          <h3>Fichiers déposés :</h3>
          <ul>
            {fileNames.map((fileName, index) => {
              const file = files.find((f) => f.name === fileName);
              return (
                <li key={index}>
                  <span onClick={() => file && handleClickVideo(file)} style={{ cursor: 'pointer', color: 'blue' }}>
                    {fileName}
                  </span>
                  <button
                    onClick={() => handleDeleteFile(fileName)}
                    style={{ marginLeft: "10px", color: "red" }}
                  >
                    X
                  </button>
                </li>
              );
            })}
          </ul>
          <button onClick={() => alert("Générer la vidéo")}>Générer la vidéo</button>
        </div>
      )}

      {/* Fenêtre modale */}
      {isModalOpen && selectedFile && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)", 
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
        }}>
          <div style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "10px",
            width: "80%",
            maxWidth: "800px",
            textAlign: "center",
          }}>
            <h3>Vidéo sélectionnée :</h3>
            <video width="100%" controls>
              <source src={URL.createObjectURL(selectedFile)} type={selectedFile.type} />
              Votre navigateur ne supporte pas la lecture de vidéos.
            </video>
            <br />
            <button onClick={handleCloseModal} style={{
              marginTop: "10px",
              backgroundColor: "red",
              color: "white",
              padding: "10px",
              border: "none",
              borderRadius: "5px",
            }}>
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
