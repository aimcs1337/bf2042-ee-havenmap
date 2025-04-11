// --- Image and Map Setup --- //
const imageWidth = 1421;
const imageHeight = 769;
const imageBounds = [[0, 0], [imageHeight, imageWidth]];

// Reference points: In-game (x, z) vs image map (x, y)
// 2042 displays the Y coordinate as Z, while height is shown on Y
const inGameRefPoint1 = { x: -137.70, y: 21.43 }; // ingame x, z
const inGameRefPoint2 = { x: 91.98, y: 98.12 }; // ingame x, z
const mapRefPoint1 = { x: 290.44, y: 455.56 };
const mapRefPoint2 = { x: 159.19, y: 836.19 };

// Compute the transform matrix
const transform = computeTransform(inGameRefPoint1, inGameRefPoint2, mapRefPoint1, mapRefPoint2);

// Create Leaflet map
const map = L.map('map', {
  crs: L.CRS.Simple,
  minZoom: 0,
  maxZoom: 5,
  maxBounds: imageBounds
});

L.imageOverlay('img/BFEE_HAVEN_Items3.png', imageBounds).addTo(map);
map.fitBounds(imageBounds);

// --- Marker Management --- //
const STORAGE_KEY = 'customMarkers';
let savedMarkers = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let markerObjects = [];

// Create protected origin marker
const zeroPoint = gameToMapCoords(0, 0);
const zeroPointData = { lat: zeroPoint.x, lng: zeroPoint.y, description: "Map origin" };

const zeroPointMarker = L.marker([zeroPoint.x, zeroPoint.y], {icon: L.divIcon({ className: 'protected-marker' })}).addTo(map);
zeroPointMarker.bindPopup(createPopupContent(zeroPointData, zeroPointMarker));

// Load saved markers
savedMarkers.forEach(data => createMarker(data, false));

// Create markers
map.on('click', function (e) {
  const newMarkerData = {
    lat: e.latlng.lat,
    lng: e.latlng.lng,
    description: ''
  };
  createMarker(newMarkerData, true);
});

// --- Coordinate Conversion --- //
function computeTransform(game1, game2, map1, map2) {
  const dxGame = game2.x - game1.x;
  const dyGame = game2.y - game1.y;
  const dxMap = map2.x - map1.x;
  const dyMap = map2.y - map1.y;

  const scale = Math.sqrt(dxMap ** 2 + dyMap ** 2) / Math.sqrt(dxGame ** 2 + dyGame ** 2);
  const angle = Math.atan2(dyMap, dxMap) - Math.atan2(dyGame, dxGame);

  const cosA = Math.cos(angle) * scale;
  const sinA = Math.sin(angle) * scale;

  const a = cosA;
  const b = -sinA;
  const c = sinA;
  const d = cosA;

  const tx = map1.x - (a * game1.x + b * game1.y);
  const ty = map1.y - (c * game1.x + d * game1.y);

  return { a, b, c, d, tx, ty };
}

function gameToMapCoords(x, y) {
  return {
    x: transform.a * x + transform.b * y + transform.tx,
    y: transform.c * x + transform.d * y + transform.ty
  };
}

function mapToGameCoords(mapX, mapY) {
  const det = transform.a * transform.d - transform.b * transform.c;
  const aInv = transform.d / det;
  const bInv = -transform.b / det;
  const cInv = -transform.c / det;
  const dInv = transform.a / det;
  const txInv = -(aInv * transform.tx + bInv * transform.ty);
  const tyInv = -(cInv * transform.tx + dInv * transform.ty);

  return {
    x: aInv * mapX + bInv * mapY + txInv,
    y: cInv * mapX + dInv * mapY + tyInv
  };
}

// --- Marker Helpers --- //
function createMarker(data, shouldSave) {
  if (typeof data.lat !== 'number' || typeof data.lng !== 'number') {
    console.warn('Invalid marker data skipped:', data);
    return;
  }

  const marker = L.marker([data.lat, data.lng]).addTo(map);
  marker.bindPopup(createPopupContent(data, marker)).openPopup();
  markerObjects.push({marker, data});

  if (!shouldSave)
    return;

  savedMarkers.push(data);
  saveMarkers();
}

function createPopupContent(data, markerRef) {
  const container = document.createElement('div');
  const gameCoords = mapToGameCoords(data.lat, data.lng);

  container.innerHTML = 
   `<p><strong>Map Coords:</strong><br>${gameCoords.x.toFixed(2)}, ${gameCoords.y.toFixed(2)}</p>
    <textarea placeholder="Description.." style="width: 100%; box-sizing: border-box;">${data.description || ''}</textarea>
    <button style="margin-top:5px;" class="save-desc">Save</button>
    <button style="margin-top:5px; margin-left:5px;" class="delete-marker">Delete</button>`;

  container.querySelector('.delete-marker').onclick = () => {
    if (gameCoords.x === 0 && gameCoords.y === 0) {
      alert("This marker cannot be deleted.");
      return;
    }

    map.removeLayer(markerRef);
    savedMarkers = savedMarkers.filter(m => !(m.lat === data.lat && m.lng === data.lng));
    saveMarkers();
  };

  container.querySelector('.save-desc').onclick = () => {
    data.description = container.querySelector('textarea').value;
    saveMarkers();
    markerRef.closePopup();
  };

  return container;
}

function saveMarkers() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(savedMarkers));
}
