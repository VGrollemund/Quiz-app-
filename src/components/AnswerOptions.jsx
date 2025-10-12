// AnswerOptions.jsx
import React, { useState, useEffect } from "react";

function AnswerOptions({ options, answer, userAnswer, onAnswer, isLocked }) {
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setSelected(userAnswer || null);
  }, [userAnswer]);

  const handleClick = (opt) => {
    if (!isLocked) {
      setSelected(opt);
      onAnswer(opt);
    }
  };

  const getButtonStyle = (opt) => {
    if (!isLocked) {
      return {
        padding: "14px 20px",
        borderRadius: "10px",
        border: "2px solid #ccc",
        cursor: "pointer",
        background: selected === opt ? "#007bff" : "#f0f0f0",
        color: selected === opt ? "white" : "black",
        fontWeight: selected === opt ? "bold" : "normal",
        transform: selected === opt ? "scale(1.05)" : "scale(1)",
        transition: "all 0.2s ease-in-out",
      };
    }

    if (opt === answer) {
      return {
        background: "#28a745",
        color: "white",
        border: "2px solid #28a745",
        padding: "14px 20px",
        borderRadius: "10px",
      };
    } else if (opt === selected && selected !== answer) {
      return {
        background: "#dc3545",
        color: "white",
        border: "2px solid #dc3545",
        padding: "14px 20px",
        borderRadius: "10px",
      };
    } else {
      return {
        background: "#e0e0e0",
        color: "#555",
        border: "2px solid #ccc",
        padding: "14px 20px",
        borderRadius: "10px",
      };
    }
  };

  return (
    <div
      className="answer-options"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)", // 🔥 deux colonnes
        gap: "15px",
        width: "100%",
        maxWidth: "500px",
        marginTop: "15px",
      }}
    >
      {options.map((opt, i) => (
        <button
          key={i}
          onClick={() => handleClick(opt)}
          style={getButtonStyle(opt)}
          disabled={isLocked}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export default AnswerOptions;
