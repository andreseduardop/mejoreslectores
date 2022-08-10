// Al hacer doble clic en una palabra del texto: buscarla en la RAE
// y agregarla al glosario
var contenido = document.getElementById("main");
contenido.addEventListener("dblclick",()=>{
  let s = buscar_palabra();
  // si retorna algún texto
  if(s) {
    // Agregamos la palabra al glosario
    let glosario = document.getElementById("glosario");
    let item = document.createElement("li");
    item.innerText = s;
    glosario.appendChild(item);
  };
});

// Al hacer doble clic en una palabra del glosario buscarla en la RAE
var glosario = document.getElementById("seccion-glosario");
glosario.addEventListener("dblclick",()=>{
  buscar_palabra();
});

function buscar_palabra() {
  // creamos un variable s con la selecion del usuario y lo pasamos a string
  let s =  window.getSelection().toString();
  // si hay texto seleccionado lo copiamos al clipboard
  if(s) {
    // lo copiamos al clipboard
    document.execCommand('copy');
    // buscamos la palabra en la web de la RAE
    let rae = "https://dle.rae.es/" + s + "#resultados";
    let config_ventana = "height=600,width=400,top=500";
    window.open(rae, "diccionario", config_ventana);
  };
  return s; 
}
