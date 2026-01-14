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
  const targetLat = Number(city.lat);
  const targetLng = Number(city.lng);

  const startLat = targetLat + 15;

  if (currentMarker) {
    map.removeLayer(currentMarker);
  }

  currentMarker = L.circleMarker(
    [startLat, targetLng],
    { radius: 10, color: "red" }
  ).addTo(map);

  map.panTo([startLat, targetLng], { animate: false });
  console.log("drop start", startLat, "→", targetLat);

  const duration = 800; // ms
  const startTime = performance.now();

  function animate(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // easeIn
    const eased = progress * progress;

    const lat =
      startLat - (startLat - targetLat) * eased;

    currentMarker.setLatLng([lat, targetLng]);

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      currentMarker.setLatLng([targetLat, targetLng]);
      map.setView([targetLat, targetLng], 10);

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
