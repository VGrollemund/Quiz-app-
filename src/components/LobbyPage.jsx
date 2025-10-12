import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  doc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import QuizSettings from "./QuizSettings";
import QuizContainer from "./QuizContainer";

function LobbyPage({ lobbyCode, user, pseudo, onExit }) {
  const [players, setPlayers] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizSettings, setQuizSettings] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "salons", lobbyCode), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setPlayers(data.players || []);
        setIsHost(data.host === user.uid);
        setQuizStarted(data.gameStarted);
        setQuizSettings(data.settings || null);
      }
    });
    return () => unsub();
  }, [lobbyCode, user]);

  const handleStartQuiz = async () => {
    await updateDoc(doc(db, "salons", lobbyCode), {
      gameStarted: true,
    });
  };

  const handleSettingsSave = async (settings) => {
    await updateDoc(doc(db, "salons", lobbyCode), { settings });
  };

  const handleQuit = async () => {
    await updateDoc(doc(db, "salons", lobbyCode), {
      players: arrayRemove(pseudo),
    });
    onExit();
  };

  if (quizStarted) {
    return <QuizContainer settings={quizSettings} />;
  }

  return (
    <div className="app-container" style={{ textAlign: "center" }}>
      <h2>Salon {lobbyCode}</h2>

      <div>
        <h3>Joueurs connectés :</h3>
        {players.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {!quizStarted && isHost && (
        <>
          <h3>Paramétrer le quiz</h3>
          <QuizSettings onSave={handleSettingsSave} />
          <button
            onClick={handleStartQuiz}
            style={{
              marginTop: "15px",
              backgroundColor: "#00bfff",
              color: "black",
              fontWeight: "bold",
            }}
          >
            Démarrer le quiz
          </button>
        </>
      )}

      {!isHost && !quizStarted && (
        <p>En attente que le créateur démarre le quiz...</p>
      )}

      <button
        onClick={handleQuit}
        style={{
          marginTop: "20px",
          backgroundColor: "#ff5555",
          color: "white",
        }}
      >
        Quitter
      </button>
    </div>
  );
}

export default LobbyPage;


