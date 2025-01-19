import React from "react";
import "../styles/button.css";

const HelpButton: React.FC = () => {
  const handleClick = () => {
    alert("Aide : Voici quelques informations pour utiliser l'application...");
  };

  return (
    <button className="help-button" onClick={handleClick}>
      Aide?
    </button>
  );
};

export default HelpButton;
