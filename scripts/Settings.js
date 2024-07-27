var bg = document.getElementById("setbg");
var bgm = document.getElementById("bgm");
var sldbgm = document.getElementById("sldbgm");
var sldsfx = document.getElementById("sldsfx");
var volbgm=localStorage.getItem("volbgm"); if(volbgm==null || volbgm>100 || volbgm<0)volbgm=90;
var volsfx=localStorage.getItem("volsfx"); if(volsfx==null || volsfx>100 || volsfx<0)volsfx=90;
sldbgm.value = volbgm;
sldsfx.value = volsfx;
bgm.volume = volbgm/100;
bgm.play().catch(()=>{/*console.log("Tried to play audio but can't yet.");*/});
function Volbgmchange(){
    bgm.volume = sldbgm.value/100;
}
function Volsfxchange(){
    
}
function Openbg(){
    bg.style.visibility = "visible";
}
function Closebg(){
    bg.style.visibility = "hidden";
}
function Bodyplaybgm(){
    if(bgm.paused)bgm.play().catch(()=>{/*console.log("Tried to play audio but can't yet.");*/});
    setTimeout(()=>{if(!bgm.paused)document.body.removeAttribute("onclick");}, 200);
}