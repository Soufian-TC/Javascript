import readline from "readline";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const cartes = ["Europe", "Cirque", "Virus", "Crocodile", "Moutarde", "Roi", "Harry Potter", "Basketball"];
let pioche = [];
let joueurs = [];
let joueurActuelIndex = 0;
let motActuel = "";
let indices = {};

const poserQuestion = (question) => {
    return new Promise((resolve) => {
        rl.question(question, (reponse) => resolve(reponse.trim()));
    });
};

function melangerTableau(tableau) {
    for (let i = tableau.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tableau[i], tableau[j]] = [tableau[j], tableau[i]];
    }
    return tableau;
}

async function initialiserJeu(nombreJoueurs) {
    pioche = melangerTableau([...cartes]);
    joueurs = Array.from({ length: nombreJoueurs }, (_, i) => `Joueur ${i + 1}`);
    console.log("\nDébut du jeu avec :", joueurs);
    await commencerTour();
}

async function commencerTour() {
    if (pioche.length === 0) {
        console.log("\nFin de la partie !");
        rl.close();
        return;
    }

    motActuel = pioche.pop();
    indices = {};
    console.log(`\n${joueurs[joueurActuelIndex]} doit deviner le mot.`);
    console.log(`Les joueurs qui donnent des indices voient le mot : ${motActuel}`);

    await new Promise((resolve) => setTimeout(resolve, 5000));
    console.clear();

    await demanderIndices();
}

async function demanderIndices() {
    let joueursRestants = joueurs.filter((_, i) => i !== joueurActuelIndex);

    for (let joueur of joueursRestants) {
        let indice = await poserQuestion(`${joueur}, donnez un indice : `);
        indices[joueur] = indice.toLowerCase();
    }

    await devinerMot();
}

async function devinerMot() {
    let indicesValides = Object.values(indices);
    console.log(`\nIndices donnés : ${indicesValides.join(", ")}`);

    let proposition = await poserQuestion(`${joueurs[joueurActuelIndex]}, quel est le mot ? `);

    if (proposition.toLowerCase() === motActuel.toLowerCase()) {
        console.log("Bonne réponse !");
    } else {
        console.log(`Mauvaise réponse ! Le mot était : **${motActuel}**`);
    }

    await tourSuivant();
}

async function tourSuivant() {
    joueurActuelIndex = (joueurActuelIndex + 1) % joueurs.length;
    await commencerTour();
}

initialiserJeu(3);
