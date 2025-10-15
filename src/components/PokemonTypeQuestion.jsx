import React, { useState, useEffect } from "react";

// Liste complète des types Pokémon
const ALL_TYPES = [
  "normal", "fire", "water", "grass", "electric", "ice",
  "fighting", "poison", "ground", "flying", "psychic", "bug",
  "rock", "ghost", "dragon", "dark", "steel", "fairy",
];

function PokemonTypeQuestion({ pokemon, onValidate }) {
  const [availableTypes, setAvailableTypes] = useState(ALL_TYPES);
  const [chosenTypes, setChosenTypes] = useState([]);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    setAvailableTypes(ALL_TYPES);
    setChosenTypes([]);
    setFeedback("");
  }, [pokemon]);

  const handleDragStart = (e, type) => {
    e.dataTransfer.setData("type", type);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("type");
    if (!chosenTypes.includes(type)) {
      setChosenTypes([...chosenTypes, type]);
      setAvailableTypes(availableTypes.filter((t) => t !== type));
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const removeChosenType = (type) => {
    setChosenTypes(chosenTypes.filter((t) => t !== type));
    setAvailableTypes([...availableTypes, type]);
  };

  const checkAnswer = () => {
    const correct = arraysEqual(
      chosenTypes.sort(),
      pokemon.types.sort()
    );

    if (correct) {
      setFeedback(" Bonne réponse !");
    } else {
      setFeedback(` Mauvaise réponse ! (${pokemon.types.join(", ")})`);
    }

    setTimeout(() => {
      onValidate(correct);
      setFeedback("");
    }, 1500);
  };

  const arraysEqual = (a, b) =>
    a.length === b.length && a.every((v, i) => v === b[i]);

  return (
    <div
      style={{
        textAlign: "center",
        color: "white",
        padding: "20px",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <h2 style={{ marginBottom: "10px" }}>Quel(s) type(s) pour :</h2>
      <h1 style={{ color: "#ffcb05", textTransform: "capitalize" }}>
        {pokemon.name}
      </h1>

      <img
        src={pokemon.image}
        alt={pokemon.name}
        style={{
          width: "160px",
          height: "160px",
          margin: "20px auto",
          display: "block",
        }}
      />

      {/* Zone de dépôt */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{
          minHeight: "100px",
          border: "2px dashed #ffcb05",
          borderRadius: "12px",
          margin: "20px auto",
          padding: "10px",
          width: "80%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
          background: "rgba(255, 255, 255, 0.05)",
        }}
      >
        {chosenTypes.length === 0 ? (
          <p style={{ color: "#c8ab1cff" }}>Glisse ici le ou les types !</p>
        ) : (
          chosenTypes.map((type) => (
            <div
              key={type}
              onClick={() => removeChosenType(type)}
              style={{
                backgroundColor: "#ffcb05",
                color: "black",
                padding: "8px 14px",
                borderRadius: "20px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "transform 0.2s, background 0.3s",
              }}
              title="Cliquer pour retirer"
            >
              {type.toUpperCase()} ✕
            </div>
          ))
        )}
      </div>

      {/* Types disponibles : STYLES VISIBLES ORANGES */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "10px",
          marginTop: "15px",
        }}
      >
        {availableTypes.map((type) => (
          <div
            key={type}
            draggable
            onDragStart={(e) => handleDragStart(e, type)}
            style={{
              backgroundColor: "#ffcb05",
              border: "2px solid #ffcb05",
              color: "#fff",
              padding: "10px 22px",
              borderRadius: "18px",
              fontWeight: "bold",
              cursor: "grab",
              fontSize: "1.12em",
              boxShadow: "0 2px 8px rgba(255,152,0,0.13)",
              margin: "6px 0",
              letterSpacing: "1px",
              transition: "background 0.2s, border 0.2s, transform 0.15s",
              userSelect: "none"
            }}
            onMouseEnter={e =>
              (e.currentTarget.style.backgroundColor = "#ffcb05")
            }
            onMouseLeave={e =>
              (e.currentTarget.style.backgroundColor = "#ffcb05")
            }
          >
            {type.toUpperCase()}
          </div>
        ))}
      </div>

      {/* Feedback visuel */}
      {feedback && (
        <p
          style={{
            marginTop: "20px",
            fontSize: "1.2rem",
            fontWeight: "bold",
            color: feedback.includes("Bonne") ? "#28a745" : "#ffcb05",
            background: "rgba(255, 255, 255, 0.1)",
            padding: "10px 20px",
            borderRadius: "10px",
            animation: "fadeIn 0.5s ease",
          }}
        >
          {feedback}
        </p>
      )}

      {/* Bouton Valider */}
      <button
        onClick={checkAnswer}
        disabled={chosenTypes.length === 0 || feedback !== ""}
        style={{
          marginTop: "25px",
          padding: "12px 40px",
          borderRadius: "10px",
          border: "none",
          cursor:
            chosenTypes.length === 0 || feedback !== ""
              ? "not-allowed"
              : "pointer",
          backgroundColor:
            chosenTypes.length === 0 || feedback !== ""
              ? "#777"
              : "#007bff",
          color: "white",
          fontWeight: "bold",
          fontSize: "16px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          transition: "background 0.3s, transform 0.2s",
        }}
      >
        Valider
      </button>
    </div>
  );
}

export default PokemonTypeQuestion;
