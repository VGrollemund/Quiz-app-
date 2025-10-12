import React, { useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";

function ScoreDisplay({ score, total, onRestart }) {
  useEffect(() => {
    const saveStats = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      const accuracy = (score / total) * 100;

      if (snap.exists()) {
        const d = snap.data();
        const newGames = d.gamesPlayed + 1;
        const newTotal = d.totalScore + score;
        const newBest = Math.max(d.bestScore, score);
        const newAcc = ((d.accuracy * d.gamesPlayed) + accuracy) / newGames;

        await updateDoc(ref, {
          gamesPlayed: newGames,
          totalScore: newTotal,
          bestScore: newBest,
          accuracy: newAcc,
        });
      } else {
        await setDoc(ref, {
          email: user.email,
          gamesPlayed: 1,
          totalScore: score,
          bestScore: score,
          accuracy: accuracy,
        });
      }
    };

    saveStats();
  }, [score, total]);

  return (
    <div className="score-display" style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>Quiz terminé !</h2>
      <p>Votre score : {score} / {total}</p>
      <p>Pourcentage : {(score / total * 100).toFixed(2)}%</p>

      <button
        onClick={onRestart}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          borderRadius: "8px",
          border: "none",
          backgroundColor: "#007bff",
          color: "white",
          cursor: "pointer",
        }}
      >
        Rejouer
      </button>
    </div>
  );
}

export default ScoreDisplay;
