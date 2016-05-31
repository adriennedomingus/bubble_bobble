var Collision = require('./collision');

function Jump() {}

Jump.prototype.jump = function(floors, element) {
  if ( stillJumpingUp(element) ){
    dontHitCeiling(element);
  } else if (jumpingDown(element)) {
    findNearestFloor(floors, element);
  } else if (finishedJumpingAndFalling(element)) {
    resetElement(element);
  }
  return this;
};

Jump.prototype.onThisFloor = function(floor, element) {
  var element_collider = { x: element.x + element.width / 2, y: element.y + element.height };
  var floor_receiver = { minX: floor.x,
                         maxX: floor.x+floor.width,
                         minY: floor.y,
                         maxY: floor.y+floor.height };
  if(Collision.collision(element_collider, floor_receiver)) {
    return true;
  }
};

Jump.prototype.onAFloor = function(floors, windup) {
  var floor;
  for(var i = 0; i< floors.length; i++) {
    floor = floors[i];
    if (new Jump().onThisFloor(floor, windup)) {
      return true;
    }
  }
  return false;
};

function stillJumpingUp(element) {
  return element.count < element.jumpSteps;
}

function dontHitCeiling(element) {
  element.count++;
  if (element.y - element.jumpSize > 0){
    element.y -= element.jumpSize;
  } else {
    element.y = 0;
    element.count = element.jumpSteps;
  }
}

function jumpingDown(element) {
  return element.count >= element.jumpSteps && element.count < 2 * element.jumpSteps;
}

function findNearestFloor(floors, element){
  element.count++;
  floors.forEach(function(floor){
    if (new Jump().onThisFloor(floor, element)) {
      element.y = floor.y-floor.height/2-element.height-2;
      resetElement(element);
    }
  });
  element.y += element.jumpSize;
  return element;
}

function finishedJumpingAndFalling(element) {
  return element.count === 2 * element.jumpSteps;
}

function resetElement(element) {
  element.status = null;
  element.count = 0;
}

module.exports = Jump;
