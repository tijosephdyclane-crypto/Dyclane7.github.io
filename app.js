let questions = [];
let currentIndex = 0;
let score = 0;
let canClick = true;

// Chargement du record via localStorage
let bestScore = localStorage.getItem("geoguyane_best_score") || 0;
document.getElementById("best-score").textContent = bestScore;

// Initialisation de la carte centrée sur la Guyane
const map = L.map('map', {
    center: [3.95, -53.15],
    zoom: 7,
    minZoom: 6,
    maxZoom: 11
});

// Fond de carte sans noms de villes
L.tileLayer('https://{s}://{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    subdomains: 'abcd'
}).addTo(map);

// Calque pour stocker les marqueurs et lignes du tour en cours
let roundLayer = L.layerGroup().addTo(map);

function initGame() {
    questions = [...LIEUX_GUYANE].sort(() => Math.random() - 0.5);
    currentIndex = 0;
    score = 0;
    document.getElementById("score").textContent = score;
    
    document.getElementById("end-box").classList.add("hidden");
    document.getElementById("question-box").classList.remove("hidden");
    loadQuestion();
}

function loadQuestion() {
    canClick = true;
    roundLayer.clearLayers();
    
    const currentLieu = questions[currentIndex];
    document.getElementById("progress").textContent = `${currentIndex + 1}/${questions.length}`;
    document.getElementById("target-name").textContent = currentLieu.nom;
    document.getElementById("category-badge").textContent = currentLieu.categorie;
    document.getElementById("feedback-box").classList.add("hidden");
}

// Gestion du clic sur la vraie carte
map.on('click', function(e) {
    if (!canClick) return;
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

    // Affichage de l'image du lieu (si disponible)
    const imgElement = document.getElementById("lieu-image");
    if (imgElement) {
        if (currentLieu.image) {
            imgElement.src = currentLieu.image;
            imgElement.alt = `Photo de ${currentLieu.nom}`;
            imgElement.classList.remove("hidden");
        } else {
            imgElement.classList.add("hidden");
        }
    }

    // Affichage du résultat
    document.getElementById("feedback-text").innerHTML = 
        `Vous êtes à <strong>${kmDistance} km</strong> de ${currentLieu.nom} (+${pointsEarned} pts) !`;
    document.getElementById("anecdote-text").textContent = currentLieu.anecdote;
    document.getElementById("feedback-box").classList.remove("hidden");
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
        localStorage.setItem("geoguyane_best_score", bestScore);
        document.getElementById("best-score").textContent = bestScore;
        message += " Nouveau record enregistré ! 🏆";
    }
    document.getElementById("final-summary").textContent = message;
}

document.getElementById("restart-btn").addEventListener("click", initGame);

// Démarrage du jeu
initGame();
