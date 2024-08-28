function GMNGStartRound(){
    let bag = [0,1,1,2,2,3,3,4,4,5,5,6,6,6,6,6,10,11,11,12,12,13,13,14,14,15,15,16,16,16,16,16];
    mtn = [];
    for(let i=0;i<32;i++){
        SetField(i, -1, 0);
        let tmp = CryRandint(bag.length);
        mtn.push(bag[tmp]);
        bag.splice(tmp, 1);
    }
    //TODO: Complete initialization of each new shyun2
}