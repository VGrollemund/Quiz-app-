import { useState } from "react";
import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

import MainMenu from "./components/MainMenu";
import JoinLobby from "./components/JoinLobby";
import LobbyPage from "./components/LobbyPage";
import QuizContainer from "./components/QuizContainer";
import Profile from "./components/Profile";
import FriendsPage from "./components/FriendsPage";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";

import "./index.css";

function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [pseudo, setPseudo] = useState(localStorage.getItem("pseudo") || "");
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [view, setView] = useState("menu");
  const [lobbyCode, setLobbyCode] = useState("");

  // INSCRIPTION
  const register = async () => {
    if (!username) return alert("Veuillez entrer un pseudo !");
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const newUser = userCredential.user;
      const randomTag = Math.floor(1000 + Math.random() * 9000);
      const userTag = `${username}#${randomTag}`;
      await setDoc(doc(db, "users", newUser.uid), {
        email,
        username,
        tag: randomTag,
        userTag,
        totalScore: 0,
        gamesPlayed: 0,
        bestScore: 0,
        accuracy: 0,
      });
      await setDoc(doc(db, "friends", newUser.uid), { friends: [] });
      await sendEmailVerification(newUser);
      alert("Vérifiez votre boîte mail pour activer votre compte !");
      setUser(newUser);
      setPseudo(userTag);
      localStorage.setItem("pseudo", userTag);
    } catch (err) {
      alert(err.message);
    }
  };

  // CONNEXION
  const login = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const loggedUser = userCredential.user;

      if (!loggedUser.emailVerified)
        return alert(
          "Votre e-mail n'est pas vérifié. Consultez votre boîte mail."
        );

      const snap = await getDoc(doc(db, "users", loggedUser.uid));
      if (snap.exists()) {
        const userData = snap.data();
        setPseudo(userData.userTag || userData.username);
        localStorage.setItem("pseudo", userData.userTag || userData.username);
      }

      setUser(loggedUser);
    } catch (err) {
      alert(err.message);
    }
  };

  // DÉCONNEXION
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setView("menu");
  };

  // CRÉER UN SALON
  const createLobby = async () => {
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

      await setDoc(doc(db, "salons", newCode), {
        host: user.uid,
        hostPseudo: pseudo,
        createdAt: new Date(),
        players: [pseudo],
        gameStarted: false,
      });

      setLobbyCode(newCode);
      setView("lobby");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la création du salon !");
    }
  };

  // APRÈS REJOINDRE SALON
  const handleJoinSuccess = (code) => {
    setLobbyCode(code);
    setView("lobby");
  };

  // Pour QuizContainer affichage fullscreen
  const isQuizActive = view === "solo" || view === "lobby";

  // —————————————————————————
  // NON CONNECTÉ : Connexion/Inscription
  if (!user) {
    return (
      <div className="app-container">
        <Navbar
          user={user}
          onProfile={() => setShowProfile(true)}
          onHome={() => setShowProfile(false)}
        />
        <div style={{ textAlign: "center", marginTop: 50 }}>
          <h2>{isRegisterMode ? "Inscription" : "Connexion"}</h2>
          {isRegisterMode && (
            <input
              type="text"
              placeholder="Pseudo"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ display: "block", margin: "10px auto", padding: "8px" }}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ display: "block", margin: "10px auto", padding: "8px" }}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ display: "block", margin: "10px auto", padding: "8px" }}
          />
          {isRegisterMode ? (
            <>
              <button onClick={register}>S'inscrire</button>
              <p>
                Déjà un compte ?{" "}
                <span
                  style={{ color: "lightblue", cursor: "pointer" }}
                  onClick={() => setIsRegisterMode(false)}
                >
                  Se connecter
                </span>
              </p>
            </>
          ) : (
            <>
              <button onClick={login}>Connexion</button>
              <p>
                Pas encore de compte ?{" "}
                <span
                  style={{ color: "lightblue", cursor: "pointer" }}
                  onClick={() => setIsRegisterMode(true)}
                >
                  S'inscrire
                </span>
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  // —————————————————————————
  // CONNECTÉ : Navigation interne
  return (
    <div className={isQuizActive ? "quiz-fullscreen" : "app-container"}>
      <Navbar
        user={user}
        onProfile={() => setShowProfile(true)}
        onHome={() => setShowProfile(false)}
        onLogout={logout}
      />

      {showProfile ? (
        <Profile user={user} />
      ) : view === "menu" ? (
        // Correction ici : HomePage reçoit UN SEUL handler pour le choix de mode
        <HomePage
          pseudo={pseudo}
          onSelectMode={(mode) => {
            if (mode === "solo") setView("solo");
            else if (mode === "create") createLobby();
            else if (mode === "join") setView("join");
          }}
          onEditPseudo={() => {
            const nouveauPseudo = prompt("Nouveau pseudo ?");
            if (nouveauPseudo) {
              setPseudo(nouveauPseudo);
              localStorage.setItem("pseudo", nouveauPseudo);
            }
          }}
        />
      ) : view === "solo" ? (
        <QuizContainer />
      ) : view === "friends" ? (
        <FriendsPage user={user} />
      ) : view === "join" ? (
        pseudo ? (
          <JoinLobby
            key={`join-${pseudo}`}
            pseudo={pseudo}
            onBack={() => setView("menu")}
            onSuccess={handleJoinSuccess}
          />
        ) : (
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <p>Chargement du profil...</p>
            <button onClick={() => setView("menu")}>Retour</button>
          </div>
        )
      ) : view === "lobby" ? (
        <LobbyPage
          lobbyCode={lobbyCode}
          user={user}
          pseudo={pseudo}
          onExit={() => {
            setView("menu");
            setLobbyCode("");
          }}
        />
      ) : null}
    </div>
  );
}

export default App;