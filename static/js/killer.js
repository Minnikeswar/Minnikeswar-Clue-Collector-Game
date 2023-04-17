let errors = 0;
const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))

document.getElementById("person-1").addEventListener("click" , option1);
document.getElementById("person-2").addEventListener("click" , option1);
function option1(){
    if(!this.classList.contains("selected-wrong")){
        this.classList.add("selected-wrong");
        document.getElementById("error-count").innerText = ++errors;
    }
}

document.getElementById("person-3").addEventListener("click" , option3);
function option3(){
    if(!this.classList.contains("selected-correct")){
        this.classList.add("selected-correct");
        setTimeout(()=>{
            alert('You are promoted to next level!!!');
            window.location.href = '/clue-2?data=' + encodeURIComponent(errors);
        } , 1000);
    }
}