var Bubble = require('../lib/bubbles');
var Dinosaur = require('../lib/dinosaur');
var Windup = require('../lib/windup');
var GamePlay = require('../lib/game_play');
var Levels = require('../lib/levels');

function Game(canvas){
  this.canvas = canvas;
  this.context = canvas.getContext('2d');
  this.dino = new Dinosaur(this.canvas);
  this.windups = [new Windup(canvas), new Windup(canvas)];
  this.bubbles = [];
  this.fruits = [];
  this.keyPressed = {};
}

Game.prototype.play = function(){
  setKeyBindings(this);
  setStartScreen(gameLoop, this);
  setEndScreen(gameLoop, this);
};

Game.prototype.floors = function(){
  return new Levels().whichLevel(this.canvas, this.dino.level);
};

function gameLoop(){
  var game = this;
  GamePlay.respondToPresses(game);
  game.context.clearRect(0, 0, game.canvas.width, game.canvas.height);
  GamePlay.drawFloors(game.floors(), game.context);
  game.dino.move(game.floors()).draw(game.context);
  GamePlay.drawBubbles(game.bubbles, game.context);
  GamePlay.checkWindupBubbleCollisions(game.windups, game.bubbles);
  GamePlay.checkDinoBubbleCollisions(game.dino, game.bubbles, game.fruits, game.canvas);
  GamePlay.drawFruits(game.fruits, game.context);
  GamePlay.checkDinoFruitCollisions(game.dino, game.fruits);
  GamePlay.drawWindups(game.windups, game.context, game.dino);
  GamePlay.checkDinoWindupCollisions(game.dino, game.windups);
  GamePlay.drawScore(game.dino, game.context);
  if (GamePlay.gameOver(game.dino, game.bubbles, game.windups, game.fruits)) {
    GamePlay.endGameSequence();
    return true;
  }
  var newWindups = GamePlay.levelUp(game.dino, game.fruits, game.windups, game.canvas, game.bubbles);
  if (newWindups) {
    game.windups = newWindups;
    GamePlay.nextLevel(game);
  }
  requestAnimationFrame(gameLoop.bind(game));
}

function setKeyBindings(game){
  document.addEventListener('keydown', function(e) {
   game.keyPressed[e.keyCode] = true;
  }, false);
  document.addEventListener('keyup', function(e) {
    game.keyPressed[e.keyCode] = false;
  }, false);
}

function setStartScreen(gameLoop, game) {
  var startScreen = document.getElementById("start-screen");
  startScreen.addEventListener('click', function(){
    startScreen.className += "hidden";
    requestAnimationFrame(gameLoop.bind(game));
  });
}

function setEndScreen(gameLoop, game) {
  var endScreen = document.getElementById('end-game');
  endScreen.addEventListener('click', function(){
    game.dino = new Dinosaur(game.canvas);
    game.windups = [new Windup(game.canvas), new Windup(game.canvas)];
    game.bubbles = [];
    game.fruits = [];
    endScreen.className += "hidden";
    setKeyBindings(game.canvas, game.dino, game.bubbles);
    requestAnimationFrame(gameLoop.bind(game));
  });
}


module.exports = Game;
