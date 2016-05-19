function Bubble(x, y, direction, canvas){
  this.y = y;
  this.direction = direction;
  this.status = "new";
  this.height = 5;
  this.width = 5;
  if (direction === "right") {
    this.x = x+3;
    this.xInc = 1;
  } else {
    this.x = x-3;
    this.xInc = -1;
  }
  this.count = 0;
  this.canvas = canvas;
}

Bubble.prototype.draw = function(context) {
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
  if (this.x >= (this.canvas.width - 5 ) || this.x <= 0 || this.count === 50) {
    this.status = "floating";
  }
  if (this.x >= this.canvas.width - this.width) {
    this.x = this.canvas.width - this.width;
  }
  if (this.y <= 0) {
    this.status = "done";
  }

  return this;
};

Bubble.prototype.fillUp = function() {
  this.status = "floating";
  this.filled = true;
  this.height = 15;
  this.width = 15;
}

module.exports = Bubble;
