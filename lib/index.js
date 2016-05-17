var Bubble = require('../lib/bubbles');
var Dinosaur = require('../lib/dinosaur');

var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

var dino = new Dinosaur.dinosaur();
var bubbles = [];

document.addEventListener('keydown', function(key) {
  if (key.keyCode === 65 ) {
    dino.left();
  } else if (key.keyCode === 68) {
    dino.right();
  } else if (key.keyCode === 87 || key.keyCode === 75) {
    if (!dino.status) { dino.status = "jumping"; }
  } else if (key.keyCode === 32 || key.keyCode === 74) {
    var bubble = new Bubble.bubble(dino.mouthX(), dino.mouthY(), dino.direction);
    bubbles.push(bubble);
  }
});

requestAnimationFrame(function gameLoop(){
  context.clearRect(0, 0, canvas.width, canvas.height);
  dino.move().draw();
  bubbles.forEach(function(bubble){
    bubble.move().draw();
  });
  requestAnimationFrame(gameLoop);
});
