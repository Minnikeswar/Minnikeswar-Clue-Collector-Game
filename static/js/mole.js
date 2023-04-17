let score = 0;
let taps = 0;

let currMole = null;
let currCactus = null;

window.onload= function(){
    initialize();
};

function getRandomIndex() {
    return Math.floor(Math.random()*9);
}

function sendMole() {
    if(currMole) currMole.remove();
    let ind = getRandomIndex();
    if(document.getElementById(ind).querySelector("div") !=null) return;
    let mole = document.createElement("div");
    currMole = mole;
    mole.classList.add('mole');
    document.getElementById(ind).appendChild(mole);
}

function sendCactus() {
    if(currCactus) currCactus.remove();
    let ind = getRandomIndex();
    if(document.getElementById(ind).querySelector("div") !=null) document.getElementById(ind).querySelector("div").remove();
    let cactus = document.createElement("div");
    currCactus = cactus;
    cactus.classList.add("cactus");
    document.getElementById(ind).appendChild(cactus);
    
}

function updateScore() {
    let curr = this.querySelector("div");
    if(curr == null) return;
    taps++;
    if(curr.classList.contains("mole")) score += 5;
    else score -= 5;
    document.getElementById("score").innerText = score;
    if(score == 75){
        setTimeout(()=>{
            alert('You are promoted to next level!!!');
            window.location.href = '/clue-4?data=' + encodeURIComponent(taps);
        },500);
    }
}

function initialize() {
    for(let i = 0 ; i < 9 ; i++ ){
        let temp = document.createElement("div");
        temp.classList.add("block");
        temp.id = i;
        temp.addEventListener("click" , updateScore);
        document.getElementById("grid-div").appendChild(temp);
    }
    setInterval(sendMole , 1000);
    setInterval(sendCactus , 1000);

}