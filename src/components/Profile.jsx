import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

function Profile({ user }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    async function fetchUserData() {
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setUserData(snap.data());
      }
    }
    fetchUserData();
  }, [user.uid]);

  if (!userData) {
    return (
      <div style={{ color: "white", textAlign: "center", marginTop: "50px" }}>
        <p>Chargement du profil...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        color: "white",
        textAlign: "center",
        padding: "40px",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <h2 style={{ fontSize: "2rem", color: "#00aaff", marginBottom: "20px" }}>
        👤 Mon profil
      </h2>

      <img
        src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
        alt="Profil"
        style={{
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          border: "3px solid #00aaff",
          marginBottom: "20px",
        }}
      />

      <h3 style={{ marginBottom: "10px", color: "#fff" }}>
        {userData.username}
      </h3>
      {/* ✅ Affichage du tag utilisateur */}
      <p style={{ color: "#aaa", marginBottom: "20px" }}>
        Tag : <strong>{userData.userTag}</strong>
      </p>

      <div
        style={{
          backgroundColor: "rgba(255,255,255,0.1)",
          borderRadius: "12px",
          padding: "20px",
          maxWidth: "400px",
          margin: "0 auto",
          textAlign: "left",
        }}
      >
        <p>
          <strong>Email :</strong> {userData.email}
        </p>
        <p>
          <strong>Parties jouées :</strong> {userData.gamesPlayed || 0}
        </p>
        <p>
          <strong>Meilleur score :</strong> {userData.bestScore || 0}
        </p>
        <p>
          <strong>Score total :</strong> {userData.totalScore || 0}
        </p>
        <p>
          <strong>Précision :</strong> {userData.accuracy || 0}%
        </p>
      </div>
    </div>
  );
}

export default Profile;
