// ENCUESTA DE SATISFACCIÓN DE USUARIO 
// Get elements
var encuesta = document.getElementById('encuesta');
var votos = encuesta.querySelectorAll('td');
// Flag voto
var haVotado = false;

var dominio = document.location.hostname;
// var dominio = "mejoreslectores.netlify.app";
console.log(dominio); 
if (dominio != "mejoreslectores.netlify.app") {
  encuesta.style.display = "none";
}

// manejador de clic
function sumarVoto(voto) {
  let votoPulsado = voto.currentTarget;
  if (!haVotado) {
    haVotado = true;
    encuesta.style.opacity = ".4";
    encuesta.style.cursor = "default";
    encuesta.classList.remove('activada');
    // Agregar voto
    let xhr = new XMLHttpRequest();
    let registro = votoPulsado.parentElement.dataset.actividad;
    registro += "-"+votoPulsado.dataset.calificacion;
    url = "https://api.countapi.xyz/hit/mejoreslectores.com/encuesta-voto-"+registro;
    xhr.open("GET", url);
    xhr.responseType = "json";
    xhr.onload = function() {
        console.log(`Tiene ${this.response.value} votos`);
    }
    xhr.send();
  }
};
// Add listeners for click
votos.forEach(voto => {
  voto.addEventListener('click', function(voto){sumarVoto(voto)}, true)
});

