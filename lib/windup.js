var Jump = require('./jump');

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
  this.jump = new Jump();
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
    this.jump.jump(floors, this);
 } else if (this.x >= this.dino.x) {
    this.direction = "left";
    this.x -= this.paceRate;
  } else if (this.x < this.dino.x) {
    this.direction = "right";
    this.x += this.paceRate;
  }

  if (this.status !== "falling" && !this.jump.onAFloor(floors, this)) {
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

function createImage(imageSrc) {
  var image = document.createElement("img");
  image.src = imageSrc;
  image.style.visibility = 'hidden';
  return image;
}

module.exports = Windup;
