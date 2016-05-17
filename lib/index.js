var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

// DINOSAUR stuff --------------------------------------------------------------
var dino_img_right = document.getElementById("dino_right");
var dino_img_left = document.getElementById("dino_left");
dino_img_right.style.visibility = 'hidden';
dino_img_left.style.visibility = 'hidden';

var jumpSteps = 15;
var jumpTotal = 30;
var jumpSize = jumpTotal/jumpSteps;

function Dinosaur() {
  this.height = 25;
  this.width = 25;
  this.x = canvas.width / 2;
  this.y = canvas.height - this.height;
  this.status = null;
  this.direction = "right";
  this.count = 0;
}

Dinosaur.prototype.mouthX = function() {
  if (this.direction === "right"){
    return this.x+this.width;
  } else {
    return this.x;
  }
};

Dinosaur.prototype.mouthY = function() {
  return this.y+this.height/2;
};

Dinosaur.prototype.dino_img = function() {
  if (this.direction === "right") {
    return dino_img_right;
  } else {
    return dino_img_left;
  }
};

Dinosaur.prototype.draw = function() {
  context.drawImage(this.dino_img(), this.x, this.y, this.width, this.height);
  return this;
};

Dinosaur.prototype.left = function() {
  if (this.x > 0) {
    this.x -= 5;
    this.direction = "left";
  }
  return this;
};

Dinosaur.prototype.right = function() {
  if (this.x < canvas.width - 10) {
    this.x += 5;
    this.direction = "right";
  }
  return this;
};

Dinosaur.prototype.move = function() {
  if (this.status === "jumping") {
    this.jump();
  }
  return this;
};

Dinosaur.prototype.jump = function() {
  if ( this.count < jumpSteps ){
    this.count++;
    this.y -= jumpSize;
  } else if (this.count >= jumpSteps && this.count < 2*jumpSteps) {
    this.count++;
    this.y += jumpSize;
  } else if (this.count === 2*jumpSteps) {
    this.status = null;
    this.count = 0;
  }
  return this;
};

// mMM BUBBLES  ----------------------------------------------------------------
function Bubble(x, y, direction){
  this.x = x;
  this.y = y;
  this.direction = direction;
  this.status = "new";
  this.height = 5;
  this.width = 5;
  if (direction === "right") {
    this.xInc = 1;
  } else {
    this.xInc = -1;
  }
  this.count = 0;
}

Bubble.prototype.draw = function() {
  context.fillRect(this.x, this.y, this.width, this.height);
  return this;
};

Bubble.prototype.move = function() {
  if (this.status === "new") {
    this.x+=this.xInc;
  } else if (this.status === "floating") {
    this.y--;
  }
  this.count++;

  if (this.x >= (canvas.width - 5) || this.x <= 0 || this.count === 50) {
    this.status = "floating";
  }

  if (this.y <= 0) {
    this.status = "done";
  }

  return this;
};

// THE GAME STUFF --------------------------------------------------------------

var dino = new Dinosaur();
var bubbles = [];

document.addEventListener('keydown', function(key) {
  if (key.keyCode === 65 ) {
    dino.left();
  } else if (key.keyCode === 68) {
    dino.right();
  } else if (key.keyCode === 87 || key.keyCode === 75) {
    if (!dino.status) { dino.status = "jumping"; }
  } else if (key.keyCode === 32 || key.keyCode === 74) {
    var bubble = new Bubble(dino.mouthX(), dino.mouthY(), dino.direction);
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
