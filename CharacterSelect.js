var selected=0;
var pcount=4;
const disps = [document.getElementById("cd0"), document.getElementById("cd1"), document.getElementById("cd2"), document.getElementById("cd3")];
const boxes = [document.getElementById("cb0"), document.getElementById("cb1"), document.getElementById("cb2"), document.getElementById("cb3")];
const pdisp = document.getElementById("playercount");
function ChangeYou(ind){
    for(let i=0;i<disps.length;i++){
        if(i==ind){
            boxes[i].checked=true;
            boxes[i].disabled=true;
            disps[i].dataset.you = 1;
        }
        else{
            boxes[i].disabled=false;
            disps[i].dataset.you = 0;
        }
        selected = ind;
        CheckCharacter();
    }
}
function CheckCharacter(event){
    if(event!==undefined)event.stopPropagation();
    let tmp=0;
    for(let i=0;i<boxes.length;i++){
        if(boxes[i].checked)tmp++;
    }
    pcount=tmp;
    pdisp.innerHTML = pcount.toString().concat((pcount==1)?" Player":" Players");
}
ChangeYou(selected);