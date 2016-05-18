function Fruit(canvas, startingX, startingY, points) {
  this.startingY = startingY;
  this.x = startingX;
  this.y = startingY;
  this.height = 10;
  this.width = 20;
  this.canvas = canvas;
  this.count = 0;
  this.points = points;
  this.fallRate = 0.75;
  this.status = "new";
}

Fruit.prototype.draw = function(context) {
  context.fillRect(this.x, this.y, this.width, this.height);
  return this;
};

Fruit.prototype.fall = function() {
  if (this.y < this.canvas.height - this.height) {
    this.count++;
    this.y += this.fallRate;
  }
  return this;
};

module.exports = Fruit;
