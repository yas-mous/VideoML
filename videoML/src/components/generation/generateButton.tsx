import React, { useState } from "react";
import { useProgramStore } from "../editor/stores/programStore.ts";

import "../../styles/button.css";


const GenerationButton: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const storePythonCode = useProgramStore((state) => state.pythonCode);


  const handleClick = async () => {
    setLoading(true);


    try {
      console.log("Génération du code Python en cours...");
      console.log("++++++++++++++++++++++++++++++++++++++++++")
      console.log(storePythonCode);
      
      /*const response = await fetch('/api/generate-python', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ /* Données nécessaires pour générer le code  })
      });

      const result = await response.json();*/
      console.log('Code Python généré:');
      // Gérer la suite après la génération, par exemple en mettant à jour l'UI

    } catch (error) {
      console.error("Erreur lors de la génération:", error);
    }

    setLoading(false);
  };

  return (
    <button
      className="generation-button"
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? "Génération en cours..." : "Générer la vidéo"}
    </button>
  );
};

export default GenerationButton;
