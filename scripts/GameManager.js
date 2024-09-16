var dealtpieces;
var drawntails; //number of pieces drawn from tail of mountain
var playedpieces;
var sea; //list of played pieces
var newp; //last played piece
var waitingfor; //stores if we are wating for the player to pong or chi
const nodraw = 87;
const drawfromback = 69;
function GMNGStartRound(){
    waitingfor=-1; newp=-1;
    let bag = [0,1,1,2,2,3,3,4,4,5,5,6,6,6,6,6,10,11,11,12,12,13,13,14,14,15,15,16,16,16,16,16];
    mtn = [];
    for(let i=0;i<32;i++){
        SetField(i, -1, 0);
        let tmp = CryRandint(bag.length);
        mtn.push(bag[tmp]);
        bag.splice(tmp, 1);
    }
    for(let i=0;i<moves.length;i++)moves[i].disabled=true;
    for(let i=0;i<pnum;i++){
        srrou[i] = [];
        mingp[i] = [];
        let j = charpos[i];
        hands[j].innerHTML = "";
        fulus[j].innerHTML = "";
        draws[j].innerHTML = "";
        draws[j].dataset.mov = 0;
    }
    //TODO: Complete initialization of each new jyu2 (UPDATE 2024AUG31: probably done, so far)
    timeoutstoclear.push(setTimeout(()=>{dealtpieces=0;drawntails=0;Give1Piece();}, 250));
}
function DrawFromMtn(num=0){//pass 69 to this function to draw from tail, otherwise, draw from head
    if(num!=drawfromback){//draw from head (normal draw)
        let tmp = mtn[0];
        mtn.splice(0, 1);
        return tmp;
    }
    else{//draw from tail (special draw after performing kang)
        let tmp = mtn[mtn.length-1];
        mtn.splice(mtn.length-1, 1);
        return tmp;
    }
}
function Give1Piece(){
    if(dealtpieces>=pnum*4){
        turnp = gwind[1];
        timeoutstoclear.push(setTimeout(()=>{playedpieces=0;sea=[];TurnStart();}, 250));
        return;
    }//Finish initial draw and let dealer start their turn
    let tmp = DrawFromMtn();
    SetField(dealtpieces, -2);
    let target = (dealtpieces + gwind[1]) % pnum;
    let isplayer = target==pwind;
    srrou[target].push(tmp);
    hands[charpos[target]].innerHTML+=PieceOf(isplayer?tmp:-1);
    dealtpieces++;
    timeoutstoclear.push(lasttimeoutid = setTimeout(Give1Piece, 100));
}
function TurnStart(arg=0){
    let isplayer = turnp==pwind;
    if(arg!==nodraw){
        if(mtn.length<=6-pnum){return;}//too few pieces left, liou2 jyu2
        jin = DrawFromMtn(arg);
        if(arg===drawfromback){SetField(31-drawntails, -2);drawntails++;}
        else{SetField(dealtpieces, -2);dealtpieces++;}
        if(srrou[turnp].length<=1)draws[charpos[turnp]].dataset.mov = 1;
        draws[charpos[turnp]].innerHTML = PieceOf(isplayer?jin:-1);
    }
    else{
        jin = -1;
    }
    if(!isplayer){ComputerThinksPlay();}
    else{
        for(let i=0, arr=hands[charpos[turnp]].children;i<arr.length;i++)arr[i].onclick=()=>{PlayerPlays(i);};
        if(jin!=-1)draws[charpos[turnp]].children[0].onclick=()=>{PlayerPlays(4);};
    }
}
function ComputerThinksPlay(){
    //TODO: will need to implement kang&riichi&tsumo
    let ans = Randint(srrou[turnp].length+(jin==-1?0:1));
    timeoutstoclear.push(setTimeout(()=>{ComputerPlays(ans);}, Randint(325, 675)));
}
function ComputerPlays(num){
    let tmp;
    if(num<srrou[turnp].length){//not muo1 chiye1
        tmp = srrou[turnp][num];
        hands[charpos[turnp]].children[Randint(srrou[turnp].length)].dataset.val = srrou[turnp][num];
        srrou[turnp][num] = jin;
    }
    else{//this is muo1 chiye1
        tmp = jin;
        draws[charpos[turnp]].innerHTML = PieceOf(jin);
    }
    ttc(()=>{ComputerDonePlaying(tmp);}, 667);
}
function ComputerDonePlaying(num){
    draws[charpos[turnp]].innerHTML = "";
    for(let i=0, arr=hands[charpos[turnp]].children;i<arr.length;i++)arr[i].dataset.val=-1;
    SetField(playedpieces, num, charpos[turnp]);
    playedpieces++;
    sea.push(num);
    newp = num;
    //Now, check chi&pong&kang&ron before proceeding to the next player's turn
    //Logic: if player can (ron&&(chi||pong||kang)), give all options to player first, but if player chooses to
    //chi, pong or kang (not ron), the computers may interrupt the player by choosing a higher priority action
    //(in this case, must be ron). However, when player can only (chi||pong||kang) (but not ron), we simply
    //just check whether computers want to perform a higher priority action before letting player choose, and
    //the player will not be interupted in this case. Priority high to low: 1. Ron, 2. Pong closer to the player
    //discarding the piece when two players can pong at the same time, 3. Further/solo pong or kang, 4. chi
    //!!!End turn check!!!
    if(RonCheck())return;
    if(pnum>=2&&(newp==6||newp==16))PongKangCheck(true);
    else if(pnum>=3&&newp%10>=3&&newp%10<=5)ChiCheck();
    else{
        //Go to the next turn. PongKangCheck and ChiCheck will also handle going to the next turn
        turnp++; turnp%=pnum;
        ttc(()=>{TurnStart();}, 250);
    }
}
function PlayerPlays(num){
    console.log(num);
    waitingfor = -1;
    for(let i=0;i<moves.length;i++)moves[i].disabled=true;
    for(let i=0, arr=hands[charpos[turnp]].children;i<arr.length;i++)arr[i].removeAttribute("onclick");
    if(jin!=-1)draws[charpos[turnp]].children[0].removeAttribute("onclick");
    draws[charpos[turnp]].innerHTML = "";
    let tmp;
    if(num>3){ //muo1 chiye1
        tmp = jin;
    }
    else{ //not muo1 chiye1
        tmp = srrou[turnp][num];
        srrou[turnp].splice(num, 1);
        if(jin!=-1)srrou[turnp].push(jin);
        let s=""; for(let i=0;i<srrou[turnp].length;i++)s+=PieceOf(turnp==pwind?srrou[turnp][i]:-1);
        hands[charpos[turnp]].innerHTML = s;
    }
    SetField(playedpieces, tmp, charpos[turnp]);
    playedpieces++;
    sea.push(tmp);
    newp = tmp;
    //!!!End turn check!!!
    if(RonCheck())return;
    if(pnum>=2&&(newp==6||newp==16))PongKangCheck(true);
    else if(pnum>=3&&newp%10>=3&&newp%10<=5)ChiCheck();
    else{
        //Go to the next turn. PongKangCheck and ChiCheck will also handle going to the next turn
        turnp++; turnp%=pnum;
        ttc(()=>{TurnStart();}, 250);
    }
}
function PongKangCheck(askplayer=true){ //if nobody pongs/kangs then return false, otherwise true
    if(pnum<2||(newp!=6&&newp!=16)){alert("Wrong PongKangCheck call that shouldn't happen!!!!");return;}
    let metplayer = askplayer;
    for(let i=1;i<pnum;i++){
        let j = (turnp+i)%pnum;
        if(!askplayer&&j==pwind){metplayer=true;continue;}if(!metplayer)continue;
        let tmp = 0;
        for(let k=0;k<srrou[j].length;k++)if(srrou[j][k]==newp)tmp++;
        if(tmp<2)continue;
        if(j==pwind){
            if(askplayer){
                //If player chooses to cancel, we then run PongKangCheck(false);
                waitingfor = mvpon;
                moves[mvpon].disabled = false;
                if(tmp>=3)moves[mvkan].disabled = false;
                moves[mvcan].disabled = false;
                return;
            }
        }
        else{if(LogicPongKang(j, newp))return;}
    }
    turnp++; turnp%=pnum;
    ttc(()=>{TurnStart();}, 250);
}
function ChiCheck(){
    if(pnum<3||newp%10<3||newp%10>5){alert("Wrong ChiCheck call that shouldn't happen!!!!");return;}
    let j = (turnp+1)%pnum; //this is the shia4 jia1
    let flag = true; let t = newp>=10?10:0;
    for(let i=3;i<=5;i++){
        if(i==newp%10)continue;
        if(srrou[j].indexOf(i+t)<0){flag=false;break;}
    }
    if(flag){
        if(j==pwind){
            waitingfor = mvchi;
            moves[mvchi].disabled = false;
            moves[mvcan].disabled = false;
            return;
        }
        else{if(LogicChi(j, newp))return;}
    }
    turnp++; turnp%=pnum;
    ttc(()=>{TurnStart();}, 250);
}
function DoPong(who, ismingkang=false){
    let number = ismingkang?3:2;
    playedpieces--;
    sea.pop();
    SetField(playedpieces, -2, 0);
    for(let i=srrou[who].length-1,j=0;j<number;i--)if(newp==srrou[who][i]){srrou[who].splice(i,1);j++;}
    for(let i=0;i<number;i++){mingp[who].push(newp);fulus[charpos[who]].innerHTML+=PieceOf(newp);}
    mingp[who].push(newp); fulus[charpos[who]].innerHTML+=PieceOf(newp, charpos[turnp]); //the last piece faces the opposite direction of the player discarding it
    let s=""; for(let i=0;i<srrou[who].length;i++)s+=PieceOf(who==pwind?srrou[who][i]:-1);
    hands[charpos[who]].innerHTML = s;
    turnp = who;
    if(ismingkang)ttc(()=>{TurnStart(drawfromback);},100);else TurnStart(nodraw);
}
function DoChi(who){
    playedpieces--;
    sea.pop();
    SetField(playedpieces, -2, 0);
    for(let i=srrou[who].length-1,j=[newp%10];j.length<3;i--)if(srrou[who][i]%10>=3&&srrou[who][i]%10<=5&&~~(srrou[who][i]/10)==~~(newp/10)&&j.indexOf(srrou[who][i]%10)<0){j.push(srrou[who][i]%10);srrou[who].splice(i,1);}
    for(let i=(newp<10)?3:13;i%10<=5;i++){if(i==newp)continue;mingp[who].push(i);fulus[charpos[who]].innerHTML+=PieceOf(i);}
    mingp[who].push(newp); fulus[charpos[who]].innerHTML+=PieceOf(newp, charpos[turnp]);
    let s=""; for(let i=0;i<srrou[who].length;i++)s+=PieceOf(who==pwind?srrou[who][i]:-1);
    hands[charpos[who]].innerHTML = s;
    turnp = who;
    TurnStart(nodraw);
}
function MoveButton(num){
    for(let i=0;i<moves.length;i++)moves[i].disabled=true;
    if(num==mvcan){
        if(waitingfor==mvpon){
            waitingfor = -1;
            PongKangCheck(false);
            return;
        }
        else if(waitingfor==mvchi){
            waitingfor = -1;
            turnp++; turnp%=pnum;
            ttc(()=>{TurnStart();}, 100);
            return;
        }
    }
    else if(num==mvpon){
        waitingfor = -1;
        DoPong(pwind);
    }
    else if(num==mvkan){
        if(waitingfor==mvpon){ //this case is ming2 kang-ing opponent
            waitingfor = -1;
            DoPong(pwind, true);
        }
        else{
            //TODO: implement an4 kang and bu3 kang, also chiang3 kang (when bu3 kang)
        }
    }
    else if(num==mvchi){
        waitingfor = -1;
        DoChi(pwind);
    }
}
function LogicPongKang(who, tar){ //tar is target, the piece just discarded
    return false;
    //TODO: Implement computer Pong Kang logic
}
function LogicChi(who, tar){
    return false;
    //TODO: Implement computer Chi logic
}
function RonCheck(){ //if nobody rons then return false, otherwise true
    return false;
    //TODO: this too hard bruh, will do later
    //If player chooses to chi/pong/kang instead, then we store their decision, and then run PongKangCheck
}
