var Collision = require('./collision');
var Fruit = require('./fruits');
var Windup = require('../lib/windup');
var Bubble = require('../lib/bubbles');

export function gameOver(dino, bubbles, windups, fruits) {
  if (dino.lives === 0 || (dino.level === 3 && allFilledBubblesPopped(bubbles) && windups.length === 0 && allFruitsCollected(fruits))) { return true; }
  return false;
}

export function gameOver2P(dino, dino2, bubbles, windups, fruits) {
  if (dino.lives === 0 || dino2.lives === 0 || (dino.level === 3 && allFilledBubblesPopped(bubbles) && windups.length === 0 && allFruitsCollected(fruits))) { return true; }
  return false;
}

export function respondToPresses(game) {
  if (game.keyPressed[65]) {
    game.dino.left(game);
  }
  if (game.keyPressed[68]) { game.dino.right(game); }
  if (game.keyPressed[87] || game.keyPressed[75]) {
    game.dino.setJumpingStatus();
  }
  if (game.keyPressed[32] || game.keyPressed[74]) {
    var bubble = new Bubble(game.dino.mouthX(), game.dino.mouthY(), game.dino.direction, game.canvas);
    game.bubbles.push(bubble);
    game.keyPressed[32] = false;
    game.keyPressed[74] = false;
  }
}

export function respondToPresses2P(game) {
  if (game.keyPressed[65]) {
    game.dino.left(game);
  }
  if (game.keyPressed[68]) { game.dino.right(game); }
  if (game.keyPressed[87]) {
    game.dino.setJumpingStatus();
  }
  if (game.keyPressed[32]) {
    var bubble = new Bubble(game.dino.mouthX(), game.dino.mouthY(), game.dino.direction, game.canvas);
    game.bubbles.push(bubble);
    game.keyPressed[32] = false;
  }
  if(game.keyPressed[74]) {
    game.dino2.left(game);
  }
  if (game.keyPressed[76]) {
    game.dino2.right(game);
  }
  if (game.keyPressed[13]) {
    var bubble2 = new Bubble(game.dino2.mouthX(), game.dino2.mouthY(), game.dino2.direction, game.canvas);
    game.bubbles.push(bubble2);
    game.keyPressed[13] = false;
  }
  if (game.keyPressed[222]) {
    game.dino2.setJumpingStatus();
  }
}

export function checkDinoWindupCollisions(dino, windups){
  windups.forEach(function(windup) {
    var windup_collider = Collision.generateCollider(windup);
    var dino_receiver = Collision.generateReceiver(dino);
    if (Collision.collision(windup_collider, dino_receiver)) {
      dino.reborn();
      console.log("dino has "+dino.lives+" lives remaining");
      return;
    }
  });
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

export function checkWindupBubbleCollisions(windups, bubbles){
  bubbles.forEach(function(bubble){
    windups.forEach(function(windup, index, windups) {
      var bubble_collider = Collision.generateCollider(bubble);
      var windup_receiver = Collision.generateReceiver(windup);
      if (Collision.collision(bubble_collider, windup_receiver) && bubble.status === "new"){
        bubble.fillUp();
        windups.splice(index, 1);
      }
    });
  });
}

export function drawWindups(windups, context, dino) {
  windups.forEach(function(windup) {
    windup.move(dino).draw(context);
  });
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

export function drawScore(dino, context) {
  context.font="16px monospace";
  context.fillText("Score: "+dino.points,10,20);
  context.fillText("Lives: "+dino.lives, 10,40);
}

export function drawScore2(dino2, context) {
  context.font="16px monospace";
  context.fillText("Score: "+dino2.points, 275,20);
  context.fillText("Lives: "+dino2.lives, 275,40);
}

export function levelUp(dino, fruits, windups, canvas, bubbles) {
  if ( levelOver(windups, fruits, dino, bubbles)) {
    if (dino.level === 1 || dino.level === 2) {
      var newWindups = [new Windup(canvas), new Windup(canvas)];
      setTimeout(function() {
        dino.level++;
      }, 2000);
      return newWindups;
    }
  }
}

export function nextLevel(game) {
  var elem = document.getElementById('game');
  elem.style.transition = "opacity 1s linear 0s";
  elem.style.opacity = 0;
  setTimeout(function() {
    elem.style.opacity = 1;
    if (game) {
      game.bubbles = [];
      game.windups.forEach(function(windup){
        windup.y = 0;
      });
      game.dino.x = game.canvas.width / 2;
      game.dino.y = game.canvas.height - game.dino.height-10;
    }
  }, 2000);
}

export function nextLevel2P(game) {
  var elem = document.getElementById('game');
  elem.style.transition = "opacity 1s linear 0s";
  elem.style.opacity = 0;
  setTimeout(function() {
    elem.style.opacity = 1;
    if (game) {
      game.bubbles = [];
      game.windups.forEach(function(windup){
        windup.y = 0;
      });
      game.dino.x = 0;
      game.dino.direction = "right";
      game.dino2.x = game.canvas.width - game.dino2.width;
      game.dino.y = game.canvas.height - game.dino.height-10;
      game.dino2.y = game.canvas.height - game.dino.height-10;
      game.dino2.direction = "left";
    }
  }, 2000);
}

export function endGameSequence(dino){
  nextLevel(null);
  if (dino.lives === 0) {
    setTimeout(function() {
      document.getElementById('end-game-lose').className = "";
    }, 2000);
  } else {
    setTimeout(function() {
      document.getElementById('end-game-win').className = "";
    }, 2000);
  }
}

export function endGameSequence2P(bob, bub){
  nextLevel(null);
  if (bob.lives === 0) {
    setTimeout(function() {
      document.getElementById('end-game-lose-bub').className = "";
    }, 2000);
  } else if (bub.lives === 0) {
    setTimeout(function() {
      document.getElementById('end-game-lose-bob').className = "";
    }, 2000);
  } else if (bob.score > bub.score){
    setTimeout(function() {
      document.getElementById('end-game-win-bob').className = "";
    }, 2000);
  } else {
    setTimeout(function() {
      document.getElementById('end-game-win-bub').className = "";
    }, 2000);
  }
}

export function decrementFruitValues(fruits) {
  fruits.forEach(function(fruit){
    fruit.points -= 1;
  });
}

function allFruitsCollected(fruits) {
  return fruits.every(function(element) {
    return element.status === "collected";
  });
}

function levelOver(windups, fruits, dino, bubbles) {
  return windups.length === 0 && allFruitsCollected(fruits) && allFilledBubblesPopped(bubbles);
}

function allFilledBubblesPopped(bubbles){
  for (var i = 0; i < bubbles.length; i++) {
    if (bubbles[i].filled && !(bubbles[i].status === "popped")) {
      return false;
    }
  }
  return true;
}
