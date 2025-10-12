// PokemonUtils.js
// Gestion des questions Pokémon (image & son)
// Compatible avec TOUTES les générations (1–1010)

const TOTAL_POKEMON = 1010;

// Fonction utilitaire pour mélanger un tableau
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Génération de 10 questions Pokémon aléatoires
export async function generatePokemonQuestions(mode = "image") {
  const questions = [];
  const usedIds = new Set();

  while (questions.length < 10) {
    const randomId = Math.floor(Math.random() * TOTAL_POKEMON) + 1;
    if (usedIds.has(randomId)) continue;
    usedIds.add(randomId);

    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
      const data = await res.json();

      // Vérifier la présence d’un sprite
      const image =
        data.sprites.other?.["official-artwork"]?.front_default ||
        data.sprites.front_default;
      if (!image) continue;

      const name =
        data.name.charAt(0).toUpperCase() + data.name.slice(1).toLowerCase();

      // Créer les 3 mauvaises réponses
      const wrongAnswers = [];
      while (wrongAnswers.length < 3) {
        const wrongId = Math.floor(Math.random() * TOTAL_POKEMON) + 1;
        if (wrongId === randomId || usedIds.has(wrongId)) continue;
        try {
          const wrongRes = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${wrongId}`
          );
          const wrongData = await wrongRes.json();
          const wrongName =
            wrongData.name.charAt(0).toUpperCase() +
            wrongData.name.slice(1).toLowerCase();
          wrongAnswers.push(wrongName);
        } catch {
          // ignore erreur API
        }
      }

      const options = shuffle([name, ...wrongAnswers]);

      // 🔊 Détermination du son (pour le mode audio)
      const soundUrl = `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${randomId}.ogg`;

      // Vérification optionnelle du son (certains Pokémon n’ont pas de cri)
      if (mode === "sound") {
        try {
          const check = await fetch(soundUrl);
          if (!check.ok) continue; // si pas de son, on saute
        } catch {
          continue;
        }
      }

      // Création de la question
      const question =
        mode === "sound"
          ? {
              question: "Quel Pokémon fait ce cri ?",
              sound: soundUrl,
              options,
              answer: name,
            }
          : {
              question: "Quel est ce Pokémon ?",
              image,
              options,
              answer: name,
            };

      questions.push(question);
    } catch (err) {
      console.warn(`❌ Erreur API sur Pokémon #${randomId}`, err);
    }
  }

  return questions;
}
