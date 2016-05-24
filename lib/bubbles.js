function Bubble(x, y, direction, canvas){
  this.x = x;
  this.y = y;
  this.direction = direction;
  this.status = "new";
  this.height = 30;
  this.width = 30;
  this.count = 0;
  this.canvas = canvas;
  this.image = setBubbleImage('images/bubble_new.png');
  this.drift = 0.25;
  setXAndXInc(this);
}

Bubble.prototype.draw = function(context) {
  context.drawImage(this.image, this.x, this.y, this.width, this.height);
  return this;
};

Bubble.prototype.move = function() {
  var bubble = this;
  float(bubble);
  bubble.count++;
  if (doneFloatingSidewaysOrHitAWall(bubble)) {
    bubble.status = "floating";
    if (!bubble.filled) {
      bubble.image = setBubbleImage('images/bubble_floating.png');
    }
  }
  if (onRightEdge(bubble)) {
    bubble.x = bubble.canvas.width - bubble.width;
  }
  if (onLeftEdge(bubble)) {
    bubble.x = 0;
  }
  if (onCeiling(bubble)) {
    driftX(bubble);
    this.status = "done";
  }
  return bubble;
};

Bubble.prototype.fillUp = function() {
  this.status = "floating";
  this.image = setBubbleImage('images/bubble_filled.png');
  this.filled = true;
};

function driftX(bubble) {
  if (Math.random() < 0.10) { bubble.drift *= -1; }
  if ((bubble.drift < 0 && bubble.x > -1*bubble.drift) ||
      (bubble.drift > 0 && bubble.x < bubble.canvas.width-bubble.width-bubble.drift)) {
    bubble.x += bubble.drift;
  }
}

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


function setXAndXInc(bubble) {
  if (bubble.direction === "right") {
    bubble.x += 3;
    bubble.xInc = 1;
  } else {
    bubble.x -= 3;
    bubble.xInc = -1;
  }
}

function setBubbleImage(imageSrc) {
  var image = document.createElement("img");
  image.src = imageSrc;
  image.style.visibility = 'hidden';
  return image;
}
module.exports = Bubble;
