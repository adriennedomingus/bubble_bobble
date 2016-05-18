function Bubble(x, y, direction, canvas){
  this.y = y;
  this.direction = direction;
  this.status = "new";
  this.height = 5;
  this.width = 5;
  if (direction === "right") {
    this.x = x + 3;
    this.xInc = 1;
  } else {
    this.x = x - 3;
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
  var bubble = this;
  float(bubble);
  bubble.count++;
  if (doneFloatingSidewaysOrHitAWall(bubble)) {
    bubble.status = "floating";
  }
  if (onRightEdge(bubble)) {
    bubble.x = bubble.canvas.width - bubble.width;
  }
  if (onCeiling(bubble)) {
    bubble.status = "done";
  }
  return bubble;
};

function doneFloatingSidewaysOrHitAWall(bubble) {
  return bubble.x >= (bubble.canvas.width - bubble.width ) || bubble.x <= 0 || bubble.count === 50;
}

function onCeiling(bubble) {
  return bubble.y <= 0;
}

function onRightEdge(bubble) {
  return bubble.x >= bubble.canvas.width - bubble.width;
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
