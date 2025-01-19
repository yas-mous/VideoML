import React from "react";

interface DragAndDropZoneProps {
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnter: () => void;
  onDragLeave: () => void;
  dragOver: boolean;
}

const DragAndDropZone: React.FC<DragAndDropZoneProps> = ({
  onDrop,
  onDragOver,
  onDragEnter,
  onDragLeave,
  dragOver,
}) => {
  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      style={{
        padding: "20px",
        backgroundColor: dragOver ? "#ffffff" : "#4CAF50",
        minHeight: "70px",
        textAlign: "center",
        border: dragOver ? "2px dashed #4CAF50" : "2px dashed #fff",
        marginTop: "20px",
        borderRadius: "12px",
        boxShadow: dragOver ? "0 6px 18px rgba(0, 0, 0, 0.2)" : "0 4px 12px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s ease",
      }}
    >
      <p style={{ color: dragOver ? "#4CAF50" : "#fff", fontSize: "16px", fontWeight: "500" }}>
        Glissez vos fichiers vidéo ou audio ici
      </p>
    </div>
  );
};

export default DragAndDropZone;
