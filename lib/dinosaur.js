var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

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

module.exports.dinosaur = Dinosaur;
