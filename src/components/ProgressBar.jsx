import React, { useEffect, useState } from "react";

function ProgressBar({ current, total }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const newProgress = Math.min((current / total) * 100, 100);
    // Animation douce de progression
    const timer = setTimeout(() => setProgress(newProgress), 150);
    return () => clearTimeout(timer);
  }, [current, total]);

  // Couleur dynamique selon l’avancement
  const getColor = () => {
    if (progress < 40) return "#ff4d4d"; // rouge
    if (progress < 70) return "#ffcc00"; // jaune
    return "#28a745"; // vert
  };

  return (
    <div
      style={{
        width: "80%",
        margin: "20px auto",
        textAlign: "center",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {/* Barre de fond */}
      <div
        style={{
          height: "20px",
          width: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          borderRadius: "10px",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
        }}
      >
        {/* Barre de progression */}
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${getColor()} 0%, #00d4ff 100%)`,
            borderRadius: "10px",
            transition: "width 0.6s ease, background 0.5s ease",
            boxShadow: "0 0 15px rgba(255, 255, 255, 0.3)",
          }}
        />
      </div>

      {/* Texte sous la barre */}
      <p
        style={{
          marginTop: "8px",
          color: "white",
          fontWeight: "bold",
          letterSpacing: "1px",
        }}
      >
        Question {current} / {total} ({Math.round(progress)}%)
      </p>
    </div>
  );
}

export default ProgressBar;
