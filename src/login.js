import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; // <- ton fichier config Firebase
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      Swal.fire("Oops...", "Veuillez remplir tous les champs", "error");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      Swal.fire("Succès ✅", "Connexion réussie", "success");
      localStorage.setItem("isAuthenticated", true);
      navigate("/home"); // redirige vers la page d’accueil/quiz
    } catch (error) {
      Swal.fire("Erreur ❌", error.message, "error");
    }
  };

  return (
    <div className="login">
      <h2>Connexion</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Se connecter</button>
      </form>

      <p>
        Pas encore de compte ? <Link to="/register">S’inscrire</Link>
      </p>
      <p>
        Admin ? <Link to="/adminLogin">Accéder au panneau admin</Link>
      </p>
    </div>
  );
}

export default Login;
