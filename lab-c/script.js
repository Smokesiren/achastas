let map;
let userMarker;
let puzzlePieces = [];

function initMap() {
    map = L.map('map').setView([51.505, -0.09], 13); // Domyślne centrum

    // Dodanie warstwy mapy
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
}

// Pobranie zgody na lokalizację
document.getElementById('my-location-btn').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            if (userMarker) {
                map.removeLayer(userMarker);
            }
            map.setView([latitude, longitude], 13);
            userMarker = L.marker([latitude, longitude]).addTo(map).bindPopup("Twoja lokalizacja").openPopup();
        }, error => {
            alert("Nie można uzyskać dostępu do lokalizacji.");
        });
    } else {
        alert("Geolokalizacja nie jest wspierana przez tę przeglądarkę.");
    }
});

// Pobranie zgody na wyświetlanie powiadomień
function requestNotificationPermission() {
    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }
}

// Pobieranie mapy i dzielenie na puzzle
document.getElementById('download-map-btn').addEventListener('click', () => {
    map.invalidateSize();
    html2canvas(document.getElementById('map')).then(canvas => {
        // Tworzenie elementów puzzli
        const tileWidth = canvas.width / 4;
        const tileHeight = canvas.height / 4;

        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                const pieceCanvas = document.createElement('canvas');
                pieceCanvas.width = tileWidth;
                pieceCanvas.height = tileHeight;
                const context = pieceCanvas.getContext('2d');
                context.drawImage(canvas, col * tileWidth, row * tileHeight, tileWidth, tileHeight, 0, 0, tileWidth, tileHeight);
                pieceCanvas.classList.add('puzzle-piece');
                pieceCanvas.draggable = true;
                pieceCanvas.style.position = "absolute";
                pieceCanvas.style.top = `${Math.random() * 300}px`;
                pieceCanvas.style.left = `${Math.random() * 300}px`;
                document.getElementById('puzzle-container').appendChild(pieceCanvas);

                // Dodanie mechanizmu drag & drop
                pieceCanvas.addEventListener('dragstart', dragStart);
                pieceCanvas.addEventListener('dragend', dragEnd);

                puzzlePieces.push({
                    canvas: pieceCanvas,
                    correctPosition: { x: col * tileWidth, y: row * tileHeight }
                });
            }
        }
    });
});

// Drag & Drop
let draggedPiece = null;

function dragStart(event) {
    draggedPiece = event.target;
}

function dragEnd(event) {
    draggedPiece.style.left = `${event.pageX}px`;
    draggedPiece.style.top = `${event.pageY}px`;

    checkPuzzleCompletion();
}

function checkPuzzleCompletion() {
    let correctlyPlaced = 0;

    puzzlePieces.forEach(piece => {
        const rect = piece.canvas.getBoundingClientRect();
        const correctRect = piece.correctPosition;

        if (Math.abs(rect.left - correctRect.x) < 10 && Math.abs(rect.top - correctRect.y) < 10) {
            correctlyPlaced++;
        }
    });

    if (correctlyPlaced === 16) {
        new Notification('Gratulacje! Puzzle zostały ułożone.');
    }
}

window.onload = () => {
    initMap();
    requestNotificationPermission();
};
