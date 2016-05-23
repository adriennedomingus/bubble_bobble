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
}

Game.prototype.play = function(){
  setKeyBindings(this);
  setStartScreen(this);
  setEndScreen(this);
};

Game.prototype.floors = function(){
  return new Levels().whichLevel(this.canvas, this.dino.level);
};

Game.prototype.draw = function() {
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  GamePlay.drawElementOnCanvas(this.context, this.dino);
};

function gameLoop(){
  var game = this;
  game.dino.move(game.floors());
  game.draw();
  GamePlay.drawFloors(game.floors(), game.context);
  GamePlay.drawBubbles(game.bubbles, game.context);
  GamePlay.drawFruits(game.fruits, game.context);
  GamePlay.drawWindups(game.windups, game.context, game.dino);
  GamePlay.drawScore(game.dino, game.context);
  GamePlay.checkWindupBubbleCollisions(game.windups, game.bubbles);
  GamePlay.checkDinoBubbleCollisions(game.dino, game.bubbles, game.fruits, game.canvas);
  GamePlay.checkDinoFruitCollisions(game.dino, game.fruits);
  GamePlay.checkDinoWindupCollisions(game.dino, game.windups);
  if (GamePlay.gameOver(game.dino, game.bubbles, game.windups, game.fruits)) {
    console.log("Game is over, please play again");
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
  document.addEventListener('keydown', function(key) {
    if (key.keyCode === 65 ) {
      game.dino.left(game);
    } else if (key.keyCode === 68) {
      game.dino.right(game);
    } else if (key.keyCode === 87 || key.keyCode === 75) {
      game.dino.setJumpingStatus();
    } else if (key.keyCode === 32 || key.keyCode === 74) {
      key.preventDefault();
      var bubble = new Bubble(game.dino.mouthX(), game.dino.mouthY(), game.dino.direction, game.canvas);
      game.bubbles.push(bubble);
    }
  });
}

function setStartScreen(game) {
  var startScreen = document.getElementById("start-screen");
  startScreen.addEventListener('click', function(){
    startScreen.className += "hidden";
    requestAnimationFrame(gameLoop.bind(game));
  });
}

function setEndScreen(game) {
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
