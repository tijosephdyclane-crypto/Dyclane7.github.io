let questions = [];
let currentIndex = 0;
let score = 0;
let canClick = true;
let activeMode = null;
let bestScore = 0;
let attemptsUsed = 0;

const MAX_COMMUNE_GUESSES = 3;
const NEAR_COMMUNE_DISTANCE_METERS = 50000;
const COMMUNE_QUESTION_COUNT = 10;

const modeQuestions = {
    communes: COMMUNES_GUYANE,
    emblematiques: LIEUX_EMBLEMATIQUES_GUYANE
};

function getBestScore(mode) {
    const savedScore = localStorage.getItem(`geoguyane_best_score_${mode}`);
    if (savedScore !== null) return Number(savedScore);
    return mode === "communes"
        ? Number(localStorage.getItem("geoguyane_best_score") || 0)
        : 0;
}

function chooseMode(mode) {
    activeMode = mode;
    bestScore = getBestScore(mode);
    document.querySelector("main").classList.remove("pre-game");
    document.getElementById("best-score").textContent = bestScore;
    document.getElementById("scoreboard").classList.remove("hidden");
    document.getElementById("mode-box").classList.add("hidden");
    document.getElementById("end-box").classList.add("hidden");
    document.getElementById("question-box").classList.remove("hidden");
    document.getElementById("map-container").classList.remove("hidden");
    map.invalidateSize();
    initGame();
}

// Initialisation de la carte centrée sur la Guyane
const map = L.map('map', {
    center: [3.95, -53.15],
    zoom: 7,
    minZoom: 6,
    maxZoom: 11,
    attributionControl: false,
    maxBounds: [[1.8, -55.0], [6.2, -51.0]],
    maxBoundsViscosity: 1.0
});

// Fond de carte limité visuellement à la Guyane, sans noms de lieux
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: '',
    maxZoom: 18,
    noWrap: true
}).addTo(map);

// Contour précis du territoire guyanais
L.geoJSON(GUYANE_BOUNDARY, {
    style: {
        color: '#ffffff',
        weight: 2.5,
        opacity: 1,
        fillColor: '#ffffff',
        fillOpacity: 0.05
    }
}).addTo(map);

fetch("guyane.geojson")
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
    })
    .then(communeBoundaries => {
        L.geoJSON(communeBoundaries, {
            style: {
                color: '#ffd166',
                weight: 1.5,
                opacity: 0.95,
                fillOpacity: 0
            },
            interactive: false
        }).addTo(map);
    })
    .catch(error => {
        console.error("Impossible de charger les limites des communes de Guyane.", error);
    });

// Calque pour stocker les marqueurs et lignes du tour en cours
let roundLayer = L.layerGroup().addTo(map);

function initGame() {
    const shuffledQuestions = [...modeQuestions[activeMode]].sort(() => Math.random() - 0.5);
    questions = activeMode === "communes"
        ? shuffledQuestions.slice(0, COMMUNE_QUESTION_COUNT)
        : shuffledQuestions;
    currentIndex = 0;
    score = 0;
    document.getElementById("score").textContent = score;
    document.getElementById("progress").textContent = `1/${questions.length}`;
    
    document.getElementById("end-box").classList.add("hidden");
    document.getElementById("question-box").classList.remove("hidden");
    loadQuestion();
}

function loadQuestion() {
    canClick = true;
    attemptsUsed = 0;
    roundLayer.clearLayers();
    
    const currentLieu = questions[currentIndex];
    document.getElementById("progress").textContent = `${currentIndex + 1}/${questions.length}`;
    document.getElementById("target-name").textContent = currentLieu.nom;
    document.getElementById("category-badge").textContent = currentLieu.categorie;
    document.getElementById("target-hint").textContent = activeMode === "emblematiques"
        ? "Trouvez la commune où se trouve ce lieu. Quitter la page fait échouer la question."
        : "Cliquez sur la carte là où vous pensez que ce lieu se situe. Quitter la page fait échouer la question.";
    document.getElementById("feedback-box").classList.add("hidden");
    hideLieuImage();
    const guessBox = document.getElementById("commune-guess-box");
    guessBox.classList.toggle("hidden", activeMode !== "emblematiques");
    document.getElementById("commune-guess").value = "";
    document.getElementById("guess-attempts").textContent = `Il vous reste ${MAX_COMMUNE_GUESSES} essais.`;
    document.getElementById("guess-feedback").textContent = "";
}

