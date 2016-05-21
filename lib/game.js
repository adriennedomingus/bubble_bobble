var Bubble = require('../lib/bubbles');
var Dinosaur = require('../lib/dinosaur');
var Windup = require('../lib/windup');
var GamePlay = require('../lib/game_play');
var Levels = require('../lib/levels');
//
function Game(){
  this.canvas = document.getElementById('game');
  this.context = this.canvas.getContext('2d');
  this.dino = new Dinosaur(this.canvas);
  this.windup = new Windup(this.canvas);
  this.bubbles = [];
  this.fruits = [];
}

Game.prototype.play = function(){
  setKeyBindings(this.canvas, this.dino, this.bubbles);
  setStartScreen(gameLoop, this);
};

function gameLoop(){
  var game = this;
  var floors = new Levels().whichLevel(game.canvas, game.dino.level);
  game.context.clearRect(0, 0, game.canvas.width, game.canvas.height);
  GamePlay.drawFloors(floors, game.context);
  game.dino.move(floors).draw(game.context);
  GamePlay.drawBubbles(game.bubbles, game.context);
  game.windup = GamePlay.checkWindupBubbleCollisions(game.windup, game.bubbles);
  GamePlay.checkDinoBubbleCollisions(game.dino, game.bubbles, game.fruits, game.canvas);
  GamePlay.drawFruits(game.fruits, game.context);
  GamePlay.checkDinoFruitCollisions(game.dino, game.fruits);
  GamePlay.drawWindup(game.windup, game.context);
  GamePlay.checkDinoWindupCollisions(game.dino, game.windup);
  GamePlay.drawScore(game.dino, game.context);

  if (GamePlay.gameOver(game.dino)) {
    console.log("Game is over, please play again");
    return true;
  }
  var newWindup = GamePlay.levelUp(game.dino, game.fruits, game.windup, game.canvas, game.bubbles);
  if (newWindup) {
    GamePlay.nextLevel();
    game.windup = newWindup;
    // somehow clear out bubbles
  }
  requestAnimationFrame(gameLoop.bind(game));
}


function setKeyBindings(canvas, dino, bubbles){
  document.addEventListener('keydown', function(key) {
    if (key.keyCode === 65 ) {
      dino.left();
    } else if (key.keyCode === 68) {
      dino.right();
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
