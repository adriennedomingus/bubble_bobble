var Bubble = require('../lib/bubbles');
var Dinosaur = require('../lib/dinosaur');
var Windup = require('../lib/windup');
var GamePlay = require('../lib/game_play');
var Levels = require('../lib/levels');

var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

var dino_img_right = document.getElementById("dino_right");
var dino_img_left = document.getElementById("dino_left");
dino_img_right.style.visibility = 'hidden';
dino_img_left.style.visibility = 'hidden';

var dino = new Dinosaur(canvas, dino_img_left, dino_img_right);
var windup = new Windup(canvas);
var bubbles = [];
var fruits = [];

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

var startScreen = document.getElementById("start-screen");
startScreen.addEventListener('click', function(){
  startScreen.className += "hidden";
  requestAnimationFrame(gameLoop);
});

function gameLoop(){
  var floors = new Levels().whichLevel(canvas, dino.level);
  context.clearRect(0, 0, canvas.width, canvas.height);
  GamePlay.drawFloors(floors, context);
  dino.move(floors).draw(context);
  GamePlay.drawBubbles(bubbles, context);
  windup = GamePlay.checkWindupBubbleCollisions(windup, bubbles);
  GamePlay.checkDinoBubbleCollisions(dino, bubbles, fruits, canvas);
  GamePlay.drawFruits(fruits, context);
  GamePlay.checkDinoFruitCollisions(dino, fruits);
  GamePlay.drawWindup(windup, context);
  GamePlay.checkDinoWindupCollisions(dino, windup);
  if (GamePlay.gameOver(dino)) {
    console.log("Game is over, please play again");
    return true;
  }
  var newWindup = GamePlay.levelUp(dino, fruits, windup, canvas);
  if (newWindup) {
    windup = newWindup;
  }
  requestAnimationFrame(gameLoop);
}
