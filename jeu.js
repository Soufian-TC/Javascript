const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Liste des mots à deviner
const cards = ["Europe", "Circus", "Virus", "Crocodile", "Moutarde", "Roi"];
let deck = [];
let players = [];
let currentPlayerIndex = 0;
let currentWord = "";
let clues = {};

/**
 * Initialise le jeu avec un certain nombre de joueurs
 */
function initGame(numPlayers) {
    deck = shuffleArray([...cards]); // Mélange les cartes
    players = Array.from({ length: numPlayers }, (_, i) => `Joueur ${i + 1}`);
    console.log("\n🎮 Début du jeu avec :", players);
    startTurn();
}

/**
 * Mélange un tableau
 */
function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

/**
 * Démarre un tour
 */
function startTurn() {
    if (deck.length === 0) {
        console.log("\n🏁 Fin de la partie !");
        rl.close();
        return;
    }

    currentWord = deck.pop(); // Pioche une carte
    clues = {}; // Réinitialise les indices

    console.log(`\n🔹 ${players[currentPlayerIndex]} doit deviner le mot.`);
    console.log(`📢 Le mot mystère est : **${currentWord}** (caché du joueur actif)`);

    rl.question("🔒 Appuyez sur Entrée pour continuer...", () => {
        console.clear();
        askClues();
    });
}

/**
 * Demande un indice à chaque joueur (sauf le joueur actif)
 */
function askClues() {
    let remainingPlayers = players.filter((_, i) => i !== currentPlayerIndex);
    let count = 0;

    function askNext() {
        if (count < remainingPlayers.length) {
            rl.question(`${remainingPlayers[count]}, donnez un indice : `, (clue) => {
                clues[remainingPlayers[count]] = clue.trim().toLowerCase();
                count++;
                askNext();
            });
        } else {
            guessWord();
        }
    }

    askNext();
}

/**
 * Demande au joueur actif de deviner le mot
 */
function guessWord() {
    let validClues = Object.values(clues);

    console.log(`\n💡 Indices donnés : ${validClues.join(", ")}`);
    rl.question(`${players[currentPlayerIndex]}, quel est le mot ? `, (guess) => {
        if (guess.trim().toLowerCase() === currentWord.toLowerCase()) {
            console.log("🎉 Bonne réponse !");
        } else {
            console.log(`❌ Mauvaise réponse ! Le mot était : **${currentWord}**`);
        }

        nextTurn();
    });
}

/**
 * Passe au joueur suivant
 */
function nextTurn() {
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    startTurn();
}

// Lancer le jeu avec 3 joueurs
initGame(3);
