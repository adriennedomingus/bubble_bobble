var Collision = require('./collision');

function Windup(canvas){
  this.x = Math.random() * (canvas.width - 17);
  this.y = 0;
  this.height = 20;
  this.width = 20;
  this.canvas = canvas;
  this.count = 0;
  this.fallRate = 0.75;
  this.paceRate = 0.75;
  this.direction = "right";
  this.img_right = createImage('lib/windup_right.png');
  this.img_left = createImage('lib/windup_left.png');
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
  if (this.y < this.canvas.height - this.height - 10) {
    this.count++;
    this.y += this.fallRate;
  }
  return this;
};

Windup.prototype.move = function(dino, otherWindup) {
  if (this.y < this.canvas.height - this.height - 10) {
    this.fall();
  } else if (otherWindup) {
    var windupReceiver = Collision.generateReceiver(this);
    var otherWindupReceiver = Collision.generateReceiver(otherWindup);
    if (this.x >= dino.x){
      this.direction = "left";
      if (Collision.collisionVertical(windupReceiver, otherWindupReceiver, "left")) {
        this.x = this.x;
      } else {
        this.x -= this.paceRate;
      }
    } else if (this.x < dino.x) {
      this.direction = "right";
      if (Collision.collisionVertical(windupReceiver, otherWindupReceiver, "right")) {
        this.x = this.x;
      } else {
        this.x += this.paceRate;
      }
    }
  } else {
    if (this.x >= dino.x){
      this.direction = "left";
      this.x -= this.paceRate;
    } else if (this.x < dino.x) {
      this.direction = "right";
      this.x += this.paceRate;
    }
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
