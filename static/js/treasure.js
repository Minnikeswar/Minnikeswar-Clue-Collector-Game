document.getElementById('treasure-btn').addEventListener("click" , solve);
function solve() {
    let first = document.getElementById('ans-1').value;
    let second = document.getElementById('ans-2').value;
    let third = document.getElementById('ans-3').value;
    let fourth = document.getElementById('ans-4').value;
    if(first != 4 || second != 6 || third != 0 || fourth != 27){
        alert('Wrong answer');
        return;
    }
    let temp = document.getElementById("treasure-img");
    temp.classList.add('modified');
    setTimeout(() => {
        temp.classList.add('closed');
    },2000);
    setTimeout(() => {
        alert("Congratulations!!! You have found the Looooot!");
        window.location.href = '/homepage'
    },3000);
}