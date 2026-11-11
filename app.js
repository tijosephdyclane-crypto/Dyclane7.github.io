let questions = [];
let currentIndex = 0;
let score = 0;
let canClick = true;

// Récupération du meilleur score via localStorage
let bestScore = localStorage.getItem("geoguyane_best_score") || 0;
document.getElementById("best-score").textContent = bestScore;

// Éléments du DOM
const svgMap = document.getElementById("guyane-map");
const playerMarker = document.getElementById("player-marker");
const targetMarker = document.getElementById("target-marker");
const distanceLine = document.getElementById("distance-line");
const targetNameEl = document.getElementById("target-name");
const categoryBadgeEl = document.getElementById("category-badge");
const feedbackBox = document.getElementById("feedback-box");
const feedbackText = document.getElementById("feedback-text");
const anecdoteText = document.getElementById("anecdote-text");
const scoreEl = document.getElementById("score");

// Initialisation ou redémarrage de la partie
function initGame() {
    // Mélange aléatoire des lieux
    questions = [...LIEUX_GUYANE].sort(() => Math.random() - 0.5);
    currentIndex = 0;
    score = 0;
    scoreEl.textContent = score;
    
    document.getElementById("end-box").classList.add("hidden");
    document.getElementById("question-box").classList.remove("hidden");
    loadQuestion();
}

function loadQuestion() {
    canClick = true;
    const currentLieu = questions[currentIndex];
    targetNameEl.textContent = currentLieu.nom;
    categoryBadgeEl.textContent = currentLieu.categorie;
    
    // Masquer les marqueurs précédents
    feedbackBox.classList.add("hidden");
    playerMarker.classList.add("hidden");
    targetMarker.classList.add("hidden");
    distanceLine.classList.add("hidden");
}

// Gestion du clic sur la carte SVG
svgMap.addEventListener("click", (event) => {
    if (!canClick) return;
    canClick = false;

    // Conversion des coordonnées écran vers le repère du SVG (500x550)
    const rect = svgMap.getBoundingClientRect();
    const clickX = ((event.clientX - rect.left) / rect.width) * 500;
    const clickY = ((event.clientY - rect.top) / rect.height) * 550;

    const currentLieu = questions[currentIndex];

    // Calcul de la distance (Théorème de Pythagore) + conversion approximative en km
    const dx = clickX - currentLieu.x;
    const dy = clickY - currentLieu.y;
    const pixelDistance = Math.sqrt(dx * dx + dy * dy);
    const kmDistance = Math.round(pixelDistance * 1.15);

    // Attribution des points (Max 1000 pts par question)
    const pointsEarned = Math.max(0, Math.round(1000 - kmDistance * 4));
    score += pointsEarned;
    scoreEl.textContent = score;

    // Affichage visuel sur la carte
    playerMarker.setAttribute("cx", clickX);
    playerMarker.setAttribute("cy", clickY);
    playerMarker.classList.remove("hidden");

    targetMarker.setAttribute("cx", currentLieu.x);
    targetMarker.setAttribute("cy", currentLieu.y);
    targetMarker.classList.remove("hidden");

    distanceLine.setAttribute("x1", clickX);
    distanceLine.setAttribute("y1", clickY);
    distanceLine.setAttribute("x2", currentLieu.x);
    distanceLine.setAttribute("y2", currentLieu.y);
    distanceLine.classList.remove("hidden");

    // Affichage du résultat
    feedbackText.innerHTML = `Vous êtes à <strong>${kmDistance} km</strong> de ${currentLieu.nom} (+${pointsEarned} pts) !`;
    anecdoteText.textContent = currentLieu.anecdote;
    feedbackBox.classList.remove("hidden");
});

// Bouton question suivante
document.getElementById("next-btn").addEventListener("click", () => {
    currentIndex++;
    if (currentIndex < questions.length) {
        loadQuestion();
    } else {
        endGame();
    }
});

// Fin de partie et sauvegarde localStorage
function endGame() {
    document.getElementById("question-box").classList.add("hidden");
    feedbackBox.classList.add("hidden");
    document.getElementById("end-box").classList.remove("hidden");

    let message = `Votre score final est de ${score} / ${questions.length * 1000} points.`;
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem("geoguyane_best_score", bestScore);
        document.getElementById("best-score").textContent = bestScore;
        message += " Nouveau record enregistré ! 🏆";
    }
    document.getElementById("final-summary").textContent = message;
}

document.getElementById("restart-btn").addEventListener("click", initGame);

// Lancement au chargement
initGame();
