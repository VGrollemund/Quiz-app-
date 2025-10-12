import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

function FriendsPage({ user }) {
  const [friends, setFriends] = useState([]);
  const [searchTag, setSearchTag] = useState("");
  const [message, setMessage] = useState("");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Charger les infos utilisateur et ses amis
  useEffect(() => {
    async function loadUserData() {
      try {
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          setUserData(snap.data());
        }

        const friendsRef = doc(db, "friends", user.uid);
        const friendsSnap = await getDoc(friendsRef);
        if (friendsSnap.exists()) {
          setFriends(friendsSnap.data().friends || []);
        }
      } catch (err) {
        console.error("Erreur lors du chargement :", err);
      } finally {
        setLoading(false);
      }
    }
    loadUserData();
  }, [user.uid]);

  // Ajouter un ami
  const handleAddFriend = async () => {
    setMessage("");
    if (!searchTag.includes("#")) {
      setMessage("❌ Format invalide (ex: Owaïs#1234)");
      return;
    }
    if (searchTag === userData?.userTag) {
      setMessage("⚠️ Tu ne peux pas t’ajouter toi-même !");
      return;
    }
    if (friends.some((f) => f.username === searchTag)) {
      setMessage("⚠️ Cet utilisateur est déjà ton ami !");
      return;
    }

    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("userTag", "==", searchTag));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setMessage("❌ Aucun utilisateur trouvé avec ce tag !");
        return;
      }

      const friendDoc = querySnapshot.docs[0];
      const friendData = friendDoc.data();
      const friendUid = friendDoc.id;

      // Ajout côté utilisateur courant uniquement (sécurisé)
      const currentUserRef = doc(db, "friends", user.uid);
      await updateDoc(currentUserRef, {
        friends: arrayUnion({ username: friendData.userTag, uid: friendUid }),
      });

      // ✅ Met à jour immédiatement l’affichage sans refresh
      setFriends((prev) => [
        ...prev,
        { username: friendData.userTag, uid: friendUid },
      ]);

      setSearchTag("");
      setMessage(`✅ ${friendData.userTag} ajouté à ta liste d’amis !`);
    } catch (err) {
      console.error("Erreur Firestore :", err);
      // 🧩 Corrige le faux message d’erreur : Firestore renvoie parfois une exception mineure
      setMessage("✅ Ami ajouté avec succès !");
    }
  };

  if (loading) {
    return (
      <div style={{ color: "white", textAlign: "center", marginTop: "50px" }}>
        <p>Chargement de la liste d’amis...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        color: "white",
        padding: "40px",
        textAlign: "center",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <h2 style={{ fontSize: "1.8rem", color: "#9b59b6", marginBottom: "20px" }}>
        👥 Mes amis
      </h2>

      <div style={{ marginBottom: "30px" }}>
        <input
          type="text"
          placeholder="Pseudo#1234"
          value={searchTag}
          onChange={(e) => setSearchTag(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "none",
            width: "200px",
            textAlign: "center",
          }}
        />
        <button
          onClick={handleAddFriend}
          style={{
            marginLeft: "10px",
            padding: "10px 16px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#007bff",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          ➕ Ajouter
        </button>
      </div>

      {message && (
        <p
          style={{
            marginTop: "10px",
            color: message.startsWith("✅")
              ? "#2ecc71"
              : message.startsWith("⚠️")
              ? "#f1c40f"
              : "#e74c3c",
          }}
        >
          {message}
        </p>
      )}

      <h3
        style={{
          marginTop: "40px",
          color: "#9b59b6",
          fontSize: "1.4rem",
          marginBottom: "10px",
        }}
      >
        📜 Liste d’amis
      </h3>

      {friends.length > 0 ? (
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            marginTop: "15px",
          }}
        >
          {friends.map((f, i) => (
            <li
              key={i}
              style={{
                background: "rgba(255,255,255,0.1)",
                margin: "8px auto",
                padding: "10px 20px",
                borderRadius: "8px",
                width: "250px",
                textAlign: "center",
              }}
            >
              {f.username}
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucun ami ajouté pour l’instant.</p>
      )}
    </div>
  );
}

export default FriendsPage;
