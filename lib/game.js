var Bubble = require('../lib/bubbles');
var Dinosaur = require('../lib/dinosaur');
var Windup = require('../lib/windup');
var GamePlay = require('../lib/game_play');
var Levels = require('../lib/levels');

function Game(){
  this.canvas = document.getElementById('game');
  this.context = this.canvas.getContext('2d');
  this.dino = new Dinosaur(this.canvas);
  this.windups = [new Windup(this.canvas), new Windup(this.canvas)];
  this.bubbles = [];
  this.fruits = [];
}

Game.prototype.play = function(){
  setKeyBindings(this.canvas, this.dino, this.bubbles, this);
  setStartScreen(gameLoop, this);
};

Game.prototype.floors = function(){
  return new Levels().whichLevel(this.canvas, this.dino.level);
};

function gameLoop(){
  var game = this;
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
    console.log("Game is over, please play again");
    return true;
  }
  var newWindup = GamePlay.levelUp(game.dino, game.fruits, game.windups, game.canvas, game.bubbles);
  if (newWindup) {
    game.windups = newWindup;
    GamePlay.nextLevel();
    // somehow clear out bubbles
  }
  requestAnimationFrame(gameLoop.bind(game));
}

function setKeyBindings(canvas, dino, bubbles, game){
  document.addEventListener('keydown', function(key) {
    if (key.keyCode === 65 ) {
      dino.left(game);
    } else if (key.keyCode === 68) {
      dino.right(game);
    } else if (key.keyCode === 87 || key.keyCode === 75) {
      dino.setJumpingStatus();
    } else if (key.keyCode === 32 || key.keyCode === 74) {
      key.preventDefault();
      var bubble = new Bubble(dino.mouthX(), dino.mouthY(), dino.direction, canvas);
      bubbles.push(bubble);
    }
  });
}

function setStartScreen(gameLoop, game) {
  var startScreen = document.getElementById("start-screen");
  startScreen.addEventListener('click', function(){
    startScreen.className += "hidden";
    requestAnimationFrame(gameLoop.bind(game));
  });
}

module.exports = Game;