// Gestion du clic sur la vraie carte
map.on('click', function(e) {
    if (!canClick || activeMode !== "communes") return;
    canClick = false;

    const currentLieu = questions[currentIndex];
    const playerLatLng = e.latlng;
    const targetLatLng = L.latLng(currentLieu.lat, currentLieu.lng);

    // Calcul de la vraie distance géographique
    const distanceMeters = playerLatLng.distanceTo(targetLatLng);
    const kmDistance = Math.round(distanceMeters / 1000);

    // Attribution des points
    const pointsEarned = Math.max(0, Math.round(1000 - kmDistance * 4));
    score += pointsEarned;
    document.getElementById("score").textContent = score;

    // Marqueur rouge = clic du joueur
    L.circleMarker(playerLatLng, {
        color: '#ffffff',
        fillColor: '#e63946',
        fillOpacity: 1,
        radius: 8,
        weight: 2
    }).addTo(roundLayer).bindPopup("Votre choix").openPopup();

    // Marqueur vert = bonne réponse
    L.circleMarker(targetLatLng, {
        color: '#ffffff',
        fillColor: '#2d6a4f',
        fillOpacity: 1,
        radius: 9,
        weight: 2
    }).addTo(roundLayer).bindPopup(`<strong>${currentLieu.nom}</strong>`);

    // Ligne pointillée entre les deux points
    L.polyline([playerLatLng, targetLatLng], {
        color: '#e63946',
        weight: 3,
        dashArray: '6, 8'
    }).addTo(roundLayer);

    showLieuImage(currentLieu);

    // Affichage du résultat
    document.getElementById("feedback-text").innerHTML = 
        `Vous êtes à <strong>${kmDistance} km</strong> de ${currentLieu.nom} (+${pointsEarned} pts) !`;
    document.getElementById("anecdote-text").textContent = currentLieu.anecdote;
    document.getElementById("feedback-box").classList.remove("hidden");
});

function normalizeCommuneName(name) {
    return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function hideLieuImage() {
    const imgElement = document.getElementById("lieu-image");
    imgElement.removeAttribute("src");
    imgElement.alt = "";
    imgElement.classList.add("hidden");
}

function showLieuImage(lieu) {
    const imgElement = document.getElementById("lieu-image");
    if (!lieu.image) {
        hideLieuImage();
        return;
    }

    imgElement.src = lieu.image;
    imgElement.alt = `Photo de ${lieu.nom}`;
    imgElement.classList.remove("hidden");
}

function showLieuDetails(lieu) {
    showLieuImage(lieu);
    document.getElementById("anecdote-text").textContent = lieu.anecdote;
    document.getElementById("feedback-box").classList.remove("hidden");
}

function revealLandmarkLocation(lieu) {
    const targetLatLng = L.latLng(lieu.lat, lieu.lng);
    L.circleMarker(targetLatLng, {
        color: '#ffffff',
        fillColor: '#2d6a4f',
        fillOpacity: 1,
        radius: 9,
        weight: 2
    }).addTo(roundLayer);
}

function failCurrentQuestion() {
    if (!activeMode || !canClick) return;

    canClick = false;
    const currentLieu = questions[currentIndex];
    revealLandmarkLocation(currentLieu);
    document.getElementById("feedback-text").textContent = activeMode === "communes"
        ? `Question échouée : vous avez quitté la page. ${currentLieu.nom} est indiqué sur la carte.`
        : `Question échouée : vous avez quitté la page. ${currentLieu.nom} se trouve à ${currentLieu.commune}.`;
    if (activeMode === "emblematiques") {
        document.getElementById("commune-guess-box").classList.add("hidden");
    }
    showLieuDetails(currentLieu);
}

document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
        failCurrentQuestion();
    }
});

