let user = null;

const USERS = {
  "Cristian": "94",
  "Nayeli": "94",
  "Prueba": "12345"
};

const KEY_200 = "K200";
const KEY_500 = "K500";

/* LOGIN */
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
        coins: user==="Prueba"?2000000:2000,
        points:0,
        quetzales:0,
        jackpot:false
      });
    }
  });

  document.getElementById("login").style.display="none";
  document.getElementById("game").style.display="block";

  listen();
}

/* TIEMPO REAL */
function listen(){
  const ref = db.ref("users/"+user);

  ref.on("value", snap=>{
    const d = snap.val();

    document.getElementById("coins").innerText=d.coins;
    document.getElementById("points").innerText=d.points;
    document.getElementById("quetzales").innerText=d.quetzales;
  });
}

/* SLOT */
const symbols = ["❤️","⭐","🍒","💎","🔥","N","A","Y"];

function spin(){
  const ref = db.ref("users/"+user);

  ref.once("value").then(snap=>{
    let d = snap.val();

    if(d.coins<100){
      alert("Sin monedas");
      return;
    }

    d.coins-=100;

    let m1 = symbols[Math.floor(Math.random()*symbols.length)];
    let m2 = symbols[Math.floor(Math.random()*symbols.length)];
    let m3 = symbols[Math.floor(Math.random()*symbols.length)];

    document.getElementById("c1").innerText=m1;
    document.getElementById("c2").innerText=m2;
    document.getElementById("c3").innerText=m3;

    if(m1==="N" && m2==="A" && m3==="Y" && !d.jackpot){
      d.points+=2000;
      d.jackpot=true;
      alert("PREMIO MAYOR");
    }
    else if(m1===m2 && m2===m3){
      d.points+=200;
    }
    else if(m1===m2 || m2===m3){
      d.points+=50;
    }

    ref.set(d);
  });
}

/* CANJEAR */
function convertPoints(){
  const ref = db.ref("users/"+user);

  ref.once("value").then(snap=>{
    let d = snap.val();

    if(d.points<1000){
      alert("mínimo 1000 puntos");
      return;
    }

    let g = Math.floor(d.points/1000);

    d.points%=1000;
    d.quetzales+=g;

    ref.set(d);
  });
}

/* CLAVES */
function redeem200(){
  if(document.getElementById("key200").value!==KEY_200){
    alert("clave incorrecta");
    return;
  }

  db.ref("users/"+user+"/coins").once("value").then(s=>{
    db.ref("users/"+user).update({
      coins:s.val()+200
    });
  });
}

function redeem500(){
  if(document.getElementById("key500").value!==KEY_500){
    alert("clave incorrecta");
    return;
  }

  db.ref("users/"+user+"/coins").once("value").then(s=>{
    db.ref("users/"+user).update({
      coins:s.val()+500
    });
  });
}
