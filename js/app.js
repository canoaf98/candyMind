var sections;
var width;
var height;
var back;
var score;
var alien;
var speedBack;
var gameSpeed;
var pole;
var poleNorth;
var time;
window.onload = init;//Se llama la función de carga

/**
* Función de carga al iniciar la ventana
**/
function init(){
  width = document.documentElement.clientWidth;
  height = document.documentElement.clientHeight;
  window.addEventListener("scroll", preventMotion, false);
  window.addEventListener("touchmove", preventMotion, false);
  width = 800;
  height = width*2;
  //the default speed of the game
  speedBack = 10;
  //Game speed
  gameSpeed = -50;
  setTimeout(loadSection, 900 );
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

//Create our 'main' state that will conatin the game

function phaserGame(){

  var mainState = {
    preload: function(){
      // This function will be executed at the beginning
      // That's where we load the images and sounds
      game.load.image('alien', 'assets/pantallaJuego/Alien.png', 40, 60);
      game.load.image('background', 'assets/pantallaJuego/Fondo_para_Repetir.png');
      game.load.image('pipe-normal', 'assets/pantallaJuego/Obstaculos.png');
      game.load.image('pipe-inverted', 'assets/pantallaJuego/Obstaculos_invertido.png');
    },

    create: function(){
      //This function is called after the preload function
      // Here we set up the game, display sprites, etc.

      // Change the background color of the game to blue
      //  game.stage.backgroundColor = '#71c5cf';

      // Set the physics system
      game.physics.startSystem(Phaser.Physics.ARCADE);


      // Display the background
      back = game.add.image(0, -400, 'background');
      back.scale.set(1);
      back.smoothed = false;
      // Display the bird at the position x=100 and y=width/2
      alien = game.add.sprite(10, 10, 'alien', 5);
      alien.scale.set(0.04);
      alien.smoothed = false;
      alien.anchor.setTo(-0.2, 0.5);
      //Add physics to the Alien
      //Needed for: movements, gravity, collisions, etc.
      game.physics.arcade.enable(alien);

      // Add gravity to the bird to make it fall
      alien.body.gravity.y = 1000;

      //Call the 'jump' function when the spacekey is hit
      var spaceKey = game.input.keyboard.addKey(
        Phaser.Keyboard.SPACEBAR
      );
      spaceKey.onDown.add(this.jump, this);

      //pipe time
      this.pipes = game.add.group();

      // initial time = 2secs
      time = 2000;

      //timer for increase level
      timer = game.time.create(false);
      timer.loop(time, function(){
        this.updateSpeed();
        this.addOnePipeRow(width*2);

      }, this);
      timer.start();

    },

    updateSpeed: function(){
      speedBack += 0.5;
      gameSpeed -= 0.5;
      time -= 0.0001;
    },

    update: function(){
      //This function is called 60 times per second
      //It contains the game's logic

      //If the alien is out of the screen (too high or too low)
      //Call the 'restartGame' function

      if (alien.angle < 5) alien.angle += 0.5;
      if(alien.y < 0 - (width/2) || alien.y > width) {
        this.restartGame();
      }

      // Move the background
      var actual = Math.abs(back.x);
      if(actual > (((back.width - width) - (width/2)) - (width + (width/2 )))){
        back.x = 0;
      }
      back.x -= speedBack;

      game.physics.arcade.overlap(alien, this.pipes, this.restartGame, null, this);
    },

    // Make the bird jump
    jump: function(){
      // Add a vertical velocity to the alien
      // Create an animation on the alien
      var animation = game.add.tween(alien);

      // Change the angle of the bird to -20° in 100 milliseconds
      animation.to({angle: -2}, 100);

      // And start the animation
      animation.start();
      alien.body.velocity.y = -350;
    },
    //Restart the Game
    restartGame: function(){
      //Start the 'main' state, wich restart the game
      game.state.start('main');
    },

    updateScore: function(){
      score++;
    },

    addOnePipeRow: function(x){
      //normal pipe
      y = width/2;
      var limInf = Math.floor(Math.random() * width/2) + alien.height*2;
      var limSup = -limInf* 2;
      var pipeNormal = game.add.sprite(x, limInf, 'pipe-normal');

      var pipeInverted = game.add.sprite(x, limInf - (alien.height * 2) - width, 'pipe-inverted');

      //Reduce size of the sprite
      pipeNormal.scale.set(0.3);

      pipeInverted.scale.set(0.3);

      pipeNormal.smoothed = false;

      pipeInverted.smoothed = false;

      //Enable game physics
      game.physics.arcade.enable([pipeNormal, pipeInverted]);


      //ENable velocity
      pipeNormal.body.velocity.x = gameSpeed*10;

      pipeInverted.body.velocity.x = gameSpeed*10;

      //Enable pipe movemnt backwards

      this.pipes.add(pipeInverted);

      this.pipes.add(pipeNormal);

      pipeNormal.checkWorldBounds = true;
      pipeNormal.outOfBoundsKill = true;
      pipeInverted.checkWorldBounds = true;
      pipeInverted.outOfBoundsKill = true;

    },

    render: function(){

    }
  };

  //Initialize Phaser, and create a 400px by 490px game
  var game = new Phaser.Game(height, width, Phaser.CANVAS);
  game.state.add('main', mainState);

  //Star the state to actually start the Game
  game.state.start('main');
}
