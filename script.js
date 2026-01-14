const button = document.getElementById("throwBtn");
const result = document.getElementById("result");

let cities = [];
let currentMarker = null;

/* ===== 地図を1回だけ初期化 ===== */
const map = L.map("map").setView([36.0, 138.0], 5);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors"
}).addTo(map);

/* ===== JSON 読み込み ===== */
fetch("cities_japan.json")
  .then(res => res.json())
  .then(data => {
    cities = data;
    console.log("都市データ読み込み完了:", cities.length);
  });

function dropPin(city) {
  const targetLat = city.lat;
  const targetLng = city.lng;

  let startLat = targetLat + 4;

  if (currentMarker) {
    map.removeLayer(currentMarker);
  }

  currentMarker = L.marker([startLat, targetLng]).addTo(map);
  map.setView([startLat, targetLng], 6);

  let step = 0;
  const steps = 40;

  const dropInterval = setInterval(() => {
    step++;

    const progress = step / steps;
    const eased = 1 - Math.pow(1 - progress, 2);

    const lat =
      startLat - (startLat - targetLat) * eased;

    currentMarker.setLatLng([lat, targetLng]);

    if (step >= steps) {
      clearInterval(dropInterval);

      currentMarker.setLatLng([targetLat, targetLng]);

      setTimeout(() => {
        map.setView([targetLat, targetLng], 10);
      }, 100);

      currentMarker
        .bindPopup(`📍 ${city.city_ja}<br>${city.admin_name_ja}`)
        .openPopup();
    }
  }, 40);
}


/* ===== ボタンクリック ===== */
button.addEventListener("click", () => {
  if (cities.length === 0) {
    result.textContent = "データ読み込み中です…";
    return;
  }

  result.textContent = "🎰 抽選中…";

  setTimeout(() => {
    const city = cities[Math.floor(Math.random() * cities.length)];

    result.innerHTML = `
      <strong>${city.city_ja}</strong><br>
      ${city.admin_name_ja}
    `;

    dropPin(city);
  }, 1000);
});
