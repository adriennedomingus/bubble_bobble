var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

function Dinosaur() {
  this.x = canvas.width / 2;
  this.y = canvas.height - 10;
  this.height = 10;
  this.width = 10;
}

Dinosaur.prototype.draw = function() {
  context.fillRect(this.x, this.y, this.width, this.height);
  return this;
};

Dinosaur.prototype.left = function() {
  if (this.x > 0) {
    this.x--;
  }
  return this;
};

Dinosaur.prototype.right = function() {
  if (this.x < canvas.width - 10) {
    this.x++;
  }
  return this;
};

var dino = new Dinosaur();

document.addEventListener('keydown', function(key) {
  if (key.keyCode === 37 ) {
    dino.left();
  } else if (key.keyCode === 39) {
    dino.right();
  }
});

requestAnimationFrame(function gameLoop(){
  context.clearRect(0, 0, canvas.width, canvas.height);
  dino.draw();
  requestAnimationFrame(gameLoop);
});
