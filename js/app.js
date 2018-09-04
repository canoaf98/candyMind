var sections;
var width;
var height;

window.onload = init;//Se llama la función de carga

/**
* Función de carga al iniciar la ventana
**/
function init(){
  width = document.documentElement.clientWidth;
  height = document.documentElement.clientHeight;
  window.addEventListener("scroll", preventMotion, false);
  window.addEventListener("touchmove", preventMotion, false);
  setTimeout(loadSection, 5000);
  phaserGame();
}

/**
* función para prevenir eventos de scroll y de zoom
* @param event: evento a
**/
function preventMotion(event)
{
    window.scrollTo(0, 0);
    event.preventDefault();
    event.stopPropagation();
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

function phaserGame(){
  var game = Phaser.Game(width, height, Phaser.CANVAS, 'canvas', {preload: preload, create: create, update: update, render: render});

  function preload(){

  }

  function create(){

  }

  function update(){

  }

  function render(){

  }
}
