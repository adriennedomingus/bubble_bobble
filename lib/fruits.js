function Fruit(canvas, startingX, startingY, points) {
  this.startingY = startingY;
  this.x = startingX;
  this.y = startingY;
  this.height = 20;
  this.width = 20;
  this.canvas = canvas;
  this.count = 0;
  this.points = points;
  this.fallRate = 0.75;
  this.status = "new";
  this.image = createFruitImage();
}

Fruit.prototype.draw = function(context) {
  context.drawImage(this.image, this.x, this.y, this.width, this.height);
  return this;
};

Fruit.prototype.fall = function() {
  if (this.y < this.canvas.height - this.height - 10) {
    this.count++;
    this.y += this.fallRate;
  }
  return this;
};

Fruit.prototype.collectible = function() {
  return (this.y > this.startingY + 10) && (this.status !== "collected");
};

function createImage(imageSrc) {
  var image = document.createElement("img");
  image.src = imageSrc;
  image.style.visibility = 'hidden';
  return image;
}

function createFruitImage(){
  var randFruit = 'images/fruit'+Math.round(Math.random()*5)+'.png';
  return createImage(randFruit);
}
module.exports = Fruit;
