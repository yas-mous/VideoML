import React from "react";

interface ModalProps {
  selectedFile: File | null;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ selectedFile, onClose }) => {
  if (!selectedFile) return null;

  return (
    <div
      style={{
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
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          width: "80%",
          maxWidth: "800px",
          textAlign: "center",
        }}
      >
        <h3>Vidéo sélectionnée :</h3>
        <video width="100%" controls>
          <source src={URL.createObjectURL(selectedFile)} type={selectedFile.type} />
          Votre navigateur ne supporte pas la lecture de vidéos.
        </video>
        <br />
        <button
          onClick={onClose}
          style={{
            marginTop: "10px",
            backgroundColor: "red",
            color: "white",
            padding: "10px",
            border: "none",
            borderRadius: "5px",
          }}
        >
          X
        </button>
      </div>
    </div>
  );
};

export default Modal;
