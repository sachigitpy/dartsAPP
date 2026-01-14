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

/* ===== ピン落下アニメーション ===== */
function dropPin(city) {
  const targetLat = Number(city.lat);
  const targetLng = Number(city.lng);

  const startLat = targetLat + 20; // ← 無茶な高さ
  const steps = 60;

  if (currentMarker) {
    map.removeLayer(currentMarker);
  }

  // ズームを極端に引く
  map.setView([targetLat, targetLng], 4, { animate: false });

  currentMarker = L.circleMarker(
    [startLat, targetLng],
    { radius: 12, color: "red", fillOpacity: 1 }
  ).addTo(map);

  let step = 0;

  const interval = setInterval(() => {
    step++;

    const lat =
      startLat - (startLat - targetLat) * (step / steps);

    currentMarker.setLatLng([lat, targetLng]);

    console.log("lat:", lat);

    if (step >= steps) {
      clearInterval(interval);

      currentMarker
        .bindPopup(`📍 ${city.city_ja}`)
        .openPopup();
    }
  }, 100);
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
