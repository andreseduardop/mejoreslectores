// Funciones para BUSQUEDA DE PALABRAS
// Al hacer doble clic en una palabra del texto: buscarla en la RAE
// y agregarla al glosario
var contenido = document.getElementById("main");
contenido.addEventListener("dblclick",()=>{
  // si retorna algún texto
  let palabra = buscar_palabra();
  if(palabra) {
    // Agregamos la palabra al glosario
    let glosario = document.getElementById("glosario-lista");
    let item = document.createElement("li");
    item.innerText = palabra;
    glosario.appendChild(item);
  };
});

// Al hacer doble clic en una palabra del glosario buscarla en la RAE
var glosario = document.getElementById("glosario-lista");
glosario.addEventListener("dblclick",()=>{
  buscar_palabra();
});

function buscar_palabra() {
  let palabra =  window.getSelection().toString().trim();
  // creamos un variable palabra con la selecion del usuario y lo pasamos a string
  // si hay texto seleccionado lo copiamos al clipboard
  if(palabra) {
    // lo copiamos al clipboard
    document.execCommand('copy');
    // buscamos la palabra en la web de la RAE
    let rae = "https://dle.rae.es/" + palabra + "#resultados";
    let config_ventana = "height=600,width=400,top=500";
    window.open(rae, "diccionario", config_ventana);
  };
  return palabra;
}