document.getElementById("commune-guess-box").addEventListener("submit", event => {
    event.preventDefault();
    if (activeMode !== "emblematiques" || !canClick) return;

    const input = document.getElementById("commune-guess");
    const guessedCommune = COMMUNES_GUYANE.find(commune =>
        normalizeCommuneName(commune.nom) === normalizeCommuneName(input.value.trim())
    );
    const feedback = document.getElementById("guess-feedback");
    if (!guessedCommune) {
        feedback.textContent = "Choisissez une commune proposée dans la liste.";
        input.focus();
        return;
    }

    const currentLieu = questions[currentIndex];
    showLieuImage(currentLieu);
    attemptsUsed++;
    const correct = normalizeCommuneName(guessedCommune.nom) === normalizeCommuneName(currentLieu.commune);
    if (correct) {
        canClick = false;
        const pointsEarned = 1000 - (attemptsUsed - 1) * 250;
        score += pointsEarned;
        document.getElementById("score").textContent = score;
        document.getElementById("feedback-text").innerHTML =
            `Bonne réponse ! ${currentLieu.nom} se trouve à ${currentLieu.commune}. (+${pointsEarned} pts)`;
        document.getElementById("commune-guess-box").classList.add("hidden");
        revealLandmarkLocation(currentLieu);
        showLieuDetails(currentLieu);
        return;
    }

    const targetCommune = COMMUNES_GUYANE.find(commune =>
        normalizeCommuneName(commune.nom) === normalizeCommuneName(currentLieu.commune)
    );
    const distanceMeters = L.latLng(guessedCommune.lat, guessedCommune.lng)
        .distanceTo(L.latLng(targetCommune.lat, targetCommune.lng));
    const proximityMessage = distanceMeters <= NEAR_COMMUNE_DISTANCE_METERS
        ? "La commune choisie est proche."
        : "La commune choisie est loin.";

    if (attemptsUsed < MAX_COMMUNE_GUESSES) {
        const remaining = MAX_COMMUNE_GUESSES - attemptsUsed;
        feedback.textContent = `Ce n'est pas la bonne commune. ${proximityMessage} Il vous reste ${remaining} essais.`;
        document.getElementById("guess-attempts").textContent = `${remaining} essais restants.`;
        input.value = "";
        input.focus();
        return;
    }

    canClick = false;
    document.getElementById("feedback-text").textContent =
        `Ce n'est pas la bonne commune. ${proximityMessage} Les 3 essais sont utilisés : ${currentLieu.nom} se trouve à ${currentLieu.commune}.`;
    document.getElementById("commune-guess-box").classList.add("hidden");
    revealLandmarkLocation(currentLieu);
    showLieuDetails(currentLieu);
});

document.getElementById("next-btn").addEventListener("click", () => {
    currentIndex++;
    if (currentIndex < questions.length) {
        loadQuestion();
    } else {
        endGame();
    }
});

function endGame() {
    roundLayer.clearLayers();
    document.getElementById("question-box").classList.add("hidden");
    document.getElementById("feedback-box").classList.add("hidden");
    document.getElementById("end-box").classList.remove("hidden");

    let message = `Score final : ${score} / ${questions.length * 1000} points.`;
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem(`geoguyane_best_score_${activeMode}`, bestScore);
        if (activeMode === "communes") {
            localStorage.setItem("geoguyane_best_score", bestScore);
        }
        document.getElementById("best-score").textContent = bestScore;
        message += " Nouveau record enregistré ! 🏆";
    }
    document.getElementById("final-summary").textContent = message;
}

document.getElementById("restart-btn").addEventListener("click", initGame);
document.getElementById("start-btn").addEventListener("click", () => {
    document.getElementById("start-box").classList.add("hidden");
    document.getElementById("mode-box").classList.remove("hidden");
});
document.getElementById("back-btn").addEventListener("click", () => {
    document.getElementById("mode-box").classList.add("hidden");
    document.getElementById("start-box").classList.remove("hidden");
});
document.querySelectorAll("[data-mode]").forEach(button => {
    button.addEventListener("click", () => chooseMode(button.dataset.mode));
});
document.getElementById("change-mode-btn").addEventListener("click", () => {
    canClick = false;
    roundLayer.clearLayers();
    document.querySelector("main").classList.add("pre-game");
    document.getElementById("question-box").classList.add("hidden");
    document.getElementById("feedback-box").classList.add("hidden");
    document.getElementById("scoreboard").classList.add("hidden");
    document.getElementById("map-container").classList.add("hidden");
    document.getElementById("mode-box").classList.remove("hidden");
});
document.getElementById("end-change-mode-btn").addEventListener("click", () => {
    document.getElementById("end-box").classList.add("hidden");
    document.querySelector("main").classList.add("pre-game");
    document.getElementById("scoreboard").classList.add("hidden");
    document.getElementById("map-container").classList.add("hidden");
    document.getElementById("mode-box").classList.remove("hidden");
});

document.getElementById("commune-options").replaceChildren(
    ...COMMUNES_GUYANE.map(commune => {
        const option = document.createElement("option");
        option.value = commune.nom;
        return option;
    })
);

