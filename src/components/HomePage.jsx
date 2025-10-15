import React from "react";

function HomePage({ pseudo, onSelectMode, onEditPseudo }) {
  if (typeof onSelectMode !== "function") {
    return (
      <div className="app-container">
        <div className="card">
          <h1>ROM-charrette-quiz</h1>
          <p style={{ color: "red", fontWeight: "bold" }}>
            Erreur : la fonction onSelectMode n’a pas été transmise depuis le parent !
          </p>
          <p>Corrigez votre App.js ou parent pour passer <b>onSelectMode</b> en prop.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="card">
        <h1>ROM-charrette-quiz</h1>
        <p>Choisissez un mode :</p>
        <button onClick={() => onSelectMode("solo")}>Mode Solo</button>
        <button onClick={() => onSelectMode("create")}>Créer un salon</button>
        <button onClick={() => onSelectMode("join")}>Rejoindre un salon</button>
      </div>
      <div className="profile-card" style={{ marginTop: 22 }}>
        <div className="profile-avatar">
          {pseudo ? pseudo[0].toUpperCase() : "?"}
        </div>
        <div style={{ fontWeight: 600 }}>{pseudo}</div>
        <button style={{ marginTop: 8 }} onClick={onEditPseudo}>
          Modifier le pseudo
        </button>
      </div>
    </div>
  );
}

export default HomePage;
