import React from "react";
import { LayerElement } from "videoML/src/cli/models/models.js";

interface ClipUIProps {
  clip: LayerElement;
  width: number;
}

export const ClipUI: React.FC<ClipUIProps> = ({ clip, width }) => {
  const color: string = clip.$type === "AudioClip" ? "#ffbb33" : "#6699ff";
  function formatEffectName(effectType: string): string {
    // Retirer le suffixe "Effect" et convertir en minuscule
    if (effectType.endsWith("Effect")) {
      return effectType.replace("Effect", "").toLowerCase();
    }
    return "unknown"; // Pour gérer les cas inattendus
  }

  return (
    <div>
      <div style={{
        display: "flex",fontSize:"10px"
      }}>
        {/* Liste des effets */}
        {clip?.effects?.length > 0 &&
          clip.effects.map((element, idx) => (
            <div key={idx}
            >
              {formatEffectName(element.$type)+", "}
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
