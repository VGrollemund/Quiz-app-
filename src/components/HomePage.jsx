import React from "react";
import "./HomePage.css";

function HomePage({ pseudo, onSelectMode, onEditPseudo }) {
  return (
    <div className="homepage-container">
      {/* Partie gauche : Choix du mode */}
      <div className="homepage-left">
        <h1 className="homepage-title">Choisis ton mode de jeu</h1>

        <div className="game-modes">
          <div
            className="game-card"
            onClick={() => onSelectMode("create")}
          >
            <h2>Créer un salon</h2>
            <p>Invite tes amis et lance une partie privée.</p>
          </div>

          <div
            className="game-card"
            onClick={() => onSelectMode("join")}
          >
            <h2>Rejoindre un salon</h2>
            <p>Entre un code pour rejoindre un salon existant.</p>
          </div>

          <div
            className="game-card"
            onClick={() => onSelectMode("solo")}
          >
            <h2>Mode Solo</h2>
            <p>Joue seul pour t'entraîner et tester tes connaissances.</p>
          </div>
        </div>
      </div>

      {/* Partie droite : Profil */}
      <div className="homepage-right">
        <div className="profile-card">
          <div className="profile-avatar"></div>
          <p className="profile-pseudo">{pseudo}</p>
          <button
            className="profile-edit-btn"
            onClick={onEditPseudo}
          >
            Modifier le pseudo
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
