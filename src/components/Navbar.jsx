import React from "react";

function Navbar({ user, onProfile, onHome, onLogout }) {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 25px",
        backgroundColor: "#007bff",
        color: "white",
        position: "fixed", // ✅ toujours visible en haut
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 1000, // ✅ au-dessus de tout le reste
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
      }}
    >
      <h2
        style={{
          cursor: "pointer",
          margin: 0,
          fontSize: "20px",
          fontWeight: "bold",
        }}
        onClick={onHome}
      >
        ROM-charrette-quiz
      </h2>

      {user && (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={onProfile}
            style={{
              backgroundColor: "white",
              color: "#4b0082",
              border: "none",
              padding: "8px 16px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#eee")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "white")}
          >
             Profil
          </button>

          <button
            onClick={onLogout}
            style={{
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#b02a37")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#dc3545")}
          >
             Déconnexion
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
