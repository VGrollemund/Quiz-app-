import { useState } from "react";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase";

function JoinLobby({ onBack, pseudo, onSuccess }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoin = async (e) => {
    e.preventDefault();
    setError("");

    if (!code.trim()) {
      setError("Veuillez entrer un code de salon");
      return;
    }

    if (!pseudo) {
      setError("Pseudo non défini. Reconnectez-vous.");
      return;
    }

    setLoading(true);

    try {
      const lobbyRef = doc(db, "salons", code.toUpperCase());
      const lobbySnap = await getDoc(lobbyRef);

      if (!lobbySnap.exists()) {
        setError(" Ce salon n'existe pas !");
        setLoading(false);
        return;
      }

      const lobbyData = lobbySnap.data();

      if (lobbyData.gameStarted) {
        setError(" La partie a déjà commencé !");
        setLoading(false);
        return;
      }

      //  Vérifie si le joueur est déjà dedans
      if (lobbyData.players.includes(pseudo)) {
        console.log(" Joueur déjà dans le salon");
      } else {
        //  Ajoute le joueur
        await updateDoc(lobbyRef, {
          players: arrayUnion(pseudo),
        });
      }

      console.log(" Joueur ajouté au salon:", code.toUpperCase());
      if (onSuccess) onSuccess(code.toUpperCase());
    } catch (err) {
      console.error("Erreur Firestore:", err);
      setError("Erreur lors de la connexion au salon.");
    }

    setLoading(false);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Rejoindre un salon</h2>

      <form onSubmit={handleJoin} style={{ marginTop: "30px" }}>
        <input
          type="text"
          placeholder="Code du salon (ex: ABC123)"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          maxLength={6}
          style={{
            display: "block",
            margin: "10px auto",
            padding: "10px",
            fontSize: "16px",
            width: "200px",
            textAlign: "center",
            textTransform: "uppercase",
          }}
          disabled={loading}
          autoFocus
        />

        {error && (
          <p style={{ color: "red", fontSize: "14px", marginTop: "10px" }}>
            {error}
          </p>
        )}

        <div style={{ marginTop: "20px" }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              margin: "10px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            {loading ? "Connexion..." : "Rejoindre"}
          </button>

          <button
            type="button"
            onClick={onBack}
            disabled={loading}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              margin: "10px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Retour
          </button>
        </div>
      </form>
    </div>
  );
}

export default JoinLobby;
