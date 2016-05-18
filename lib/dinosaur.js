var Collision = require('./collision');

function Dinosaur(canvas, dino_img_left, dino_img_right) {
  this.height = 25;
  this.width = 25;
  this.x = canvas.width / 2;
  this.y = canvas.height - this.height-10;
  this.status = null;
  this.direction = "right";
  this.dino_img_left = dino_img_left;
  this.dino_img_right = dino_img_right;
  this.count = 0;
  this.canvas = canvas;
  this.points = 0;
  this.rebornTime = 0;
  this.lives = 3;
  this.jumpSteps = 15;
  this.jumpTotal = 80;
  this.jumpSize = this.jumpTotal/this.jumpSteps;
}

Dinosaur.prototype.reborn = function() {
  this.x = this.canvas.width / 2;
  this.y = this.canvas.height - this.height;
  this.status = null;
  this.direction = "right";
  this.count = 0;
  this.rebornTime = 500;
  this.lives--;
};

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

Dinosaur.prototype.move = function(floors) {
  if (this.rebornTime > 0) {
    this.rebornTime--;
  }
  if (this.status === "jumping") {
    this.jump(floors);
  }
  if (!this.onAFloor(floors)) {
    this.y += 1;//this.jumpSize;
  }
  return this;
};

Dinosaur.prototype.onAFloor = function(floors) {
  var dino = this;
  var floor_receiver;
  var floor;
  var dino_collider = {x: dino.x+dino.width/2, y: dino.y+dino.height};
  for(var i = 0; i< floors.length; i++) {
    floor = floors[i];
    floor_receiver = {minX: floor.x,
                      maxX: floor.x+floor.width,
                      minY: floor.y,
                      maxY: floor.y+floor.height};
    if(Collision.collision(dino_collider, floor_receiver)) {
      return true;
    }
  }
  return false;
};

Dinosaur.prototype.jump = function(floors) {
  if ( this.count < this.jumpSteps ){
    this.count++;
    this.y -= this.jumpSize;
  } else if (this.count >= this.jumpSteps && this.count < 2*this.jumpSteps) {
    this.count++;
    var dino = this;
    floors.forEach(function(floor){
      var dino_collider = {x: dino.x+dino.width/2, y: dino.y+dino.height};
      var floor_receiver = {minX: floor.x,
                             maxX: floor.x+floor.width,
                             minY: floor.y,
                             maxY: floor.y+floor.height};
      if(Collision.collision(dino_collider, floor_receiver)) {
        dino.y = floor.y-floor.height/2-dino.height-2;
        dino.status = null;
        dino.count = 0;
        return dino;
      }
    });
    this.y += this.jumpSize;
  } else if (this.count === 2*this.jumpSteps) {
    this.status = null;
    this.count = 0;
  }
  return this;
};



module.exports = Dinosaur;
