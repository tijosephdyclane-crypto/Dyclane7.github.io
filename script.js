let locations = [];
let currentRound = 0;
let totalScore = 0;
let userMarker = null;
let targetMarker = null;
let line = null;
let userCoords = null;

// Récupération du meilleur score via localStorage
let highScore = localStorage.getItem('guyaneHighScore') || 0;
document.getElementById('high-score').textContent = highScore;

// Initialisation de la carte centrée sur la Guyane
const map = L.map('map').setView([4.0, -53.0], 7);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

// Chargement des données depuis le fichier JSON
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        // Mélange aléatoire des lieux
        locations = data.sort(() => Math.random() - 0.5);
        loadRound();
    })
    .catch(err => console.error("Erreur de chargement JSON :", err));

function loadRound() {
    if (currentRound >= 5 || currentRound >= locations.length) {
        alert(`Partie terminée ! Score final : ${totalScore} points.`);
        if (totalScore > highScore) {
            localStorage.setItem('guyaneHighScore', totalScore);
        }
        location.reload();
        return;
    }

    // Réinitialisation de l'interface
    document.getElementById('round').textContent = currentRound + 1;
    document.getElementById('location-image').src = locations[currentRound].image;
    document.getElementById('result-box').classList.add('hidden');
    document.getElementById('guess-btn').disabled = true;
    document.getElementById('guess-btn').textContent = "Clique sur la carte pour deviner";
    
    // Nettoyage des marqueurs précédents
    if (userMarker) map.removeLayer(userMarker);
    if (targetMarker) map.removeLayer(targetMarker);
    if (line) map.removeLayer(line);
    userCoords = null;
    map.setView([4.0, -53.0], 7);
}

// Gestion du clic sur la carte
map.on('click', (e) => {
    if (!document.getElementById('result-box').classList.contains('hidden')) return;

    userCoords = e.latlng;
    if (userMarker) {
        userMarker.setLatLng(userCoords);
    } else {
        userMarker = L.marker(userCoords).addTo(map);
    }
    
    document.getElementById('guess-btn').disabled = false;
    document.getElementById('guess-btn').textContent = "Valider ma position !";
});

// Formule de Haversine (calcul de distance sur une sphère en km)
function getDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Validation de la réponse
document.getElementById('guess-btn').addEventListener('click', () => {
    const target = locations[currentRound];
    const distance = getDistanceKm(userCoords.lat, userCoords.lng, target.lat, target.lng);
    
    // Calcul des points (max 5000 pts, décroissance exponentielle adaptée à la taille de la Guyane)
    const points = Math.round(5000 * Math.exp(-distance / 60));
    totalScore += points;
    document.getElementById('score').textContent = totalScore;

    // Affichage de la vraie position et de la ligne
    targetMarker = L.marker([target.lat, target.lng]).addTo(map);
    line = L.polyline([userCoords, [target.lat, target.lng]], {color: '#da121a', weight: 3}).addTo(map);
    map.fitBounds(line.getBounds(), {padding: [50, 50]});

    // Affichage du panneau de résultat
    document.getElementById('location-name').textContent = target.nom;
    document.getElementById('location-info').textContent = target.info;
    document.getElementById('distance-result').textContent = distance.toFixed(1);
    document.getElementById('points-earned').textContent = points;
    document.getElementById('result-box').classList.remove('hidden');
    document.getElementById('guess-btn').disabled = true;
});

document.getElementById('next-btn').addEventListener('click', () => {
    currentRound++;
    loadRound();
});
