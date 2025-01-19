import React from "react";
import "../styles/eyamotionLogo.css"; 

const EyamotionLogoText: React.FC = () => {
  return (
    <div className="logo-text-container">
      <h1>
        <span className="eyam">EYAM</span>
        <span className="otion">OTION</span>
        <svg className="scissor-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
          {/* Ciseaux mais ca s affiche pas*/}
          <circle cx="20" cy="20" r="10" fill="#3b82f6" />
          <circle cx="44" cy="20" r="10" fill="#3b82f6" />
          <rect x="18" y="18" width="28" height="4" fill="#fbbf24" transform="rotate(45 32 20)" />
          <rect x="18" y="18" width="28" height="4" fill="#fbbf24" transform="rotate(-45 32 20)" />
        </svg>
      </h1>
    </div>
  );
};

export default EyamotionLogoText;
