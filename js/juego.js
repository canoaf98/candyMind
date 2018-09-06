//https://www.youtube.com/watch?v=L07i4g-zhDA
var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");

// load images

var bird = new Image();
var bg = new Image();
var fg = new Image();
var pipeNorth = new Image();
var pipeSouth = new Image();

bird.src = "assets/PantallaJuego/Alien.png";
bg.src = "assets/PantallaJuego/Fondo_para_Repetir.png";
//fg.src = "Recursos/PantallaJuego/fondo estatico.png";
pipeNorth.src = "assets/PantallaJuego/Obstaculos-ConvertImage.png";
pipeSouth.src = "Recursos/PantallaJuego/Obstaculos.png";


// some variables

var gap = 100;// distancia entre los dos piés
var constant;

var bX = 50;// velocidad en x
var bY = 150;//velocidad en y

var gravity = 1.2;//valor de la gravedad

var score = 0;//puntaje inicial

// audio files

var fly = new Audio();
var scor = new Audio();

fly.src = "sounds/fly.mp3";
scor.src = "sounds/score.mp3";

// on key down

document.addEventListener("keydown",moveUp);

function moveUp(){
  bY -= 25;
  fly.play();
}

// pipe coordinates

var pipe = [];

pipe[0] = {
  x : cvs.width,
  y : 0
};

// draw images

function draw(){

  ctx.drawImage(bg,0,0);


  for(var i = 0; i < pipe.length; i++){

    constant = pipeNorth.height+gap;
    ctx.drawImage(pipeNorth,pipe[i].x,pipe[i].y);
    ctx.drawImage(pipeSouth,pipe[i].x,pipe[i].y+constant);

    pipe[i].x--;

    if( pipe[i].x == 50 ){//distancia entre cada pipe en x
      pipe.push({
        x : cvs.width,
        y : Math.floor(Math.random()*pipeNorth.height)-pipeNorth.height
      });
    }

    // detect collision

    if( bX + bird.width >= pipe[i].x && bX <= pipe[i].x + pipeNorth.width && (bY <= pipe[i].y + pipeNorth.height || bY+bird.height >= pipe[i].y+constant) || bY + bird.height >=  cvs.height - fg.height){
      location.reload(); // reload the page
    }

    if(pipe[i].x == 6){
      score++;
      scor.play();
    }


  }

  ctx.drawImage(fg,0,cvs.height - fg.height);

  ctx.drawImage(bird,bX,bY,);

  bY += gravity;

  ctx.fillStyle = "#fff";
  ctx.font = "20px Verdana";
  ctx.fillText("Score : "+score,10,cvs.height-20);

  requestAnimationFrame(draw);

}

draw();
