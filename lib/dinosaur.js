var Collision = require('./collision');
var Jump = require('./jump');

function Dinosaur(canvas, bubOrBob) {
  this.height = 25;
  this.width = 25;
  this.x = canvas.width / 2;
  this.y = canvas.height - this.height-10;
  this.status = null;
  this.direction = "right";
  if (bubOrBob === "bob") {
    this.dino_img_left = createImage("images/bob_left.png");
    this.dino_img_left_1 = createImage("images/bob_left_1.png");
    this.dino_img_left_2 = createImage("images/bob_left_2.png");
    this.dino_img_right = createImage("images/bob_right.png");
    this.dino_img_right_1 = createImage("images/bob_right_1.png");
    this.dino_img_right_2 = createImage("images/bob_right_2.png");
  } else {
    this.dino_img_left = createImage("images/bub_left.png");
    this.dino_img_left_1 = createImage("images/bub_left_1.png");
    this.dino_img_left_2 = createImage("images/bub_left_2.png");
    this.dino_img_right = createImage("images/bub_right.png");
    this.dino_img_right_1 = createImage("images/bub_right_1.png");
    this.dino_img_right_2 = createImage("images/bub_right_2.png");
  }
  this.count = 0;
  this.canvas = canvas;
  this.points = 0;
  this.rebornTime = 0;
  this.lives = 3;
  this.jumpSteps = 20;
  this.jumpTotal = 150;
  this.jumpSize = this.jumpTotal/this.jumpSteps;
  this.level = 1;
  this.floorHeight = 10;
  this.jump = new Jump();
}

Dinosaur.prototype.reborn = function() {
  if (this.rebornTime === 0) {
    this.x = this.canvas.width / 2;
    this.y = this.canvas.height - this.height - this.floorHeight;
    this.direction = "right";
    this.rebornTime = 150;
    this.lives--;
    resetDino(this);
  }
};

// These perhaps should be getters instead of functions
Dinosaur.prototype.mouthX = function() {
  if (this.direction === "right"){
    return this.x + this.width;
  }
  return this.x-30;
};

Dinosaur.prototype.mouthY = function() {
  return this.y;
};

Dinosaur.prototype.dino_img = function() {
  if (this.direction === "right" && this.rebornTime >= 75) {
    return this.dino_img_right_1;
  } else if (this.direction === "right" && (this.rebornTime > 0 && this.rebornTime < 75)) {
    return this.dino_img_right_2;
  } else if (this.direction === "right") {
    return this.dino_img_right;
  } else if (this.direction === "left" && this.rebornTime >= 75) {
    return this.dino_img_left_1;
  } else if (this.direction === "left" && (this.rebornTime > 0 && this.rebornTime < 75)) {
    return this.dino_img_left_2;
  } else if (this.direction === "left") {
    return this.dino_img_left;
  }
};

Dinosaur.prototype.draw = function(context) {
  context.drawImage(this.dino_img(), this.x, this.y, this.width, this.height);
  return this;
};

Dinosaur.prototype.left = function(game) {
  var verticalFloors = findVerticalFloors(game.floors());
  if (runIntoVerticalFloor(this, verticalFloors, "left") && notOnTopWall(this)) {
    this.x = this.x;
  } else if (this.x > 4) {
    this.x -= 2;
  } else {
    this.x = 0;
  }
  this.direction = "left";
  return this;
};

Dinosaur.prototype.right = function(game) {
  var verticalFloors = findVerticalFloors(game.floors());
  if (runIntoVerticalFloor(this, verticalFloors, "right") && notOnTopWall(this)) {
    this.x = this.x;
  } else if (this.x < this.canvas.width - this.width) {
    this.x += 2;
  } else {
    this.x = this.canvas.width - this.width;
  }
  this.direction = "right";
  return this;
};

Dinosaur.prototype.move = function(floors) {
  if (this.rebornTime > 0) {
    this.rebornTime--;
  }
  if (this.status === "jumping") {
    this.jump.jump(floors, this);
  }
  if (!this.jump.onAFloor(floors, this)) {
    this.y += 2;
  }
  return this;
};

Dinosaur.prototype.setJumpingStatus = function() {
  if (!this.status) { this.status = "jumping"; }
};

function resetDino(dino) {
  dino.status = null;
  dino.count = 0;
}

function createImage(imageSrc) {
  var image = document.createElement("img");
  image.src = imageSrc;
  image.style.visibility = 'hidden';
  return image;
}

function findVerticalFloors(floors){
  var verticalFloors = [];
  floors.forEach(function(floor){
    if (floor.height > 10) {
      verticalFloors.push(floor);
    }
  });
  return verticalFloors;
}

function runIntoVerticalFloor(dino, verticalFloors, direction){
  for (var i = 0; i < verticalFloors.length; i++) {
    var dino_collider = Collision.generateReceiver(dino);
    var floor_receiver = Collision.generateReceiver(verticalFloors[i]);
    if (Collision.collisionVertical(dino_collider, floor_receiver, direction)) {
      return true;
    }
  }
  return false;
}

function notOnTopWall(dino){
  return !(dino.y > 30 && dino.y < 34);
}

module.exports = Dinosaur;
