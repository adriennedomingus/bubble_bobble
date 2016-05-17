var Bubble = require('../lib/bubbles');
var Dinosaur = require('../lib/dinosaur');
var Collision = require('../lib/collision');
var Windup = require('../lib/windup');

var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

var dino_img_right = document.getElementById("dino_right");
var dino_img_left = document.getElementById("dino_left");
dino_img_right.style.visibility = 'hidden';
dino_img_left.style.visibility = 'hidden';

var dino = new Dinosaur(canvas, dino_img_left, dino_img_right);
var windup = new Windup(canvas);
var bubbles = [];

document.addEventListener('keydown', function(key) {
  if (key.keyCode === 65 ) {
    dino.left();
  } else if (key.keyCode === 68) {
    dino.right();
  } else if (key.keyCode === 87 || key.keyCode === 75) {
    if (!dino.status) { dino.status = "jumping"; }
  } else if (key.keyCode === 32 || key.keyCode === 74) {
    var bubble = new Bubble(dino.mouthX(), dino.mouthY(), dino.direction, canvas);
    bubbles.push(bubble);
  }
});

requestAnimationFrame(function gameLoop(){
  context.clearRect(0, 0, canvas.width, canvas.height);
  dino.move().draw(context);
  bubbles.forEach(function(bubble){
    if (Collision.collideBubbleDinosaur(bubble, dino)) {
      bubble.status = "popped";
    }
    if (bubble.status !== "popped") {
      bubble.move().draw(context);
    }
  });
  windup.draw(context).fall().move();
  requestAnimationFrame(gameLoop);
});
