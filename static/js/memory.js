var firstSelected = -1;
let clicked = false;
let hidden = 12;
let errors = 0;

function solve(e) {
    let curr = e.currentTarget;
    if(!curr.classList.contains("hidden") || clicked) return;
    if(firstSelected == -1){
        firstSelected = curr.id;
        curr.classList.remove("hidden");
        return;
    }
    curr.classList.remove("hidden");
    let item = curr.id;
    if(item.charAt(0) == firstSelected.charAt(0)){
        hidden -=2;
        if(hidden == 0){
            setTimeout(()=>{
                alert('You are promoted to next level!!!');
                window.location.href = '/clue-3?data=' + encodeURIComponent(errors);
            },500);
        }
    }
    else{
        let secondSelected = curr.id;
        let x = firstSelected;
        clicked = true;
        setTimeout(function () {
            document.getElementById(secondSelected).classList.add("hidden");
            document.getElementById(x).classList.add("hidden");
            clicked = false;
        },500);
        document.getElementById('error-count').innerText = ++errors;
    }
    firstSelected = -1;
}

window.onload = function () {
    let blocks = document.getElementById("grid-div").getElementsByTagName("div");
    for(let i = 0 ; i < blocks.length ; i++){
        blocks[i].addEventListener("click" , solve);
    }
}
