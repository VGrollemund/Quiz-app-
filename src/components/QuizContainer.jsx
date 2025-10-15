import React, { useState, useEffect, useCallback } from "react";
import Question from "./Question";
import ScoreDisplay from "./ScoreDisplay";
import QuizSettings from "./QuizSettings";
import ProgressBar from "./ProgressBar";
import MapClicker from "./MapClicker";
import PokemonTypeQuestion from "./PokemonTypeQuestion";
import { generatePokemonQuestions } from "../PokemonUtils";

// Mélanger les tableaux (Fisher–Yates)
function shuffle(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Calcul de distance (Haversine)
function calcDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Aide : test si catégorie = Pokémon Types
const isPokemonType = (cat) =>
  cat === "pokemon_types" || cat === "pokemontypes";

function QuizContainer({ settings: externalSettings }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(20);
  const [isAnswerLocked, setIsAnswerLocked] = useState(false);
  const [hasValidated, setHasValidated] = useState(false);
  const [settings, setSettings] = useState(null);

  // Démarrage automatique si on reçoit des paramètres depuis le salon
  useEffect(() => {
    if (externalSettings && !quizStarted) {
      setSettings(externalSettings);
      setQuizStarted(true);
    }
  }, [externalSettings, quizStarted]);

  // Validation de réponse
  const handleValidate = useCallback(() => {
    if (isPokemonType(settings?.category)) return;
    if (hasValidated) return;
    setHasValidated(true);
    setIsAnswerLocked(true);

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        const nextIndex = currentQuestionIndex + 1;
        if (settings.category === "geography") {
          setTimeRemaining(nextIndex % 3 === 2 ? 45 : 20);
        } else {
          setTimeRemaining(10);
        }
        setCurrentQuestionIndex(nextIndex);
        setIsAnswerLocked(false);
        setHasValidated(false);
      } else {
        setQuizCompleted(true);
      }
    }, 1000);
  }, [settings, hasValidated, currentQuestionIndex, questions.length]);

  // Timer
  useEffect(() => {
    if (!quizStarted || quizCompleted || isPokemonType(settings?.category))
      return;
    let timer;
    if (timeRemaining > 0) {
      timer = setTimeout(() => setTimeRemaining((t) => t - 1), 1000);
    } else if (timeRemaining === 0) {
      handleValidate();
    }
    return () => clearTimeout(timer);
  }, [quizStarted, quizCompleted, timeRemaining, settings, handleValidate]);

  // Chargement des questions
  useEffect(() => {
    async function fetchQuestions() {
      if (!quizStarted || !settings) return;
      setLoading(true);
      setError(null);

      try {
        // --- Pokémon image ou son ---
        if (
          settings.category === "pokemon" ||
          settings.category === "pokemon_sound" ||
          settings.category === "pokemonsound"
        ) {
          const mode = settings.category === "pokemon" ? "image" : "sound";
          const qs = await generatePokemonQuestions(mode);
          setQuestions(qs);
        }

        // --- Pokémon types ---
        else if (isPokemonType(settings.category)) {
          const TOTAL_POKEMON = 1010;
          const NB_QUESTIONS = 10;
          const selectedPokemons = [];
          const usedIds = new Set();

          while (selectedPokemons.length < NB_QUESTIONS) {
            const randomId = Math.floor(Math.random() * TOTAL_POKEMON) + 1;
            if (usedIds.has(randomId)) continue;
            usedIds.add(randomId);

            try {
              const res = await fetch(
                `https://pokeapi.co/api/v2/pokemon/${randomId}`
              );
              if (!res.ok) continue;
              const data = await res.json();
              const types = data.types.map((t) => t.type.name);
              selectedPokemons.push({
                id: randomId,
                name:
                  data.name.charAt(0).toUpperCase() + data.name.slice(1),
                image:
                  data.sprites.other?.["official-artwork"]?.front_default ||
                  data.sprites.front_default,
                types,
              });
            } catch (err) {
              console.error("Erreur Pokémon :", randomId, err);
            }
          }
          setQuestions(selectedPokemons);
          setCurrentQuestionIndex(0);
        }

        // --- Géographie ---
        else {
          const res = await fetch(
            "https://restcountries.com/v3.1/all?fields=name,capital,flags,region,latlng,independent,unMember"
          );
          if (!res.ok) throw new Error("Erreur API pays");
          const data = await res.json();

          const formatted = data
            .filter(
              (c) =>
                c.capital?.length > 0 &&
                c.flags &&
                c.name?.common &&
                c.latlng &&
                (c.independent === true || c.unMember === true)
            )
            .map((c) => ({
              question: "Quel est ce pays ?",
              flag: c.flags.png,
              options: [],
              answer: c.name.common,
              coords: c.latlng,
            }));

          formatted.forEach((q) => {
            const wrongAnswers = [];
            while (wrongAnswers.length < 3) {
              const randomCountry =
                formatted[Math.floor(Math.random() * formatted.length)];
              if (
                randomCountry.answer !== q.answer &&
                !wrongAnswers.includes(randomCountry.answer)
              ) {
                wrongAnswers.push(randomCountry.answer);
              }
            }
            q.options = shuffle([q.answer, ...wrongAnswers]);
          });

          setQuestions(shuffle(formatted).slice(0, 10));
        }
      } catch (err) {
        console.error("Erreur chargement :", err);
        setError("Impossible de charger les questions.");
      } finally {
        setLoading(false);
      }
    }

    fetchQuestions();
  }, [quizStarted, settings]);

  // Réponse utilisateur
  const handleAnswer = (answer) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setUserAnswers(newAnswers);
  };

  // Réinitialisation
  const handleRestart = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
    setQuestions([]);
    setUserAnswers([]);
    setCurrentQuestionIndex(0);
    setTimeRemaining(20);
    setIsAnswerLocked(false);
    setHasValidated(false);
    setSettings(null);
  };

  // Score
  const score = isPokemonType(settings?.category)
    ? userAnswers.filter((a) => a === "correct").length
    : userAnswers.filter(
        (ans, i) => ans === questions[i]?.answer
      ).length;

  // --- Rendu principal ---
  return (
    <div style={{ paddingTop: "80px", width: "100%" }}>
      {!quizStarted && !externalSettings ? (
        <QuizSettings
          onSave={(s) => {
            setSettings(s);
            setQuizStarted(true);
          }}
        />
      ) : loading ? (
        <div
          style={{
            width: "100%",
            minHeight: "60vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src="/loading.gif"
            alt="Chargement..."
            style={{ width: 140, marginBottom: 16 }}
          />
          <h3 style={{ color: "#ffcb05" }}>Chargement des questions...</h3>
        </div>
      ) : error ? (
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <p>{error}</p>
        </div>
      ) : quizCompleted ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minHeight: "70vh",
            justifyContent: "center",
          }}
        >
          <ScoreDisplay
            score={score}
            total={questions.length}
            onRestart={handleRestart}
          />
        </div>
      ) : isPokemonType(settings?.category) && questions.length > 0 ? (
        <div
          style={{
            width: "100%",
            maxWidth: 700,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minHeight: "70vh",
          }}
        >
          <ProgressBar
            current={currentQuestionIndex + 1}
            total={questions.length}
          />
          {currentQuestionIndex === 0 && (
            <h3 style={{ color: "#ffcb05" }}>
              Trouve le type de 10 Pokémon !
            </h3>
          )}
          <PokemonTypeQuestion
            pokemon={questions[currentQuestionIndex]}
            onValidate={(ok) => {
              const newAnswers = [...userAnswers];
              newAnswers[currentQuestionIndex] = ok ? "correct" : "wrong";
              setUserAnswers(newAnswers);
              if (currentQuestionIndex < questions.length - 1) {
                setTimeout(
                  () => setCurrentQuestionIndex(currentQuestionIndex + 1),
                  1000
                );
              } else {
                setQuizCompleted(true);
              }
            }}
          />
          <p style={{ color: "white", marginTop: "10px" }}>
            {currentQuestionIndex + 1} / {questions.length}
          </p>
        </div>
      ) : questions.length > 0 ? (
        <div
          style={{
            width: "100%",
            maxWidth: 700,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minHeight: "70vh",
          }}
        >
          <ProgressBar
            current={currentQuestionIndex + 1}
            total={questions.length}
          />

          {/* Chronomètre visible sauf pour Pokémon Types */}
          {!isPokemonType(settings?.category) && (
            <p style={{ color: "black", fontWeight: "bold" }}>
               Temps restant : {timeRemaining}s
            </p>
          )}

          {/* --- Catégorie GÉOGRAPHIE --- */}
          {settings.category === "geography" && (
            <>
              {currentQuestionIndex % 3 === 2 ? (
                <>
                  <h3 style={{ color: "black" }}>
                     Cliquez sur la carte pour localiser :
                    <br />
                    <span style={{ color: "black" }}>
                      {questions[currentQuestionIndex].answer}
                    </span>
                  </h3>
                  <MapClicker
                    onSelect={(latlng) => {
                      const correctCoords =
                        questions[currentQuestionIndex].coords;
                      const distance = calcDistance(
                        latlng.lat,
                        latlng.lng,
                        correctCoords[0],
                        correctCoords[1]
                      );
                      const isCorrect = distance < 800;
                      handleAnswer(
                        isCorrect
                          ? questions[currentQuestionIndex].answer
                          : " Mauvais endroit"
                      );
                    }}
                  />
                </>
              ) : (
                <Question
                  question={questions[currentQuestionIndex].question}
                  flag={questions[currentQuestionIndex].flag}
                  options={questions[currentQuestionIndex].options}
                  answer={questions[currentQuestionIndex].answer}
                  userAnswer={userAnswers[currentQuestionIndex]}
                  onAnswer={handleAnswer}
                  isLocked={isAnswerLocked}
                />
              )}
            </>
          )}

          {/* --- Catégories Pokémon image / son --- */}
          {(settings.category === "pokemon" ||
            settings.category === "pokemon_sound" ||
            settings.category === "pokemonsound") && (
            <>
              <h3 style={{ color: "black", marginTop: 20 }}>
                {questions[currentQuestionIndex].question}
              </h3>
              {settings.category === "pokemon" && (
                <img
                  src={questions[currentQuestionIndex].image}
                  alt="pokemon"
                  style={{ width: "150px", margin: "10px auto" }}
                />
              )}
              {(settings.category === "pokemon_sound" ||
                settings.category === "pokemonsound") && (
                <button
                  onClick={() =>
                    new Audio(questions[currentQuestionIndex].sound).play()
                  }
                  style={{
                    padding: "12px 24px",
                    borderRadius: "10px",
                    border: "none",
                    backgroundColor: "#ffcb05",
                    color: "black",
                    fontWeight: "bold",
                    cursor: "pointer",
                    marginBottom: "16px",
                  }}
                >
                   Écouter le cri
                </button>
              )}
              <Question
                question={questions[currentQuestionIndex].question}
                options={questions[currentQuestionIndex].options}
                answer={questions[currentQuestionIndex].answer}
                userAnswer={userAnswers[currentQuestionIndex]}
                onAnswer={handleAnswer}
                isLocked={isAnswerLocked}
              />
            </>
          )}

          {/* --- Bouton Valider --- */}
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "30px",
            }}
          >
            <button
              onClick={handleValidate}
              disabled={!userAnswers[currentQuestionIndex] || isAnswerLocked}
              style={{
                padding: "14px 40px",
                borderRadius: "10px",
                border: "none",
                cursor:
                  !userAnswers[currentQuestionIndex] || isAnswerLocked
                    ? "not-allowed"
                    : "pointer",
                backgroundColor:
                  !userAnswers[currentQuestionIndex] || isAnswerLocked
                    ? "#999"
                    : "#007bff",
                color: "white",
                fontWeight: "bold",
                fontSize: "18px",
              }}
            >
              Valider
            </button>
          </div>
        </div>
      ) : (
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <p>Aucune question disponible.</p>
        </div>
      )}
    </div>
  );
}

export default QuizContainer;

