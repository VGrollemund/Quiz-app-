import React, { useState } from "react";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function LobbyCreator({ onBack, onCreated, pseudo, user }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateCode = async () => {
    setLoading(true);
    setError("");

    try {
      let newCode;
      let exists = true;

      while (exists) {
        const letters = Math.random().toString(36).substring(2, 5).toUpperCase();
        const numbers = Math.floor(100 + Math.random() * 900);
        newCode = `${letters}${numbers}`;

        const ref = doc(db, "salons", newCode);
        const snapshot = await getDoc(ref);
        exists = snapshot.exists();
      }

      // ✅ Crée le salon
      await setDoc(doc(db, "salons", newCode), {
        host: user.uid,
        hostPseudo: pseudo,
        createdAt: new Date(),
        players: [pseudo],
        gameStarted: false,
      });

      console.log("✅ Salon créé :", newCode);

      setCode(newCode);

      // ✅ Redirige vers LobbyPage
      if (onCreated) onCreated(newCode);

    } catch (err) {
      console.error(err);
      setError("Erreur lors de la création du salon.");
    }

    setLoading(false);
  };

  if (code) {
    return (
      <div style={{ textAlign: "center", color: "white", marginTop: "50px" }}>
        <h2>Création du salon réussie 🎉</h2>
        <p>Code du salon : <strong>{code}</strong></p>
        <p>En attente que des joueurs rejoignent...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h2 className="text-2xl font-semibold mb-4">Créer un salon</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <button
        onClick={generateCode}
        disabled={loading}
        className="bg-green-600 px-6 py-3 rounded-xl hover:bg-green-700 transition disabled:opacity-50"
      >
        {loading ? "Création en cours..." : "Générer un code"}
      </button>

      <button
        onClick={onBack}
        disabled={loading}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#555",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Retour
      </button>
    </div>
  );
}
