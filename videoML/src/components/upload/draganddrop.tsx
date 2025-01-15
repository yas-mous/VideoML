import React, { useState, useCallback } from "react";
import DragAndDropZone from "./utils/dragDropZone.tsx";
import FileList from "./utils/fileList.tsx";
import Modal from "./utils/modal.tsx";

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
      <DragAndDropZone
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={() => setDragOver(true)}
        onDragLeave={() => setDragOver(false)}
        dragOver={dragOver}
      />
      <FileList
        fileNames={fileNames}
        files={files}
        onClickVideo={handleClickVideo}
        onDeleteFile={handleDeleteFile}
      />
      {isModalOpen && <Modal selectedFile={selectedFile} onClose={handleCloseModal} />}
    </div>
  );
};
