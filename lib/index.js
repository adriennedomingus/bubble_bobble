var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

function Dinosaur() {
  this.x = canvas.width / 2;
  this.y = canvas.height - 10;
  this.height = 10;
  this.width = 10;
}

Dinosaur.prototype.draw = function() {
  context.fillRect(this.x, this.y, this.width, this.height);
  return this;
};

Dinosaur.prototype.left = function() {
  if (this.x > 0) {
    this.x--;
  }
  return this;
};

Dinosaur.prototype.right = function() {
  if (this.x < canvas.width - 10) {
    this.x++;
  }
  return this;
};

Dinosaur.prototype.jump = function() {
  var dino = this;
  var count = 0;
  var increment = function(that){
    if ( count < 5 ){
      count++;
      that.y -= 6;
      setTimeout(increment, 50, that);
    } else if (count >= 5 && count < 10) {
      count++;
      that.y += 6;
      setTimeout(increment, 50, that);
    }
  };
  increment(dino);
  return this;
};
//
// var x = function() {
//    var counter = 1;
//
//    (function foo() {
//        alert('Run No. ' + counter);
//
//        if (counter < 5) {
//            counter++;
//            setTimeout(foo, 400);
//        }
//    })();
// };
// x();

var dino = new Dinosaur();

document.addEventListener('keydown', function(key) {
  if (key.keyCode === 65 ) {
    dino.left();
  } else if (key.keyCode === 68) {
    dino.right();
  } else if (key.keyCode === 87) {
    dino.jump();
  }
});

requestAnimationFrame(function gameLoop(){
  context.clearRect(0, 0, canvas.width, canvas.height);
  dino.draw();
  requestAnimationFrame(gameLoop);
});
