function Windup(canvas){
  this.x = canvas.width / 2;
  this.y = 0;
  this.height = 17;
  this.width = 17;
  this.canvas = canvas;
  this.count = 0;
  this.fallRate = 0.75;
  this.paceRate = 0.75;
}

Windup.prototype.draw = function(context){
  context.fillRect(this.x, this.y, this.width, this.height);
  return this;
};

Windup.prototype.fall = function() {
  if (this.y < this.canvas.height - this.height) {
    this.count++;
    this.y += this.fallRate;
  }
  return this;
};

Windup.prototype.pace = function() {
  if (this.x > this.canvas.width-this.width || this.x < 0) {
    this.paceRate = -1 * this.paceRate;
  }
  this.x += this.paceRate;
  return this;
};

Windup.prototype.move = function() {
  if (this.y < this.canvas.height - this.height) {
    this.fall();
  } else {
    this.pace();
  }
  return this;
};

module.exports = Windup;
