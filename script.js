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

  // 落下開始位置（画面内でちゃんと見える距離）
  const startLat = targetLat + 2;

  // 既存ピン削除
  if (currentMarker) {
    map.removeLayer(currentMarker);
  }

  // 先に視点を固定（ここ超重要）
  map.setView([targetLat, targetLng], 7, { animate: false });

  // 上空にピン生成
  currentMarker = L.circleMarker(
    [startLat, targetLng],
    {
      radius: 10,
      color: "red",
      fillColor: "red",
      fillOpacity: 1
    }
  ).addTo(map);

  console.log("drop start", startLat, "→", targetLat);

  const duration = 1200; // ms
  const startTime = performance.now();

  function animate(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // ease-in（重力っぽく）
    const eased = progress * progress;

    const lat =
      startLat - (startLat - targetLat) * eased;

    currentMarker.setLatLng([lat, targetLng]);

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      // 着地
      currentMarker.setLatLng([targetLat, targetLng]);

      currentMarker
        .bindPopup(`📍 ${city.city_ja}<br>${city.admin_name_ja}`)
        .openPopup();
    }
  }

  requestAnimationFrame(animate);
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
