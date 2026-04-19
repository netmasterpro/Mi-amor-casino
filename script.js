let coins = 1000;

const symbols = ["🍒", "🍋", "🍉", "⭐", "💎"];

const r1 = document.getElementById("r1");
const r2 = document.getElementById("r2");
const r3 = document.getElementById("r3");

const spinBtn = document.getElementById("spinBtn");

function spin() {
  if (coins < 100) {
    alert("No tienes monedas 😢");
    return;
  }

  coins -= 100;
  updateCoins();

  spinBtn.disabled = true;

  startAnimation();

  setTimeout(() => {
    let result = generateResult();

    r1.textContent = result[0];
    r2.textContent = result[1];
    r3.textContent = result[2];

    stopAnimation();

    checkWin(result);

    spinBtn.disabled = false;

  }, 1500);
}

function startAnimation() {
  r1.classList.add("spinning");
  r2.classList.add("spinning");
  r3.classList.add("spinning");

  let interval = setInterval(() => {
    r1.textContent = randomSymbol();
    r2.textContent = randomSymbol();
    r3.textContent = randomSymbol();
  }, 100);

  window.spinInterval = interval;
}

function stopAnimation() {
  clearInterval(window.spinInterval);

  r1.classList.remove("spinning");
  r2.classList.remove("spinning");
  r3.classList.remove("spinning");
}

function generateResult() {
  let rand = Math.random();

  if (rand < 0.05) {
    let sym = randomSymbol();
    return [sym, sym, sym];
  } else if (rand < 0.20) {
    let sym = randomSymbol();
    let other = randomSymbol();
    return [sym, sym, other];
  } else {
    return [
      randomSymbol(),
      randomSymbol(),
      randomSymbol()
    ];
  }
}

function checkWin([a, b, c]) {
  let text = "";

  if (a === b && b === c) {
    coins += 800;
    text = "🔥 JACKPOT 🔥 +800";
  } else if (a === b || b === c || a === c) {
    coins += 200;
    text = "✨ Premio medio +200";
  } else {
    text = "😢 Perdiste";
  }

  document.getElementById("resultado").textContent = text;
  updateCoins();
}

function randomSymbol() {
  return symbols[Math.floor(Math.random() * symbols.length)];
}

function updateCoins() {
  document.getElementById("coins").textContent = coins;
}
