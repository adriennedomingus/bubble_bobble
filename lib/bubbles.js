function Bubble(x, y, direction, canvas){
  this.y = y;
  this.direction = direction;
  this.status = "new";
  this.height = 5;
  this.width = 5;
  this.count = 0;
  this.canvas = canvas;
  this.setXAndXInc(x);
}

Bubble.prototype.draw = function(context) {
  context.fillRect(this.x, this.y, this.width, this.height);
  return this;
};

Bubble.prototype.setXAndXInc = function(x) {
  if (this.direction === "right") {
    this.x = x + 3;
    this.xInc = 1;
  } else {
    this.x = x - 3;
    this.xInc = -1;
  }
};

Bubble.prototype.move = function() {
  var bubble = this;
  float(bubble);
  bubble.count++;
  if (doneFloatingSidewaysOrHitAWall(bubble)) {
    bubble.status = "floating";
  }
  if (onRightEdge(bubble)) {
    bubble.x = bubble.canvas.width - bubble.width;
  }
  if (onLeftEdge(bubble)) {
    bubble.x = 0;
  }
  if (onCeiling(bubble)) {
    bubble.status = "done";
  }
  return bubble;
};

Bubble.prototype.fillUp = function() {
  this.status = "floating";
  this.filled = true;
  this.height = 15;
  this.width = 15;
};

function doneFloatingSidewaysOrHitAWall(bubble) {
  return onRightEdge(bubble) || onLeftEdge(bubble) || bubble.count === 100;
}

function onCeiling(bubble) {
  return bubble.y <= 0;
}

function onRightEdge(bubble) {
  return bubble.x >= bubble.canvas.width - bubble.width;
}

function onLeftEdge(bubble) {
   return bubble.x <= 0;
}

function float(bubble) {
  if (bubble.status === "new") {
    bubble.x += bubble.xInc;
  } else if (bubble.status === "floating") {
    bubble.y--;
  }
  return bubble;
}

module.exports = Bubble;
