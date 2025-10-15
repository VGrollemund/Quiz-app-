import React, { useEffect, useState } from 'react';

function ProgressBar({ current, total }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const newProgress = Math.min((current / total) * 100, 100);
    // Animation douce de progression
    const timer = setTimeout(() => setProgress(newProgress), 150);
    return () => clearTimeout(timer);
  }, [current, total]);

  // Couleur dynamique selon l'avancement
  const getColor = () => {
    if (progress < 40) return '#ff4d4d'; // rouge
    if (progress < 70) return '#ffcc00'; // jaune
    return '#28a745'; // vert
  };

  return (
    <div className="progress-container-enhanced">
      <div className="progress-bar-wrapper">
        <div 
          className="progress-bar-enhanced"
          style={{ 
            width: `${progress}%`,
            background: `linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)`
          }}
        />
      </div>
      <div className="progress-text">
        Question <span className="progress-percentage">{current}</span> / {total} 
        <span style={{ marginLeft: '10px', fontSize: '0.9rem' }}>
          ({Math.round(progress)}%)
        </span>
      </div>
    </div>
  );
}

export default ProgressBar;
