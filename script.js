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

  // 上空スタート（かなり北）
  let startLat = targetLat + 8;

  // 既存ピン削除
  if (currentMarker) {
    map.removeLayer(currentMarker);
  }

  // マーカー生成（まず上空）
  currentMarker = L.marker([startLat, targetLng]).addTo(map);

  map.setView([targetLat, targetLng], 6);

  let step = 0;
  const steps = 25;

  const dropInterval = setInterval(() => {
    step++;
    const lat =
      startLat - ((startLat - targetLat) * step) / steps;

    currentMarker.setLatLng([lat, targetLng]);

    if (step >= steps) {
      clearInterval(dropInterval);

      // 最終位置に固定
      currentMarker.setLatLng([targetLat, targetLng]);
      map.setView([targetLat, targetLng], 10);

      currentMarker
        .bindPopup(`📍 ${city.city_ja}<br>${city.admin_name_ja}`)
        .openPopup();
    }
  }, 30);
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
