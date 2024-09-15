var dealtpieces;
var playedpieces;
var sea; //list of played pieces
var newp; //last played piece
const nodraw = 87;
function GMNGStartRound(){
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
        let j = charpos[i];
        hands[j].innerHTML = "";
        fulus[j].innerHTML = "";
        draws[j].innerHTML = "";
        draws[j].dataset.mov = 0;
    }
    //TODO: Complete initialization of each new jyu2 (UPDATE 2024AUG31: probably done, so far)
    timeoutstoclear.push(setTimeout(()=>{dealtpieces=0;Give1Piece();}, 250));
}
function DrawFromMtn(num=0){//pass 1 to this function to draw from tail, otherwise, draw from head
    if(num!=1){//draw from head (normal draw)
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
        jin = DrawFromMtn();
        SetField(dealtpieces, -2);
        dealtpieces++;
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
    //TODO: Now, check chi&pong&kang&ron before proceeding to the next player's turn
    //Logic: if player can (ron&&(chi||pong||kang)), give all options to player first, but if player chooses to
    //chi, pong or kang (not ron), the computers may interrupt the player by choosing a higher priority action
    //(in this case, must be ron). However, when player can only (chi||pong||kang) (but not ron), we simply
    //just check whether computers want to perform a higher priority action before letting player choose, and
    //the player will not be interupted in this case. Priority high to low: 1. Ron, 2. Pong closer to the player
    //discarding the piece when two players can pong at the same time, 3. Further/solo pong or kang, 4. chi
    if(RonCheck())return;
    if(newp==6||newp==16)PongKangCheck(true);
    else if(newp%10>=3&&newp%10<=5)ChiCheck();
    else{
        //TODO: Go to the next turn
        //PongKangCheck and ChiCheck will also handle going to the next turn
    }
}
function PlayerPlays(num){
    console.log(num);
}
function PongKangCheck(askplayer=true){ //if nobody pongs/kangs then return false, otherwise true
    if(newp!=6&&newp!=16){alert("Wrong PongKangCheck call that shouldn't happen!!!!");return;}
    let metplayer = askplayer;
    for(let i=1;i<pnum;i++){
        let j = (turnp+i)%pnum;
        if(!askplayer&&j==pwind){metplayer=true;continue;}if(!metplayer)continue;
        let tmp = 0;
        for(let k=0;k<srrou[j].length;k++)if(srrou[j][k]==newp)tmp++;
        if(tmp<2)continue;
        if(j==pwind){
            if(askplayer){
                //TODO: Function to show pong/kang buttons and wait for player response
                //If player chooses to cancel, we then run PongKangCheck(false);
                return;
            }
        }
        else{if(LogicPongKang(j, newp))return;}
    }
}
function ChiCheck(){
    return;
    //TODO: Implement ChiCheck
}
function LogicPongKang(who, tar){ //tar is target, the piece just discarded
    return false;
    //TODO: Implement computer Pong Kang logic
}
function RonCheck(){ //if nobody rons then return false, otherwise true
    return false;
    //TODO: this too hard bruh, will do later
}