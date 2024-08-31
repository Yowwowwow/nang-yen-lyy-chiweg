var dealtpieces;
var playedpieces;
var sea; //list of played pieces
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
function TurnStart(){
    if(mtn.length<=6-pnum){return;}//too few pieces left, liou2 jyu2
    let isplayer = turnp==pwind;
    jin = DrawFromMtn();
    SetField(dealtpieces, -2);
    dealtpieces++;
    draws[charpos[turnp]].innerHTML = PieceOf(isplayer?jin:-1);
    if(!isplayer){ComputerThinksPlay();}
    else{
        for(let i=0, arr=hands[charpos[turnp]].children;i<arr.length;i++)arr[i].onclick=()=>{PlayerPlays(i);};
        draws[charpos[turnp]].children[0].onclick=()=>{PlayerPlays(4);};
    }
}
function ComputerThinksPlay(){
    //TODO: will need to implement kang&riichi&tsumo
    let ans = Randint(srrou[turnp].length+1);
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
    //TODO: Now, check chi&pong&kang&ron before proceeding to the next player's turn
}
function PlayerPlays(num){
    console.log(num);
}