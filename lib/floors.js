function Floor(canvas, x, y, height, width) {
  this.x = x;
  this.y = y;
  this.height = height;
  this.width = width;
}

Floor.prototype.draw = function(context){
  context.fillStyle = "#ff1d8e";
  context.fillRect(this.x, this.y, this.width, this.height);
  context.fillStyle = "#000";
  return this;
};

module.exports = Floor;
