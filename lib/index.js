var Bubble = require('../lib/bubbles');
var Dinosaur = require('../lib/dinosaur');
var Collision = require('../lib/collision')

var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

var dino_img_right = document.getElementById("dino_right");
var dino_img_left = document.getElementById("dino_left");
dino_img_right.style.visibility = 'hidden';
dino_img_left.style.visibility = 'hidden';

var dino = new Dinosaur(canvas, dino_img_left, dino_img_right);
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

function collide(bubble) {
  for(var i = bubble.y; i <= bubble.height; i) {
    if (i > dino.y)
  }

  for(var j = bubble.x; j <= bubble.x+bubble.width; j++) {
    if (j >= dino.x && j<= dino.x+dino.width) {
      return true;
    }
  }
  return false;
  //bubblex range is bubble.x.. bubble.x+bubble.width
  //bubbley range is bubble.y.. bubble.y-bubble.height
  //bubblex range is bubble.x.. bubble.x+bubble.width
  //bubbley range is bubble.y.. bubble.y-bubble.height
}

requestAnimationFrame(function gameLoop(){
  context.clearRect(0, 0, canvas.width, canvas.height);
  dino.move().draw(context);
  bubbles.forEach(function(bubble, index){
    if (collide(bubble, dinosaur)) {

    }
    bubble.move().draw(context);
  });
  requestAnimationFrame(gameLoop);
});
