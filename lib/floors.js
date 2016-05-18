function Floor(canvas, x, y, width) {
  this.x = x;
  this.y = y;
  this.height = 10;
  this.width = width;
}

Floor.prototype.draw = function(context){
  context.fillStyle = "#28B463";
  context.fillRect(this.x, this.y, this.width, this.height);
  context.fillStyle = "#000";
  return this;
};

module.exports = Floor;
