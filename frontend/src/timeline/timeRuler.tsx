import React from "react";

interface TimeRulerProps {
  duration: number; // Durée totale en secondes
  step: number;     // Intervalle entre les marques de temps
}

const TimeRuler: React.FC<TimeRulerProps> = ({ duration, step }) => {
  const steps = [];
  for (let i = 0; i <= duration; i += step) {
    steps.push(i);
  }

  return (
    <div style={{ display: 'flex', position: 'relative', height: '20px', background: '#eee',marginLeft:'35px'}}>
      {steps.map((time, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            left: `${(time / duration) * 100}%`,
            height: '100%',
            borderLeft: '1px solid #000',
            textAlign: 'center',
            fontSize: '12px',
            borderRadius:'1Opx'
          }}
        >
          <span style={{ position: 'absolute', top: '20px', transform: 'translateX(-50%)' }}>
            {time}s
          </span>
        </div>
      ))}
    </div>
  );
};

export default TimeRuler;
