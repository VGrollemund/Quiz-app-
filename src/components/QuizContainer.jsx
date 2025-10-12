import React, { useState, useEffect } from "react";
import Question from "./Question";
import ScoreDisplay from "./ScoreDisplay";
import QuizSettings from "./QuizSettings";
import ProgressBar from "./ProgressBar";
import MapClicker from "./MapClicker";
import PokemonTypeQuestion from "./PokemonTypeQuestion";
import { generatePokemonQuestions } from "../PokemonUtils";

// Mélanger les tableaux
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Calcul de distance (formule de Haversine)
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

  // 🔁 Démarrage automatique si on reçoit des paramètres depuis le salon
  useEffect(() => {
    if (externalSettings && !quizStarted) {
      setSettings(externalSettings);
      setQuizStarted(true);
    }
  }, [externalSettings, quizStarted]);

  // 🕓 Timer
  useEffect(() => {
    if (!quizStarted || quizCompleted || settings?.category === "pokemon_types") return;

    let timer;
    if (timeRemaining > 0) {
      timer = setTimeout(() => setTimeRemaining((t) => t - 1), 1000);
    } else if (timeRemaining === 0) {
      handleValidate();
    }
    return () => clearTimeout(timer);
  }, [quizStarted, quizCompleted, timeRemaining, settings]);

  // 📥 Chargement des questions selon la catégorie
  useEffect(() => {
    async function fetchQuestions() {
      if (!quizStarted || !settings) return;
      setLoading(true);

      try {
        // --- Pokémon image ou son ---
        if (settings.category === "pokemon" || settings.category === "pokemon_sound") {
          const mode = settings.category === "pokemon" ? "image" : "sound";
          const qs = await generatePokemonQuestions(mode);
          setQuestions(qs);
        }

        // --- Pokémon types ---
        else if (settings.category === "pokemon_types") {
          const TOTAL_POKEMON = 1010;
          const NB_QUESTIONS = 10;
          const selectedPokemons = [];
          const usedIds = new Set();

          while (selectedPokemons.length < NB_QUESTIONS) {
            const randomId = Math.floor(Math.random() * TOTAL_POKEMON) + 1;
            if (usedIds.has(randomId)) continue;
            usedIds.add(randomId);

            try {
              const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
              const data = await res.json();
              const types = data.types.map((t) => t.type.name);
              selectedPokemons.push({
                id: randomId,
                name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
                image:
                  data.sprites.other?.["official-artwork"]?.front_default ||
                  data.sprites.front_default,
                types,
              });
            } catch (err) {
              console.warn("Erreur Pokémon", randomId, err);
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
            let wrongAnswers = [];
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
        console.error("Erreur API :", err);
        setError("Impossible de charger les questions.");
      } finally {
        setLoading(false);
      }
    }

    fetchQuestions();
  }, [quizStarted, settings]);

  // 🧠 Réponse utilisateur
  const handleAnswer = (answer) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setUserAnswers(newAnswers);
  };

  // ✅ Validation
  const handleValidate = () => {
    if (settings?.category === "pokemon_types") return;

    if (hasValidated) return;
    setHasValidated(true);
    setIsAnswerLocked(true);

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        const nextIndex = currentQuestionIndex + 1;

        // Temps variable pour géo
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
  };

  // 🔁 Réinitialisation
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

  // 🧮 Score
  const score =
    settings?.category === "pokemon_types"
      ? userAnswers.filter((a) => a === "correct").length
      : userAnswers.filter((ans, i) => ans === questions[i]?.answer).length;

  // 🎨 Rendu
  return (
    <div>
      {/* Affichage du paramétrage uniquement si pas de paramètres externes */}
      {!quizStarted && !externalSettings ? (
        <QuizSettings onStart={(s) => { setSettings(s); setQuizStarted(true); }} />
      ) : loading ? (
        <p>Chargement des questions...</p>
      ) : error ? (
        <p>{error}</p>
      ) : quizCompleted ? (
        <ScoreDisplay
          score={score}
          total={questions.length}
          onRestart={handleRestart}
        />
      ) : settings?.category === "pokemon_types" && questions.length > 0 ? (
        <div style={{ textAlign: "center" }}>
          <ProgressBar
            current={currentQuestionIndex + 1}
            total={questions.length}
          />

          {currentQuestionIndex === 0 && (
            <h3 style={{ color: "#ffcb05" }}>
              🧠 Trouve le type de 10 Pokémon !
            </h3>
          )}

          <PokemonTypeQuestion
            pokemon={questions[currentQuestionIndex]}
            onValidate={(ok) => {
              const newAnswers = [...userAnswers];
              newAnswers[currentQuestionIndex] = ok ? "correct" : "wrong";
              setUserAnswers(newAnswers);

              if (currentQuestionIndex < questions.length - 1) {
                setTimeout(() => {
                  setCurrentQuestionIndex(currentQuestionIndex + 1);
                }, 1000);
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
        <div style={{ textAlign: "center" }}>
          <ProgressBar
            current={currentQuestionIndex + 1}
            total={questions.length}
          />

          {settings.category !== "pokemon_types" && (
            <p style={{ color: "white", fontWeight: "bold" }}>
              ⏳ Temps restant : {timeRemaining}s
            </p>
          )}

          {settings.category === "pokemon" && (
            <>
              <h3 style={{ color: "white" }}>
                {questions[currentQuestionIndex].question}
              </h3>
              <img
                src={questions[currentQuestionIndex].image}
                alt="pokemon"
                style={{ width: "150px", margin: "10px auto" }}
              />
            </>
          )}

          {settings.category === "pokemon_sound" && (
            <>
              <h3 style={{ color: "white" }}>
                {questions[currentQuestionIndex].question}
              </h3>
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
                  marginBottom: "15px",
                }}
              >
                🔊 Écouter le cri
              </button>
            </>
          )}

          {settings.category === "geography" &&
            (currentQuestionIndex % 3 === 2 ? (
              <>
                <h3 style={{ color: "white" }}>
                  📍 Cliquez sur la carte pour localiser :
                  <br />
                  <span style={{ color: "yellow" }}>
                    {questions[currentQuestionIndex].answer}
                  </span>
                </h3>

                <MapClicker
                  onSelect={(latlng) => {
                    const correctCoords = questions[currentQuestionIndex].coords;
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
                        : "❌ Mauvais endroit"
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
            ))}

          {(settings.category === "pokemon" ||
            settings.category === "pokemon_sound") && (
            <Question
              question={questions[currentQuestionIndex].question}
              options={questions[currentQuestionIndex].options}
              answer={questions[currentQuestionIndex].answer}
              userAnswer={userAnswers[currentQuestionIndex]}
              onAnswer={handleAnswer}
              isLocked={isAnswerLocked}
            />
          )}

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
        <p>Aucune question disponible.</p>
      )}
    </div>
  );
}

export default QuizContainer;


