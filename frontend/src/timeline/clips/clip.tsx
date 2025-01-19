import React from "react";
import { LayerElement } from "videoML/src/cli/models/models.js";

interface ClipUIProps {
  clip: LayerElement;
}

export const ClipUI: React.FC<ClipUIProps> = ({ clip }) => {
  const color: string = clip.$type === "AudioClip" ? "#ffbb33" : "#6699ff";

  // Vérifier si clip.properties est défini avant de calculer la durée
  const duration: number = clip.properties && clip.properties[0]?.interval 
    ? (clip.properties[0]?.interval.end && clip.properties[0]?.interval.begin) 
      ? convertToDuration(clip.properties[0]?.interval.end) - convertToDuration(clip.properties[0]?.interval.begin)
      : 0  // Si l'une des valeurs est undefined, on retourne 0
    : 0; // Si clip.properties est undefined, on met une durée par défaut de 0

  const width: number = duration ? duration * 43.5 : 100; // Si la durée est calculée, on utilise le résultat, sinon on met 100px

  {console.log(duration)}

  function formatEffectName(effectType: string): string {
    // Retirer le suffixe "Effect" et convertir en minuscule
    if (effectType.endsWith("Effect")) {
      return effectType.replace("Effect", "").toLowerCase();
    }
    return "unknown"; // Pour gérer les cas inattendus
  }

  function convertToDuration(timeString: string): number {
    if (!timeString) {
      return 0; // Retourne 0 si timeString est undefined ou vide
    }
    const [hours, minutes, seconds] = timeString.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  }

  return (
    <div>
      <div style={{
        display: "flex", fontSize: "10px"
      }}>
        {/* Liste des effets */}
        {clip?.effects?.length > 0 &&
          clip.effects.map((element, idx) => (
            <div key={idx}>
              {formatEffectName(element.$type) + ", "}
            </div>
          ))}
      </div>
      <div
        style={{
          width: `${width}px`,
          height: "40px",
          backgroundColor: color,
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "6px",
          marginLeft: "-6px",
        }}
      >
        {/* Nom du clip */}
        {clip?.clipName}
      </div>
    </div>
  );
};
