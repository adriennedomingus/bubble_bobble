var Collision = require('./collision');

function Windup(canvas, dino, twoPlayer){
  this.x = Math.random() * (canvas.width - 17);
  this.y = 0;
  this.height = 20;
  this.width = 20;
  this.canvas = canvas;
  this.count = 0;
  this.fallRate = 0.75;
  this.paceRate = 0.75;
  this.direction = "right";
  this.img_right = createImage('images/windup_right.png');
  this.img_left = createImage('images/windup_left.png');
  this.floorHeight = 10;
  this.jumpSteps = 20;
  this.jumpTotal = 120;
  this.jumpSize = this.jumpTotal/this.jumpSteps;
  this.status = "falling";
  this.dino = dino;
  if (twoPlayer) { this.twoPlayer = true; }
}

Windup.prototype.draw = function(context){
  context.drawImage(this.img(), this.x, this.y, this.width, this.height);
  return this;
};

Windup.prototype.img = function(){
  if (this.direction === "right") {
    return this.img_right;
  } else {
    return this.img_left;
  }
};


Windup.prototype.fall = function() {
  this.y += this.fallRate;
  return this;
};

Windup.prototype.move = function(floors) {

  if (this.status === "falling" && (this.y < this.canvas.height - this.height - this.floorHeight)) {
    this.fall();
  } else if (this.status === "jumping") {
    this.jump(floors);
  } else if (this.x >= this.dino.x) {
    this.direction = "left";
    this.x -= this.paceRate;
  } else if (this.x < this.dino.x) {
    this.direction = "right";
    this.x += this.paceRate;
  }

  if (this.status !== "falling" && !onAFloor(floors, this)) {
    this.y += 2;
  }

  if (this.status === "falling" && (this.y >= this.canvas.height - this.height - this.floorHeight)) {
    this.status = null;
  }

  if (this.status !== "falling" && this.status !== "jumping" && Math.random() < 0.02 && this.twoPlayer) {
    this.status = "jumping";
  }

  return this;
};

Windup.prototype.jump = function(floors) {
  if ( stillJumpingUp(this) ){
    dontHitCeiling(this);
  } else if (jumpingDown(this)) {
    findNearestFloor(floors, this);
  } else if (finishedJumpingAndFalling(this)) {
    resetWindup(this);
  }
  return this;
};


function createImage(imageSrc) {
  var image = document.createElement("img");
  image.src = imageSrc;
  image.style.visibility = 'hidden';
  return image;
}

function stillJumpingUp(windup) {
  return windup.count < windup.jumpSteps;
}

function dontHitCeiling(windup) {
  windup.count++;
  if (windup.y - windup.jumpSize > 0){
    windup.y -= windup.jumpSize;
  } else {
    windup.y = 0;
    windup.count = windup.jumpSteps;
  }
}

function jumpingDown(windup) {
  return windup.count >= windup.jumpSteps && windup.count < 2 * windup.jumpSteps;
}

function findNearestFloor(floors, windup){
  windup.count++;
  floors.forEach(function(floor){
    if (onThisFloor(floor, windup)) {
      windup.y = floor.y-windup.height;
      resetWindup(windup);
    }
  });
  windup.y += windup.jumpSize;
  return windup;
}

function onThisFloor(floor, windup) {
  var windup_collider = { x: windup.x + windup.width / 2, y: windup.y + windup.height };
  var floor_receiver = { minX: floor.x,
                         maxX: floor.x+floor.width,
                         minY: floor.y,
                         maxY: floor.y+floor.height };
  if(Collision.collision(windup_collider, floor_receiver)) {
    return true;
  }
}

function finishedJumpingAndFalling(windup) {
  return windup.count === 2 * windup.jumpSteps;
}

function resetWindup(windup) {
  windup.status = null;
  windup.count = 0;
}


function onAFloor(floors, windup) {
  var floor;
  for(var i = 0; i< floors.length; i++) {
    floor = floors[i];
    if (onThisFloor(floor, windup)) {
      return true;
    }
  }
  return false;
}
module.exports = Windup;
