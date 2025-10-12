import React, { useState } from "react";

function QuizSettings({ onSave }) {
  const [category, setCategory] = useState("geography");
  const [difficulty, setDifficulty] = useState("easy");

  const handleSave = () => {
    onSave({ category, difficulty });
  };

  return (
    <div
      style={{
        backgroundColor: "#1e1e1e",
        border: "2px solid #00bfff",
        borderRadius: "15px",
        padding: "25px",
        width: "320px",
        margin: "20px auto",
        textAlign: "left",
        boxShadow: "0 4px 10px rgba(0,191,255,0.2)",
      }}
    >
      <h3>Paramètres du Quiz</h3>

      <label style={{ display: "block", marginTop: "10px" }}>
        Catégorie :
      </label>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{ width: "100%", padding: "8px", borderRadius: "6px" }}
      >
        <option value="geography">Géographie</option>
        <option value="pokemon">Pokémon (image)</option>
        <option value="pokemon_sound">Pokémon (son)</option>
        <option value="pokemon_types">Pokémon (types)</option>
      </select>

      <label style={{ display: "block", marginTop: "10px" }}>
        Difficulté :
      </label>
      <select
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
        style={{ width: "100%", padding: "8px", borderRadius: "6px" }}
      >
        <option value="easy">Facile</option>
        <option value="medium">Moyen</option>
        <option value="hard">Difficile</option>
      </select>

      <button
        onClick={handleSave}
        style={{
          marginTop: "15px",
          width: "100%",
          backgroundColor: "#00bfff",
          color: "black",
          border: "none",
          borderRadius: "8px",
          padding: "10px",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Enregistrer les paramètres
      </button>
    </div>
  );
}

export default QuizSettings;

