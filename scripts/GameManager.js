var dealtpieces;
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
function Give1Piece(){
    if(dealtpieces>=pnum*4){return;}//Finish initial draw and let dealer start their turn
    let tmp = mtn[0];
    mtn.splice(0, 1);
    SetField(dealtpieces, -2);
    let target = (dealtpieces + gwind[1]) % pnum;
    let isplayer = charpos[target]==0;
    srrou[target].push(tmp);
    hands[charpos[target]].innerHTML+=PieceOf(isplayer?tmp:-1);
    dealtpieces++;
    timeoutstoclear.push(lasttimeoutid = setTimeout(Give1Piece, 100));
}
