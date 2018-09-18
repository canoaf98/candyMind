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
var positions;
var backButton;
var candys;

window.onload = init;//Se llama la función de carga

/**
* Función de carga al iniciar la ventana
**/
function init(){

  //Disable scroll
  window.addEventListener("scroll", preventMotion, false);

  //Disable zoom
  window.addEventListener("touchmove", preventMotion, false);

  //Initialize width of the frame
  width = 480;

  //Initilize height of the frame
  height = 854;

  //load screen, param function and time in miliseconds
  setTimeout(loadSection, 900 );

  //positions of the pipe
  positions = [400, 410, 430, 450, 470, 490,  500, 510, 530, 550, 570, 590,  600, 610, 630, 650, 670, 690];

  //Initialize de game, last but not least
  phaserGame();

}

/**
* función para prevenir eventos de scroll y de zoom
* @param event: evento a
**/
function preventMotion(event){
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

  event.preventDefault(); //Disable default function
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


/**
* Main function of the game
**/
function phaserGame(){

  //Create our 'main' state that will conatin the game
  var mainState = {
    preload: function(){
      // This function will be executed at the beginning
      // That's where we load the images and sounds
      game.load.image('alien', 'img/pantallaJuego/Alien.png', 40, 60);
      game.load.image('background', 'img/pantallaJuego/Fondo_para_Repetir.png');
      game.load.image('pipe-normal', 'img/pantallaJuego/Obstaculos.png');
      game.load.image('pipe-inverted', 'img/pantallaJuego/Obstaculos_invertido.png');
      game.load.image('back-button', 'img/pantallaJuego/Boton_salir.png');
      game.load.image('candy1', 'img/pantallaJuego/Dulce1.png');
      game.load.image('candy2', 'img/pantallaJuego/Dulce2.png');
      game.load.image('candy3', 'img/pantallaJuego/Dulce3.png');
    },

    create: function(){
      //This function is called after the preload function
      // Here we set up the game, display sprites, etc.

      // Change the background color of the game to blue
      //  game.stage.backgroundColor = '#71c5cf';

      // Set the physics system
      game.physics.startSystem(Phaser.Physics.ARCADE);

      // initial time = 2secs
      time = 3000;

      //the default speed of the game
      speedBack = 10;

      //Game speed
      gameSpeed = -50;

      // Display the background
      back = game.add.image(0, -400, 'background');
      back.scale.set(1);
      back.smoothed = false;

      // Display the bird at the position x=100 and y=width/2
      alien = game.add.sprite(10, 10, 'alien', 5);
      alien.scale.set(0.06);
      alien.smoothed = false;
      alien.anchor.setTo(-0.2, 0.5);

      //back button
      button = game.add.button(10, 10, 'back-button', this.actionOnClick, this, 2, 1, 0);
      button.scale.set(0.2);

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

      //Candy time
      candys = game.add.group();
      candys.enableBody = true;

      //score time
      score = 0;
      this.labelScore =  game.add.text(150, 10, score, {
              font: '64px Arial',
              fill: '#ffffff'
            });

      //timer for increase levelspeed
      timer = game.time.create(false);
      timer.loop(time, function(){
        this.updateSpeed();
        this.addOnePipeRow(width);
        this.createCandy();

      }, this);
      timer.start();

    },
    createCandy: function(){
      var arrayCandys = [];
      for (var i = 0; i < 3; i++) {
        var tittle = 'candy' + (i+1);
        arrayCandys.push(tittle);
      }
      for (var i = 0; i < 2; i++) {

        var indexRandom = Math.floor(Math.random()*3 + 1);
        var candy = candys.create(game.world.randomX, game.world.randomY, arrayCandys[indexRandom]);
        candy.scale.setTo(0.05);
        candy.name = 'candy' + candy;
        candy.colliderWorldBounds = true;
        candy.body.velocity.setTo(gameSpeed*3, 0);

      }
    },

    actionOnClick: function(){
      displaySection('index');
    },

    updateSpeed: function(){
      speedBack += 0.1 //Background speed update;
      gameSpeed -= 0.5; //pipes speed update
      //time -= 0.0001; //App time to update
    },

    update: function(){
      //This function is called 60 times per second
      //It contains the game's logic


      if (alien.angle < 5) alien.angle += 0.5;

      //If the alien is out of the screen (too high or too low)
      //Call the 'restartGame' function
      if(alien.y < 0 - (height/2) || alien.y > height) {
        this.restartGame();
      }

      // Move the background
      var actual = Math.abs(back.x);
      if(actual > back.width - width){
        back.x = 0;
      }
      back.x -= speedBack;

      //Candy Collisions
      game.physics.arcade.overlap(alien, candys, this.updateScore, null, this);

      //Pipes collisions
      game.physics.arcade.overlap(alien, this.pipes, this.restartGame, null, this);
    },

    // Make the bird jump
    jump: function(){
      // Add a vertical velocity to the alien
      // Create an animation on the alien
      var animation = game.add.tween(alien);

      // Change the angle of the alien to -2° in 100 milliseconds
      animation.to({angle: -2}, 100);

      // And start the animation
      animation.start();
      alien.body.velocity.y = -350;
    },
    //Restart the Game
    restartGame: function(){
      //Loose screen

      //Reset gamespeed, time and background speed

      // initial time = 2secs
      time = 2000;

      //the default speed of the game
      speedBack = 10;

      //Game speed
      gameSpeed = -50;

      score = 0;


      //Start the 'main' state, wich restart the game
      game.state.start('main');
    },

    updateScore: function(candy){
      score++;
      this.labelScore.text = score;

    },

    addOnePipeRow: function(x){
      //normal pipe
      var index = Math.floor(Math.random() * (positions.length - 1));
      var limInf = positions[index];
      var pipeNormal = game.add.sprite(x, limInf, 'pipe-normal');

      var pipeInverted = game.add.sprite(x, limInf - width - alien.height*2.5, 'pipe-inverted');

      //Reduce size of the sprite
      pipeNormal.scale.set(0.3);

      pipeInverted.scale.set(0.3);

      pipeNormal.smoothed = false;

      pipeInverted.smoothed = false;

      //Enable game physics
      game.physics.arcade.enable([pipeNormal, pipeInverted]);


      //ENable velocity
      pipeNormal.body.velocity.x = gameSpeed*3;

      pipeInverted.body.velocity.x = gameSpeed*3;

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
  var game = new Phaser.Game(width, height, Phaser.CANVAS);
  game.state.add('main', mainState);

  //Star the state to actually start the Game
  game.state.start('main');
}

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
        init();
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {

    }
};

app.initialize();
