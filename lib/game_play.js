var Collision = require('./collision');
var Fruit = require('./fruits');
var Windup = require('../lib/windup');

export function gameOver(dino) {
  if (dino.lives === 0) { return true; }
  return false;
}

export function checkDinoWindupCollisions(dino, windup){
  if (windup) {
    var windup_collider = Collision.generateCollider(windup);
    var dino_receiver = Collision.generateReceiver(dino);
    if (Collision.collision(windup_collider, dino_receiver)) {
      dino.reborn();
      console.log("dino has "+dino.lives+" lives remaining");
    }
  }
}

export function checkDinoFruitCollisions(dino, fruits){
  fruits.forEach(function(fruit){
    var fruit_collider = Collision.generateCollider(fruit);
    var dino_receiver = Collision.generateReceiver(dino);
    if (Collision.collision(fruit_collider, dino_receiver) && fruit.collectible()) {
      fruit.status = "collected";
      dino.points += fruit.points;
      console.log("Dino has " + dino.points + " points");
    }
  });
}

export function checkDinoBubbleCollisions(dino, bubbles, fruits, canvas){
  bubbles.forEach(function(bubble){
    var bubble_collider = Collision.generateCollider(bubble);
    var dino_receiver = Collision.generateReceiver(dino);
    if (Collision.collision(bubble_collider, dino_receiver)){
      if (bubble.filled && bubble.status !== "popped") {
        var fruit = new Fruit(canvas, bubble.x, bubble.y, 1000);
        fruits.push(fruit);
      }
      bubble.status = "popped";
    }
  });
  return bubbles;
}

export function checkWindupBubbleCollisions(windup, bubbles){

  bubbles.forEach(function(bubble){
    if (windup) {
      var bubble_collider = Collision.generateCollider(bubble);
      var windup_receiver = Collision.generateReceiver(windup);
      if (Collision.collision(bubble_collider, windup_receiver) && bubble.status === "new"){
        bubble.fillUp();
        windup = null;
      }
    }
  });
  return windup;
}

export function drawWindup(windup, context) {
  if (windup) { windup.move().draw(context); }
}

export function drawBubbles(bubbles, context) {
  bubbles.forEach(function(bubble) {
    if (bubble.status !== "popped") {
      bubble.move().draw(context);
    }
  });
}

export function drawFruits(fruits, context){
  fruits.forEach(function(fruit){
    if (fruit.status !== "collected") {
      fruit.fall().draw(context);
    }
  });
}

export function drawFloors(floors, context){
  floors.forEach(function(floor){
    floor.draw(context);
  });
}

export function levelUp(dino, fruits, windup, canvas) {
  if (!windup && allFruitsCollected(fruits) && fruits.length > -1 + dino.level ) {
    if (dino.level === 1) {
      var newWindup = new Windup(canvas);
      setTimeout(function() {
        dino.level = 2;
      }, 2000);
      return newWindup;
    } else if (dino.level === 2) {
      var levelThreeWindup = new Windup(canvas);
      setTimeout(function() {
        dino.level = 3;
      }, 2000);
      return levelThreeWindup;
    }
  }
}

export function nextLevel() {
  var elem = document.getElementById('game');
  elem.style.transition = "opacity 1s linear 0s";
  elem.style.opacity = 0;
  setTimeout(function() {
    elem.style.opacity = 1;
  }, 2000);
}

function allFruitsCollected(fruits) {
  return fruits.every(function(element) {
    return element.status === "collected";
  });
}
