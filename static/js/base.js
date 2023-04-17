document.getElementById("home-button").addEventListener("click" , home);
function home() {
    let message = prompt('You will be redirected to home page. \n It may reduce your rating. Enter \'YES\' to confirm abort')
    if(message === 'YES') window.location.href = '/homepage';
}