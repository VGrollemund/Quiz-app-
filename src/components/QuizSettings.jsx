import React, { useState } from "react";

function QuizSettings({ onSave }) {
  const [category, setCategory] = useState("geography");
  const [difficulty, setDifficulty] = useState("easy");

  const handleSave = () => {
    if (typeof onSave === "function") {
      onSave({ category, difficulty });
    } else {
      alert("Erreur : onSave n’a pas été transmis !");
    }
  };

  return (
    <div style={{
      backgroundColor: "#1e1e1e",
      border: "2px solid #00bfff",
      borderRadius: 15,
      padding: 25,
      width: 320,
      margin: "20px auto",
      textAlign: "left",
      boxShadow: "0 4px 10px rgba(0,191,255,0.2)"
    }}>
      <h3 style={{color: "white"}}>Paramètres du Quiz</h3>
      <label style={{ display: "block", marginTop: 10, color: "white" }}>
        Catégorie
        <select value={category} onChange={e => setCategory(e.target.value)}
          style={{ width: "100%", padding: 8, borderRadius: 6, marginTop: 4 }}>
          <option value="geography">Géographie</option>
          <option value="pokemon">Pokémon image</option>
          <option value="pokemon_sound">Pokémon son</option>
          <option value="pokemon_types">Pokémon types</option>
        </select>
      </label>
      <label style={{ display: "block", marginTop: 10, color: "white" }}>
        Difficulté
        <select value={difficulty} onChange={e => setDifficulty(e.target.value)}
          style={{ width: "100%", padding: 8, borderRadius: 6, marginTop: 4 }}>
          <option value="easy">Facile</option>
          <option value="medium">Moyen</option>
          <option value="hard">Difficile</option>
        </select>
      </label>
      <button
        onClick={handleSave}
        style={{
          marginTop: 15,
          width: "100%",
          backgroundColor: "#00bfff",
          color: "black",
          border: "none",
          borderRadius: 8,
          padding: 10,
          fontWeight: "bold",
          cursor: "pointer",
        }}>
        Enregistrer et lancer
      </button>
    </div>
  );
}

export default QuizSettings;

