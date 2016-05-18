var Bubble = require('../lib/bubbles');
var Dinosaur = require('../lib/dinosaur');
var Collision = require('../lib/collision');
var Windup = require('../lib/windup');
var Fruit = require('../lib/fruits');
var Floor = require('../lib/floors');

var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

var dino_img_right = document.getElementById("dino_right");
var dino_img_left = document.getElementById("dino_left");
dino_img_right.style.visibility = 'hidden';
dino_img_left.style.visibility = 'hidden';

var dino = new Dinosaur(canvas, dino_img_left, dino_img_right);
var windup = new Windup(canvas);
var bubbles = [];
var fruits = [];
var floors = [new Floor(canvas, 50, 50, 75)];

document.addEventListener('keydown', function(key) {
  if (key.keyCode === 65 ) {
    dino.left();
  } else if (key.keyCode === 68) {
    dino.right();
  } else if (key.keyCode === 87 || key.keyCode === 75) {
    if (!dino.status) { dino.status = "jumping"; }
  } else if (key.keyCode === 32 || key.keyCode === 74) {
    key.preventDefault();
    var bubble = new Bubble(dino.mouthX(), dino.mouthY(), dino.direction, canvas);
    bubbles.push(bubble);
  }
});

var startScreen = document.getElementById("start-screen");
startScreen.addEventListener('click', function(){
  startScreen.className += "hidden";

  requestAnimationFrame(function gameLoop(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    floors.forEach(function(floor){
      floor.draw(context);
    });
    dino.move(floors).draw(context);

    bubbles.forEach(function(bubble){
      if (bubble.status !== "popped") {
        bubble.move().draw(context);
      }

      if (windup && Collision.collision(bubble, windup) && bubble.status === "new") {
        bubble.status = "floating";
        bubble.filled = true;
        bubble.height = 15;
        bubble.width = 15;
        windup = null;
      }

      if (Collision.collision(bubble, dino)) {
        if (bubble.filled && bubble.status !== "popped") {
          var fruit = new Fruit(canvas, bubble.x, bubble.y, 1000);
          fruits.push(fruit);
        }
        bubble.status = "popped";
      }

      fruits.forEach(function(fruit){
        if (fruit.status !== "collected") {
          fruit.fall().draw(context);
          if (Collision.collision(fruit, dino) && fruit.y > fruit.startingY + 10) {
            fruit.status = "collected";
            dino.points += fruit.points;
            console.log("Dino has " + dino.points + " points");
          }
        }
      });
    });

    if (windup) {
      windup.move().draw(context);
    }

    if (windup && Collision.collision(windup, dino)) {
      if (dino.rebornTime === 0) {
        dino.reborn();
        console.log("dino has "+dino.lives+" lives remaining");
      }
    }

    if (dino.lives === 0) {
      console.log("Game is over, please play again");
    }
    requestAnimationFrame(gameLoop);
  });
});
