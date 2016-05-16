var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

function Dinosaur() {
  this.x = canvas.width / 2;
  this.y = canvas.height - 15;
  this.height = 15;
  this.width = 10;
  this.status = null;
  this.direction = "right";
}

function Bubble(x, y, direction){
  this.x = x;
  this.y = y;
  this.direction = direction;
  this.height = 5;
  this.width = 5;
}

Bubble.prototype.draw = function() {
  context.fillRect(this.x, this.y, this.width, this.height);
  return this;
};

var bubbles = [];

Dinosaur.prototype.draw = function() {
  context.fillRect(this.x, this.y, this.width, this.height);
  return this;
};

Dinosaur.prototype.left = function() {
  if (this.x > 0) {
    this.x -= 5;
  }
  return this;
};

Dinosaur.prototype.right = function() {
  if (this.x < canvas.width - 10) {
    this.x += 5;
  }
  return this;
};

Dinosaur.prototype.jump = function() {
  var dino = this;
  var count = 0;
  var increment = function(that){
    that.status = "jumping";
    if ( count < 5 ){
      count++;
      that.y -= 6;
      setTimeout(increment, 50, that);
    } else if (count >= 5 && count < 10) {
      count++;
      that.y += 6;
      setTimeout(increment, 50, that);
    } else if (count === 10) {
      that.status = null
    }
  };
  increment(dino);
  return this;
};

var dino = new Dinosaur();

document.addEventListener('keydown', function(key) {
  if (key.keyCode === 65 ) {
    dino.left();
  } else if (key.keyCode === 68) {
    dino.right();
  } else if (key.keyCode === 87) {
    if (!dino.status) {
      dino.jump();
    }
  } else if (key.keyCode === 32) {
    var bubble = new Bubble(dino.x, dino.y, dino.direction);
    bubbles.push(bubble);
  }
  //create bubble, draw it
  // it animates in the direction dino is facing
  // if it hits a windup
  // do stuff
  //otherwise, float up, disappear at the top
});

requestAnimationFrame(function gameLoop(){
  context.clearRect(0, 0, canvas.width, canvas.height);
  dino.draw();
  bubbles.forEach(function(bubble){
    bubble.draw();
  });
  requestAnimationFrame(gameLoop);
});
