let user = null;

const USERS = {
  "Cristian": "94",
  "Nayeli": "94",
  "Prueba": "12345"
};

const KEY_200 = "K200";
const KEY_500 = "K500";

const symbols = ["❤️","⭐","🌙","🍒","💎","🍀","🔥","N","A","Y"];

/* ================= LOGIN ================= */
function login(){
  const u = document.getElementById("username").value.trim();
  const p = document.getElementById("password").value.trim();
  const error = document.getElementById("error");

  if(!USERS[u] || USERS[u] !== p){
    error.innerText = "❌ Datos incorrectos";
    return;
  }

  user = u;
  let data = getData();

  if(!data){
    data = {
      coins: u === "Prueba" ? 200000 : 2000,
      points: 0,
      quetzales: 0,
      jackpot: false,
      lastOnline: Date.now()
    };
    saveData(data);
  }

  document.getElementById("login").style.display = "none";
  document.getElementById("game").style.display = "block";

  applyOfflineCoins();
  load();
}

/* ================= STORAGE ================= */
function getData(){
  return JSON.parse(localStorage.getItem(user));
}

function saveData(data){
  localStorage.setItem(user, JSON.stringify(data));
}

/* ================= OFFLINE COINS ================= */
function applyOfflineCoins(){
  let d = getData();
  if(!d) return;

  let now = Date.now();
  let diff = now - d.lastOnline;

  let mins = Math.floor(diff / 60000);
  let earned = Math.floor(mins / 30) * 100;

  d.coins += earned;
  d.lastOnline = now;

  saveData(d);
}

/* ================= SLOT ================= */
function spin(){
  let d = getData();
  if(!d || d.coins < 100){
    alert("❌ Sin monedas");
    return;
  }

  d.coins -= 100;

  spinCol("c1");
  spinCol("c2");
  spinCol("c3");

  setTimeout(()=>{

    let m1 = document.getElementById("c1r2").innerText;
    let m2 = document.getElementById("c2r2").innerText;
    let m3 = document.getElementById("c3r2").innerText;

    if(m1==="N" && m2==="A" && m3==="Y" && !d.jackpot){
      d.jackpot = true;
      d.points += 2000;
      alert("🎉 PREMIO MAYOR NAY 🎉");
    }
    else if(m1===m2 && m2===m3){
      d.points += 200;
    }
    else if(m1===m2 || m2===m3){
      d.points += 50;
    }

    saveData(d);
    load();

  },1000);
}

function spinCol(prefix){
  const ids = ["r1","r2","r3"];
  let count = 0;

  let interval = setInterval(()=>{
    ids.forEach(id=>{
      document.getElementById(prefix+id).innerText =
        symbols[Math.floor(Math.random()*symbols.length)];
    });

    count++;
    if(count > 8) clearInterval(interval);

  },100);
}

/* ================= POINTS ================= */
function convertPoints(){
  let d = getData();
  if(!d || d.points < 1000){
    alert("❌ Necesitas 1000 puntos");
    return;
  }

  let q = Math.floor(d.points / 1000);

  d.points = d.points % 1000;
  d.quetzales += q;

  saveData(d);
  load();
}

/* ================= REDEEM ================= */
function redeem(inputId, key, amount){
  const input = document.getElementById(inputId).value.trim();

  if(input !== key){
    alert("❌ Clave incorrecta");
    return;
  }

  let used = JSON.parse(localStorage.getItem("used") || "[]");
  if(used.includes(input)){
    alert("⚠️ Ya usada");
    return;
  }

  let d = getData();
  if(!d) return;

  d.coins += amount;
  used.push(input);

  saveData(d);
  localStorage.setItem("used", JSON.stringify(used));

  load();
}

/* ================= LOAD ================= */
function load(){
  let d = getData();
  if(!d) return;

  document.getElementById("coins").innerText = d.coins;
  document.getElementById("points").innerText = d.points;
  document.getElementById("quetzales").innerText = d.quetzales;
}
