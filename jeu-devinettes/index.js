const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const cards = ["Europe", "Circus", "Virus", "Crocodile", "Moutarde", "Roi", "Harry Potter", "Basketball"];
let deck = [];
let players = [];
let currentPlayerIndex = 0;
let currentWord = "";
let clues = {};

function initGame(numPlayers) {
    deck = shuffleArray([...cards]);
    players = Array.from({ length: numPlayers }, (_, i) => `Joueur ${i + 1}`);
    console.log("\nDébut du jeu avec :", players);
    startTurn();
}

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

function startTurn() {
    if (deck.length === 0) {
        console.log("\nFin de la partie !");
        rl.close();
        return;
    }

    currentWord = deck.pop();
    clues = {};
    console.log(`\n${players[currentPlayerIndex]} doit deviner le mot.`);
    console.log(`Les joueurs qui donnent des indices voient le mot : ${currentWord}`);
    
    setTimeout(() => {
        console.clear();
        askClues();
    }, 5000); // Cache le mot après 5 secondes
}

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

function guessWord() {
    let validClues = Object.values(clues);
    console.log(`\nIndices donnés : ${validClues.join(", ")}`);
    rl.question(`${players[currentPlayerIndex]}, quel est le mot ? `, (guess) => {
        if (guess.trim().toLowerCase() === currentWord.toLowerCase()) {
            console.log("Bonne réponse !");
        } else {
            console.log(`Mauvaise réponse ! Le mot était : **${currentWord}**`);
        }
        nextTurn();
    });
}

function nextTurn() {
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    startTurn();
}

initGame(3);


