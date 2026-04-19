let user = null;

const USERS = {
  "Cristian": "94",
  "Nayeli": "94",
  "Prueba": "12345"
};

const symbols = ["❤️","⭐","🍒","💎","🔥","N","A","Y"];

const KEY_200 = "K200";
const KEY_500 = "K500";

/* 🔥 ESPERAR A QUE CARGUE TODO */
window.onload = () => {

  document.getElementById("btnLogin").onclick = login;
  document.getElementById("spinBtn").onclick = spin;
  document.getElementById("convertBtn").onclick = convertPoints;
  document.getElementById("btn200").onclick = redeem200;
  document.getElementById("btn500").onclick = redeem500;

};

/* LOGIN (ARREGLADO) */
function login(){

  const u = document.getElementById("username").value.trim();
  const p = document.getElementById("password").value.trim();

  if(!USERS[u] || USERS[u] !== p){
    document.getElementById("error").innerText="Datos incorrectos";
    return;
  }

  user = u;

  const ref = db.ref("users/"+user);

  ref.once("value").then(snap=>{
    if(!snap.exists()){
      ref.set({
        coins: user==="Prueba"?1000000:2000,
        points:0,
        quetzales:0,
        jackpot:false
      });
    }
  });

  document.getElementById("login").style.display="none";
  document.getElementById("game").style.display="block";

  /* 🔥 SINCRONIZACIÓN REAL */
  ref.on("value", snap=>{
    const d = snap.val();
    if(!d) return;

    document.getElementById("coins").innerText = d.coins;
    document.getElementById("points").innerText = d.points;
    document.getElementById("quetzales").innerText = d.quetzales;
  });
}

/* 🎰 GIRAR (SIN BUG DE MONEDAS) */
function spin(){

  const ref = db.ref("users/"+user);

  ref.once("value").then(snap=>{
    let d = snap.val();

    if(d.coins < 100){
      alert("Sin monedas");
      return;
    }

    d.coins -= 100;

    spinAnim();

    setTimeout(()=>{

      const m1 = document.getElementById("c1r2").innerText;
      const m2 = document.getElementById("c2r2").innerText;
      const m3 = document.getElementById("c3r2").innerText;

      if(m1==="N" && m2==="A" && m3==="Y" && !d.jackpot){
        d.points += 2000;
        d.jackpot = true;
        alert("PREMIO MAYOR");
      }
      else if(m1===m2 && m2===m3){
        d.points += 200;
      }
      else if(m1===m2 || m2===m3){
        d.points += 50;
      }

      ref.set(d);

    },800);
  });
}

/* 🎰 ANIMACIÓN (MISMO ESTILO TUYO) */
function spinAnim(){

  ["c1","c2","c3"].forEach(c=>{
    ["r1","r2","r3"].forEach(r=>{
      document.getElementById(c+r).innerText =
        symbols[Math.floor(Math.random()*symbols.length)];
    });
  });

}

/* 💱 CANJEAR */
function convertPoints(){

  const ref = db.ref("users/"+user);

  ref.once("value").then(snap=>{
    let d = snap.val();

    if(d.points < 1000){
      alert("Mínimo 1000 puntos");
      return;
    }

    const ganados = Math.floor(d.points / 1000);

    d.points = d.points % 1000;
    d.quetzales += ganados;

    ref.set(d);
  });
}

/* 🔑 CLAVES */
function redeem200(){

  const key = document.getElementById("key200").value;

  if(key !== KEY_200){
    alert("Clave incorrecta");
    return;
  }

  const ref = db.ref("users/"+user+"/coins");

  ref.once("value").then(snap=>{
    ref.set(snap.val() + 200);
  });
}

function redeem500(){

  const key = document.getElementById("key500").value;

  if(key !== KEY_500){
    alert("Clave incorrecta");
    return;
  }

  const ref = db.ref("users/"+user+"/coins");

  ref.once("value").then(snap=>{
    ref.set(snap.val() + 500);
  });
}
