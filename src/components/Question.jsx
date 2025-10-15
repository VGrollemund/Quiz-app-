// Question.jsx
import React, { useState, useEffect } from "react";
import AnswerOptions from "./AnswerOptions";

function Question({
  question,
  flag,
  options,
  answer,
  userAnswer,
  onAnswer,
  isLocked,
}) {
  const [feedback, setFeedback] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false); //  pour l'effet de fondu

  // Gestion du message de feedback (bonne/mauvaise réponse)
  useEffect(() => {
    if (isLocked && userAnswer) {
      if (userAnswer === answer) {
        setFeedback(" Bonne réponse !");
      } else {
        setFeedback(` Mauvaise réponse ! (Réponse correcte : ${answer})`);
      }
    } else {
      setFeedback("");
    }
  }, [isLocked, userAnswer, answer]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: "20px",
      }}
    >
      {/* Question */}
      <h2 style={{ fontSize: "1.5rem", color: "blue", fontWeight: "bold" }}>
        {question}
      </h2>

      {/*  On n'affiche l'image que si "flag" existe */}
      {flag && (
        <img
          src={flag}
          alt="Illustration"
          onLoad={() => setImageLoaded(true)} //  dès que l'image est chargée
          style={{
            width: "180px",
            height: "auto",
            border: "2px solid #fff",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(255,255,255,0.2)",
            opacity: imageLoaded ? 1 : 0,
            transform: imageLoaded ? "scale(1)" : "scale(0.9)",
            transition: "opacity 0.6s ease, transform 0.5s ease",
          }}
        />
      )}

      {/* Options de réponse */}
      <AnswerOptions
        options={options}
        answer={answer}
        userAnswer={userAnswer}
        onAnswer={onAnswer}
        isLocked={isLocked}
      />

      {/* Feedback */}
      {feedback && (
        <p
          style={{
            marginTop: "10px",
            fontSize: "1.1rem",
            fontWeight: "600",
            color: feedback.includes("Bonne") ? "#28a745" : "#dc3545",
            background: "rgba(255, 255, 255, 0.1)",
            padding: "8px 16px",
            borderRadius: "8px",
            transition: "all 0.3s ease-in-out",
          }}
        >
          {feedback}
        </p>
      )}
    </div>
  );
}

export default Question;
