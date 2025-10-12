import React from "react";

function MainMenu({ onSelectMode }) {
  return (
    <div
      style={{
        textAlign: "center",
        color: "white",
        marginTop: "50px",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: "2.5rem",
          marginBottom: "40px",
          textShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
          color: "#00aaff",
        }}
      >
        ROM-charrette-quiz
      </h1>

      <h2 style={{ marginBottom: "20px", color: "#ccc" }}>Choisis un mode de jeu</h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "15px",
        }}
      >
        <button onClick={() => onSelectMode("solo")} style={buttonStyle}>
           Géographie
        </button>

        <button onClick={() => onSelectMode("pokemon")} style={buttonStyle}>
           Pokémon (visuel)
        </button>

        <button onClick={() => onSelectMode("pokemon_sound")} style={buttonStyle}>
           Pokémon (sons)
        </button>

        <button onClick={() => onSelectMode("pokemon_types")} style={buttonStyle}>
           Pokémon (types)
        </button>

        <button
          onClick={() => onSelectMode("create")}
          style={{ ...buttonStyle, backgroundColor: "#2ecc71" }}
        >
           Créer un salon
        </button>

        <button
          onClick={() => onSelectMode("join")}
          style={{ ...buttonStyle, backgroundColor: "#f39c12" }}
        >
           Rejoindre un salon
        </button>

        {/*  Nouveau bouton Mes amis */}
        <button
          onClick={() => onSelectMode("friends")}
          style={{ ...buttonStyle, backgroundColor: "#9b59b6" }}
        >
           Mes amis
        </button>
      </div>
    </div>
  );
}

const buttonStyle = {
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  padding: "12px 24px",
  borderRadius: "10px",
  fontSize: "1rem",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "background 0.3s, transform 0.2s",
  width: "250px",
  textAlign: "center",
};

export default MainMenu;
