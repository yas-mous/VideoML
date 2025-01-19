import React, { useState } from "react";
import "../styles/button.css";
import "../styles/modal.css"; 

const HelpButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <button className="help-button" onClick={handleOpenModal}>
        Aide?
      </button>
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Comment utiliser EyaMotion ?</h2>
            <p>
              <strong>1. Importer une vidéo</strong>
              <br />
              - Faites glisser et déposez votre fichier vidéo dans le carré vert à droite pour l'importer dans le projet.
              <br />
              - Si vous souhaitez visualiser la vidéo avant de l'importer, cliquez sur "Choisir un fichier", sélectionnez votre vidéo, puis prévisualisez-la.
            </p>
            <p>
              <strong>2. Écrire votre script de montage</strong>
              <br />
              - Utilisez l'éditeur situé à gauche pour écrire votre script de montage.
              <br />
              - Référencez uniquement les vidéos que vous avez importées dans votre projet.
            </p>
            <button className="close-button" onClick={handleCloseModal}>
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpButton;