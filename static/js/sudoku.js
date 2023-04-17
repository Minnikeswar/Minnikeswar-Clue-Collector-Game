let digitSelected = null;
let blockSelected = null;
let hintsCount = 3;

let filled = 0;
let errors = 0;
let initialBoard = [
    '-7--2-9--',
    '-4-8-6---',
    '-12---3--',
    '------87-',
    '-6-972-5-',
    '-25------',
    '--1---29-',
    '---5-4-3-',
    '--7-6--1-'
]
let finalBoard = [
    '876123945',
    '543896721',
    '912745386',
    '394651872',
    '168972453',
    '725438169',
    '651387294',
    '289514637',
    '437269518'
]

window.onload = function(){
    initialize();
}

function initialize() {
    for (let index = 1; index <= 9 ; index++) {
        let b = document.createElement("div");
        b.id = index;
        b.innerText = index;
        b.classList.add("block");
        b.addEventListener("click" , selectDigit);
        document.getElementById("digits").appendChild(b);    
    }
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let a = document.createElement("div");
            a.id = `${i}-${j}`;
            a.classList.add("block1");
            if(i == 2 || i == 5) a.classList.add("bottom-border");
            if(j == 2 || j == 5) a.classList.add("right-border");
            if(initialBoard[i][j] != "-"){
                filled++;
                a.innerText = initialBoard[i][j];
                a.classList.add("block-fixed")
            }
            a.addEventListener("click" , selectBlock);
            document.getElementById("board").appendChild(a);
        }        
    }
    document.getElementById('hint-button').addEventListener('click' , solvePartial);
}

function solvePartial() {
    if(hintsCount <= 0) return;
    document.getElementById("hint-count").innerText = --hintsCount;
    let tofill = 5;
    for (let i = 0; (i < 9) && (tofill > 0); i++) {
        for (let j = 0; (j < 9) && (tofill > 0); j++) {
            let content = document.getElementById(`${i}-${j}`).innerText;
            if(content !='') continue;
            document.getElementById(`${i}-${j}`).innerText = finalBoard[i][j];
            filled++;
            tofill--;
            if(filled == 81){
                setTimeout(()=>{
                    alert('You are promoted to next level!!!');
                    window.location.href = '/clue-5?data=' + encodeURIComponent(errors);
                },500);
            }
        }        
    }
}

function selectDigit(){
    if(digitSelected != null){
        digitSelected.classList.remove("block-selected");
    }
    digitSelected = this;
    digitSelected.classList.add("block-selected");
}
function selectBlock(){
    if(digitSelected != null){
        blockSelected = this;
        if(blockSelected.innerText == "" ){
            let id = blockSelected.id;
            let index = id.split("-");
            if(finalBoard[Number(index[0])][Number(index[1])] == digitSelected.id){
                blockSelected.innerText = digitSelected.id;
                filled++;
                if(filled == 81){
                    setTimeout(()=>{
                        alert('You are promoted to next level!!!');
                        window.location.href = '/clue-5?data=' + encodeURIComponent(errors);
                    },500);
                }
            }
            else{
                document.getElementById("error-count").innerText = ++errors;
            }
        }
    }
}