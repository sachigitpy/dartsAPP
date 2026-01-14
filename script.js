const button = document.getElementById("throwBtn");
const result = document.getElementById("result");

let cities = [];

// cities_japan.json を読み込む
fetch("cities_japan.json")
  .then(response => response.json())
  .then(data => {
    cities = data;
    console.log("都市データ読み込み完了:", cities.length);
  });

// ボタンが押されたとき
button.addEventListener("click", () => {
  if (cities.length === 0) {
    result.textContent = "データ読み込み中です…";
    return;
  }

  result.textContent = "🎰 抽選中…";

  // 1秒後に結果表示
  setTimeout(() => {
    const city = cities[Math.floor(Math.random() * cities.length)];

    result.innerHTML = `
      <strong>${city.city_ja}</strong><br>
      ${city.admin_name_ja}
    `;
  }, 1000);
});
