var sections;


window.onload = init;//Se llama la función de carga

/**
* Función de carga al iniciar la ventana
**/
function init(){

  setTimeout(loadSection, 50);
}

/**
* función que muestra la pantalla de carga y luego la culta por la principal
**/
function loadSection(){
  document.getElementById('carga').style.display = "none";
  document.getElementById('index').style.display = "block";
}

/**
* Función para mostar una sola sección en especifico.
* @param sectionName: nombre de la seccion que se va a mostrar
**/
function displaySection(sectionName){
  event.preventDefault();
  sections = document.getElementsByTagName('section');
  for (var i = 0; i < sections.length; i++) {

    if(sections[i].id == sectionName){
      sections[i].style.display = "block";
    }
    else{
      sections[i].style.display = "none";
    }
  }
}
