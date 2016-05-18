var jumpSteps = 15;
var jumpTotal = 80;
var jumpSize = jumpTotal/jumpSteps;

function Dinosaur(canvas, dino_img_left, dino_img_right) {
  this.height = 25;
  this.width = 25;
  this.x = canvas.width / 2;
  this.y = canvas.height - this.height;
  this.status = null;
  this.direction = "right";
  this.dino_img_left = dino_img_left;
  this.dino_img_right = dino_img_right;
  this.count = 0;
  this.canvas = canvas;
  this.rebornTime = 0;
  this.lives = 3;
}

Dinosaur.prototype.reborn = function() {
  this.x = this.canvas.width / 2;
  this.y = this.canvas.height - this.height;
  this.status = null;
  this.direction = "right";
  this.count = 0;
  this.rebornTime = 500;
  this.lives--;
}

Dinosaur.prototype.mouthX = function() {
  if (this.direction === "right"){
    return this.x + this.width;
  } else {
    return this.x;
  }
};

Dinosaur.prototype.mouthY = function() {
  return this.y + this.height/2;
};

Dinosaur.prototype.dino_img = function() {
  if (this.direction === "right") {
    return this.dino_img_right;
  } else {
    return this.dino_img_left;
  }
};

Dinosaur.prototype.draw = function(context) {
  context.drawImage(this.dino_img(), this.x, this.y, this.width, this.height);
  return this;
};

Dinosaur.prototype.left = function() {
  if (this.x > 4) {
    this.x -= 5;
  } else {
    this.x = 0;
  }
  this.direction = "left";
  return this;
};

Dinosaur.prototype.right = function() {
  if (this.x < this.canvas.width - this.width) {
    this.x += 5;
  } else {
    this.x = this.canvas.width - this.width;
  }
  this.direction = "right";
  return this;
};

Dinosaur.prototype.move = function() {
  if (this.rebornTime > 0) {
    this.rebornTime--;
  }
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



module.exports = Dinosaur;
