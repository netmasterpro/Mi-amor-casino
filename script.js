let user = null;

const USERS = {
  "Cristian": "94",
  "Nayeli": "94",
  "Prueba": "12345"
};

const KEY_200 = "K200";
const KEY_500 = "K500";

const symbols = ["❤️","⭐","🍒","💎","🔥","N","A","Y"];

/* LOGIN */
function login(){
  let u = username.value.trim();
  let p = password.value.trim();

  if(!USERS[u] || USERS[u] !== p){
    error.innerText="Error";
    return;
  }

  user = u;

  let ref = db.ref("users/"+user);

  ref.once("value").then(s=>{
    if(!s.exists()){
      ref.set({
        coins: user==="Prueba"?1000000:2000,
        points:0,
        quetzales:0,
        jackpot:false
      });
    }
  });

  login.style.display="none";
  game.style.display="block";

  ref.on("value",snap=>{
    let d=snap.val();
    coins.innerText=d.coins;
    points.innerText=d.points;
    quetzales.innerText=d.quetzales;
  });
}

/* SLOT */
function spin(){
  let ref=db.ref("users/"+user);

  ref.once("value").then(s=>{
    let d=s.val();

    if(d.coins<100) return alert("Sin monedas");

    d.coins-=100;

    spinAnim();

    setTimeout(()=>{
      let m1=c1r2.innerText;
      let m2=c2r2.innerText;
      let m3=c3r2.innerText;

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

    },1000);
  });
}

/* ANIMACIÓN */
function spinAnim(){
  let ids=["c1","c2","c3"];

  ids.forEach((c,i)=>{
    ["r1","r2","r3"].forEach(r=>{
      document.getElementById(c+r).innerText =
        symbols[Math.floor(Math.random()*symbols.length)];
    });
  });
}

/* CANJEAR */
function convertPoints(){
  let ref=db.ref("users/"+user);

  ref.once("value").then(s=>{
    let d=s.val();

    if(d.points<1000) return;

    let g=Math.floor(d.points/1000);

    d.points%=1000;
    d.quetzales+=g;

    ref.set(d);
  });
}

/* CLAVES */
function redeem200(){
  if(key200.value!==KEY_200) return;

  let ref=db.ref("users/"+user+"/coins");
  ref.once("value").then(s=>{
    ref.set(s.val()+200);
  });
}

function redeem500(){
  if(key500.value!==KEY_500) return;

  let ref=db.ref("users/"+user+"/coins");
  ref.once("value").then(s=>{
    ref.set(s.val()+500);
  });
}
