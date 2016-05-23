/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Game = __webpack_require__(1);

	var canvas = document.getElementById('game');

	var game = new Game(canvas);
	game.play();

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Bubble = __webpack_require__(2);
	var Dinosaur = __webpack_require__(3);
	var Windup = __webpack_require__(5);
	var GamePlay = __webpack_require__(6);
	var Levels = __webpack_require__(8);

	function Game(canvas) {
	  this.canvas = canvas;
	  this.context = canvas.getContext('2d');
	  this.dino = new Dinosaur(this.canvas);
	  this.windups = [new Windup(canvas), new Windup(canvas)];
	  this.bubbles = [];
	  this.fruits = [];
	  this.keyPressed = {};
	}

	Game.prototype.play = function () {
	  setKeyBindings(this);
	  setStartScreen(gameLoop, this);
	  setEndScreen(gameLoop, this);
	};

	Game.prototype.floors = function () {
	  return new Levels().whichLevel(this.canvas, this.dino.level);
	};

	function gameLoop() {
	  var game = this;
	  game.context.clearRect(0, 0, game.canvas.width, game.canvas.height);
	  GamePlay.drawFloors(game.floors(), game.context);
	  GamePlay.respondToPresses(game);
	  game.dino.move(game.floors()).draw(game.context);
	  GamePlay.drawBubbles(game.bubbles, game.context);
	  GamePlay.checkWindupBubbleCollisions(game.windups, game.bubbles);
	  GamePlay.checkDinoBubbleCollisions(game.dino, game.bubbles, game.fruits, game.canvas);
	  GamePlay.drawFruits(game.fruits, game.context);
	  GamePlay.checkDinoFruitCollisions(game.dino, game.fruits);
	  GamePlay.drawWindups(game.windups, game.context, game.dino);
	  GamePlay.checkDinoWindupCollisions(game.dino, game.windups);
	  GamePlay.drawScore(game.dino, game.context);
	  if (GamePlay.gameOver(game.dino, game.bubbles, game.windups, game.fruits)) {
	    GamePlay.endGameSequence();
	    return true;
	  }
	  var newWindups = GamePlay.levelUp(game.dino, game.fruits, game.windups, game.canvas, game.bubbles);
	  if (newWindups) {
	    game.windups = newWindups;
	    GamePlay.nextLevel(game);
	  }
	  requestAnimationFrame(gameLoop.bind(game));
	}

	function setKeyBindings(game) {
	  document.addEventListener('keydown', function (e) {
	    game.keyPressed[e.keyCode] = true;
	    if (e.keyCode === 89) {
	      console.log("Hi");
	      debugger;
	    }
	  }, false);
	  document.addEventListener('keyup', function (e) {
	    game.keyPressed[e.keyCode] = false;
	  }, false);
	}

	function setStartScreen(gameLoop, game) {
	  var startScreen = document.getElementById("start-screen");
	  var instructionsScreen = document.getElementById("instructions-screen");
	  var startButton = document.getElementById("start");
	  var instructionsButton = document.getElementById("instructions");
	  var backButton = document.getElementById("back");
	  startButton.addEventListener('click', function () {
	    startScreen.className += "hidden";
	    requestAnimationFrame(gameLoop.bind(game));
	  });
	  instructionsButton.addEventListener('click', function () {
	    startScreen.className += "hidden";
	    instructionsScreen.className = "";
	  });
	  backButton.addEventListener('click', function () {
	    startScreen.className = "";
	    instructionsScreen.className += "hidden";
	  });
	}

	function setEndScreen(gameLoop, game) {
	  var endScreen = document.getElementById('end-game');
	  endScreen.addEventListener('click', function () {
	    game.dino = new Dinosaur(game.canvas);
	    game.windups = [new Windup(game.canvas), new Windup(game.canvas)];
	    game.bubbles = [];
	    game.fruits = [];
	    endScreen.className += "hidden";
	    setKeyBindings(game.canvas, game.dino, game.bubbles);
	    requestAnimationFrame(gameLoop.bind(game));
	  });
	}

	module.exports = Game;

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	function Bubble(x, y, direction, canvas) {
	  this.x = x;
	  this.y = y;
	  this.direction = direction;
	  this.status = "new";
	  this.height = 30;
	  this.width = 30;
	  this.count = 0;
	  this.canvas = canvas;
	  this.image = setBubbleImage('lib/bubble_new.png');
	  setXAndXInc(this);
	}

	Bubble.prototype.draw = function (context) {
	  context.drawImage(this.image, this.x, this.y, this.width, this.height);
	  return this;
	};

	Bubble.prototype.move = function () {
	  var bubble = this;
	  float(bubble);
	  bubble.count++;
	  if (doneFloatingSidewaysOrHitAWall(bubble)) {
	    bubble.status = "floating";
	    if (!bubble.filled) {
	      bubble.image = setBubbleImage('lib/bubble_floating.png');
	    }
	  }
	  if (onRightEdge(bubble)) {
	    bubble.x = bubble.canvas.width - bubble.width;
	  }
	  if (onLeftEdge(bubble)) {
	    bubble.x = 0;
	  }
	  if (onCeiling(bubble)) {
	    bubble.status = "done";
	  }
	  return bubble;
	};

	Bubble.prototype.fillUp = function () {
	  this.status = "floating";
	  this.image = setBubbleImage('lib/bubble_filled.png');
	  this.filled = true;
	};

	function doneFloatingSidewaysOrHitAWall(bubble) {
	  return onRightEdge(bubble) || onLeftEdge(bubble) || bubble.count === 100;
	}

	function onCeiling(bubble) {
	  return bubble.y <= 0;
	}

	function onRightEdge(bubble) {
	  return bubble.x >= bubble.canvas.width - bubble.width;
	}

	function onLeftEdge(bubble) {
	  return bubble.x <= 0;
	}

	function float(bubble) {
	  if (bubble.status === "new") {
	    bubble.x += bubble.xInc;
	  } else if (bubble.status === "floating") {
	    bubble.y--;
	  }
	  return bubble;
	}

	function setXAndXInc(bubble) {
	  if (bubble.direction === "right") {
	    bubble.x += 3;
	    bubble.xInc = 1;
	  } else {
	    bubble.x -= 3;
	    bubble.xInc = -1;
	  }
	}

	function setBubbleImage(imageSrc) {
	  var image = document.createElement("img");
	  image.src = imageSrc;
	  image.style.visibility = 'hidden';
	  return image;
	}
	module.exports = Bubble;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Collision = __webpack_require__(4);

	function Dinosaur(canvas) {
	  this.height = 25;
	  this.width = 25;
	  this.x = canvas.width / 2;
	  this.y = canvas.height - this.height - 10;
	  this.status = null;
	  this.direction = "right";
	  this.dino_img_left = createImage("lib/bob_left.png");
	  this.dino_img_left_1 = createImage("lib/bob_left_1.png");
	  this.dino_img_left_2 = createImage("lib/bob_left_2.png");
	  this.dino_img_right = createImage("lib/bob_right.png");
	  this.dino_img_right_1 = createImage("lib/bob_right_1.png");
	  this.dino_img_right_2 = createImage("lib/bob_right_2.png");
	  this.count = 0;
	  this.canvas = canvas;
	  this.points = 0;
	  this.rebornTime = 0;
	  this.lives = 3;
	  this.jumpSteps = 20;
	  this.jumpTotal = 150;
	  this.jumpSize = this.jumpTotal / this.jumpSteps;
	  this.level = 1;
	}

	Dinosaur.prototype.reborn = function () {
	  if (this.rebornTime === 0) {
	    this.x = this.canvas.width / 2;
	    this.y = this.canvas.height - this.height - 10;
	    this.direction = "right";
	    this.rebornTime = 150;
	    this.lives--;
	    resetDino(this);
	  }
	};

	// These perhaps should be getters instead of functions
	Dinosaur.prototype.mouthX = function () {
	  if (this.direction === "right") {
	    return this.x + this.width;
	  }
	  return this.x - 30;
	};

	Dinosaur.prototype.mouthY = function () {
	  return this.y;
	};

	Dinosaur.prototype.dino_img = function () {
	  if (this.direction === "right" && this.rebornTime >= 75) {
	    return this.dino_img_right_1;
	  } else if (this.direction === "right" && this.rebornTime > 0 && this.rebornTime < 75) {
	    return this.dino_img_right_2;
	  } else if (this.direction === "right") {
	    return this.dino_img_right;
	  } else if (this.direction === "left" && this.rebornTime >= 75) {
	    return this.dino_img_left_1;
	  } else if (this.direction === "left" && this.rebornTime > 0 && this.rebornTime < 75) {
	    return this.dino_img_left_2;
	  } else if (this.direction === "left") {
	    return this.dino_img_left;
	  }
	};

	Dinosaur.prototype.draw = function (context) {
	  context.drawImage(this.dino_img(), this.x, this.y, this.width, this.height);
	  return this;
	};

	Dinosaur.prototype.left = function (game) {
	  var verticalFloors = findVerticalFloors(game.floors());
	  console.log(runIntoVerticalFloor(this, verticalFloors, "left"));
	  console.log(notOnTopWall(this));
	  if (runIntoVerticalFloor(this, verticalFloors, "left") && notOnTopWall(this)) {
	    this.x = this.x;
	  } else if (this.x > 4) {
	    this.x -= 2;
	  } else {
	    this.x = 0;
	  }
	  this.direction = "left";
	  return this;
	};

	Dinosaur.prototype.right = function (game) {
	  var verticalFloors = findVerticalFloors(game.floors());
	  if (runIntoVerticalFloor(this, verticalFloors, "right") && notOnTopWall(this)) {
	    this.x = this.x;
	  } else if (this.x < this.canvas.width - this.width) {
	    this.x += 2;
	  } else {
	    this.x = this.canvas.width - this.width;
	  }
	  this.direction = "right";
	  return this;
	};

	Dinosaur.prototype.move = function (floors) {
	  if (this.rebornTime > 0) {
	    this.rebornTime--;
	  }
	  if (this.status === "jumping") {
	    this.jump(floors);
	  }
	  if (!onAFloor(floors, this)) {
	    this.y += 2;
	  }
	  return this;
	};

	Dinosaur.prototype.jump = function (floors) {
	  var dino = this;
	  if (stillJumpingUp(dino)) {
	    dontHitCeiling(dino);
	  } else if (jumpingDown(dino)) {
	    findNearestFloor(floors, dino);
	  } else if (finishedJumpingAndFalling(dino)) {
	    resetDino(dino);
	  }
	  return dino;
	};

	Dinosaur.prototype.setJumpingStatus = function () {
	  if (!this.status) {
	    this.status = "jumping";
	  }
	};

	function onThisFloor(floor, dino) {
	  var dino_collider = { x: dino.x + dino.width / 2, y: dino.y + dino.height };
	  var floor_receiver = { minX: floor.x,
	    maxX: floor.x + floor.width,
	    minY: floor.y,
	    maxY: floor.y + floor.height };
	  if (Collision.collision(dino_collider, floor_receiver)) {
	    return true;
	  }
	}

	function stillJumpingUp(dino) {
	  return dino.count < dino.jumpSteps;
	}

	function jumpingDown(dino) {
	  return dino.count >= dino.jumpSteps && dino.count < 2 * dino.jumpSteps;
	}

	function finishedJumpingAndFalling(dino) {
	  return dino.count === 2 * dino.jumpSteps;
	}

	function resetDino(dino) {
	  dino.status = null;
	  dino.count = 0;
	}

	function findNearestFloor(floors, dino) {
	  dino.count++;
	  floors.forEach(function (floor) {
	    if (onThisFloor(floor, dino)) {
	      dino.y = floor.y - floor.height / 2 - dino.height - 2;
	      resetDino(dino);
	    }
	  });
	  dino.y += dino.jumpSize;
	  return dino;
	}

	function dontHitCeiling(dino) {
	  dino.count++;
	  if (dino.y - dino.jumpSize > 0) {
	    dino.y -= dino.jumpSize;
	  } else {
	    dino.y = 0;
	    dino.count = dino.jumpSteps;
	  }
	}

	function createImage(imageSrc) {
	  var image = document.createElement("img");
	  image.src = imageSrc;
	  image.style.visibility = 'hidden';
	  return image;
	}

	function onAFloor(floors, dino) {
	  var floor;
	  for (var i = 0; i < floors.length; i++) {
	    floor = floors[i];
	    if (onThisFloor(floor, dino)) {
	      return true;
	    }
	  }
	  return false;
	}

	function findVerticalFloors(floors) {
	  var verticalFloors = [];
	  floors.forEach(function (floor) {
	    if (floor.height > 10) {
	      verticalFloors.push(floor);
	    }
	  });
	  return verticalFloors;
	}

	function runIntoVerticalFloor(dino, verticalFloors, direction) {
	  for (var i = 0; i < verticalFloors.length; i++) {
	    var dino_collider = Collision.generateReceiver(dino);
	    var floor_receiver = Collision.generateReceiver(verticalFloors[i]);
	    if (Collision.collisionVertical(dino_collider, floor_receiver, direction)) {
	      return true;
	    }
	  }
	  return false;
	}

	function notOnTopWall(dino) {
	  return !(dino.y > 30 && dino.y < 34);
	}

	module.exports = Dinosaur;

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.collision = collision;
	exports.collisionVertical = collisionVertical;
	exports.generateCollider = generateCollider;
	exports.generateReceiver = generateReceiver;

	function collision(collider, receiver) {
	  return collideX(collider, receiver) && collideY(collider, receiver);
	}

	function collisionVertical(collider, receiver, direction) {
	  return collideXVertical(collider, receiver, direction) && collideYVertical(collider, receiver);
	}

	function generateCollider(object) {
	  return { x: object.x + object.width / 2,
	    y: object.y + object.height / 2 };
	}

	function generateReceiver(object) {
	  return { minX: object.x,
	    maxX: object.x + object.width,
	    minY: object.y,
	    maxY: object.y + object.height };
	}

	function collideX(collider, receiver) {
	  return collider.x >= receiver.minX && collider.x <= receiver.maxX;
	}

	function collideY(collider, receiver) {
	  return collider.y >= receiver.minY && collider.y <= receiver.maxY;
	}

	function collideYVertical(collider, receiver) {
	  return collider.maxY >= receiver.minY && collider.minY <= receiver.maxY;
	}

	function collideXVertical(collider, receiver, direction) {
	  if (direction === "right") {
	    return collider.maxX > receiver.minX - 2 && collider.maxX < receiver.minX + 2;
	  } else {
	    return collider.minX < receiver.maxX + 2 && collider.minX > receiver.maxX - 2;
	  }
	}

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	function Windup(canvas) {
	  this.x = Math.random() * (canvas.width - 17);
	  this.y = 0;
	  this.height = 20;
	  this.width = 20;
	  this.canvas = canvas;
	  this.count = 0;
	  this.fallRate = 0.75;
	  this.paceRate = 0.75;
	  this.direction = "right";
	  this.img_right = createImage('lib/windup_right.png');
	  this.img_left = createImage('lib/windup_left.png');
	}

	Windup.prototype.draw = function (context) {
	  context.drawImage(this.img(), this.x, this.y, this.width, this.height);
	  return this;
	};

	Windup.prototype.img = function () {
	  if (this.direction === "right") {
	    return this.img_right;
	  } else {
	    return this.img_left;
	  }
	};

	Windup.prototype.fall = function () {
	  if (this.y < this.canvas.height - this.height - 10) {
	    this.count++;
	    this.y += this.fallRate;
	  }
	  return this;
	};

	Windup.prototype.move = function (dino) {
	  if (this.y < this.canvas.height - this.height - 10) {
	    this.fall();
	  } else if (this.x >= dino.x) {
	    this.direction = "left";
	    this.x -= this.paceRate;
	  } else if (this.x < dino.x) {
	    this.direction = "right";
	    this.x += this.paceRate;
	  }
	  return this;
	};

	function createImage(imageSrc) {
	  var image = document.createElement("img");
	  image.src = imageSrc;
	  image.style.visibility = 'hidden';
	  return image;
	}

	module.exports = Windup;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.gameOver = gameOver;
	exports.respondToPresses = respondToPresses;
	exports.checkDinoWindupCollisions = checkDinoWindupCollisions;
	exports.checkDinoFruitCollisions = checkDinoFruitCollisions;
	exports.checkDinoBubbleCollisions = checkDinoBubbleCollisions;
	exports.checkWindupBubbleCollisions = checkWindupBubbleCollisions;
	exports.drawWindups = drawWindups;
	exports.drawBubbles = drawBubbles;
	exports.drawFruits = drawFruits;
	exports.drawFloors = drawFloors;
	exports.drawScore = drawScore;
	exports.levelUp = levelUp;
	exports.nextLevel = nextLevel;
	exports.endGameSequence = endGameSequence;
	var Collision = __webpack_require__(4);
	var Fruit = __webpack_require__(7);
	var Windup = __webpack_require__(5);
	var Bubble = __webpack_require__(2);

	function gameOver(dino, bubbles, windups, fruits) {
	  if (dino.lives === 0 || dino.level === 3 && allFilledBubblesPopped(bubbles) && windups.length === 0 && allFruitsCollected(fruits)) {
	    return true;
	  }
	  return false;
	}

	function respondToPresses(game) {
	  if (game.keyPressed[65]) {
	    game.dino.left(game);
	    console.log(game.keyPressed);
	  }
	  if (game.keyPressed[68]) {
	    game.dino.right(game);
	  }
	  if (game.keyPressed[87] || game.keyPressed[75]) {
	    game.dino.setJumpingStatus();
	  }
	  if (game.keyPressed[32] || game.keyPressed[74]) {
	    var bubble = new Bubble(game.dino.mouthX(), game.dino.mouthY(), game.dino.direction, game.canvas);
	    game.bubbles.push(bubble);
	  }
	}

	function checkDinoWindupCollisions(dino, windups) {
	  windups.forEach(function (windup) {
	    var windup_collider = Collision.generateCollider(windup);
	    var dino_receiver = Collision.generateReceiver(dino);
	    if (Collision.collision(windup_collider, dino_receiver)) {
	      dino.reborn();
	      console.log("dino has " + dino.lives + " lives remaining");
	      return;
	    }
	  });
	}

	function checkDinoFruitCollisions(dino, fruits) {
	  fruits.forEach(function (fruit) {
	    var fruit_collider = Collision.generateCollider(fruit);
	    var dino_receiver = Collision.generateReceiver(dino);
	    if (Collision.collision(fruit_collider, dino_receiver) && fruit.collectible()) {
	      fruit.status = "collected";
	      dino.points += fruit.points;
	      console.log("Dino has " + dino.points + " points");
	    }
	  });
	}

	function checkDinoBubbleCollisions(dino, bubbles, fruits, canvas) {
	  bubbles.forEach(function (bubble) {
	    var bubble_collider = Collision.generateCollider(bubble);
	    var dino_receiver = Collision.generateReceiver(dino);
	    if (Collision.collision(bubble_collider, dino_receiver)) {
	      if (bubble.filled && bubble.status !== "popped") {
	        var fruit = new Fruit(canvas, bubble.x, bubble.y, 1000);
	        fruits.push(fruit);
	      }
	      bubble.status = "popped";
	    }
	  });
	  return bubbles;
	}

	function checkWindupBubbleCollisions(windups, bubbles) {
	  bubbles.forEach(function (bubble) {
	    windups.forEach(function (windup, index, windups) {
	      var bubble_collider = Collision.generateCollider(bubble);
	      var windup_receiver = Collision.generateReceiver(windup);
	      if (Collision.collision(bubble_collider, windup_receiver) && bubble.status === "new") {
	        bubble.fillUp();
	        windups.splice(index, 1);
	      }
	    });
	  });
	}

	function drawWindups(windups, context, dino) {
	  windups.forEach(function (windup) {
	    windup.move(dino).draw(context);
	  });
	}

	function drawBubbles(bubbles, context) {
	  bubbles.forEach(function (bubble) {
	    if (bubble.status !== "popped") {
	      bubble.move().draw(context);
	    }
	  });
	}

	function drawFruits(fruits, context) {
	  fruits.forEach(function (fruit) {
	    if (fruit.status !== "collected") {
	      fruit.fall().draw(context);
	    }
	  });
	}

	function drawFloors(floors, context) {
	  floors.forEach(function (floor) {
	    floor.draw(context);
	  });
	}

	function drawScore(dino, context) {
	  context.font = "10px Georgia";
	  context.fillText("Score: " + dino.points, 10, 10);
	  context.fillText("Lives: " + dino.lives, 10, 25);
	}

	function levelUp(dino, fruits, windups, canvas, bubbles) {
	  if (levelOver(windups, fruits, dino, bubbles)) {
	    if (dino.level === 1 || dino.level === 2) {
	      var newWindups = [new Windup(canvas), new Windup(canvas)];
	      setTimeout(function () {
	        dino.level++;
	      }, 2000);
	      return newWindups;
	    }
	  }
	}

	function nextLevel(game) {
	  var elem = document.getElementById('game');
	  elem.style.transition = "opacity 1s linear 0s";
	  elem.style.opacity = 0;
	  setTimeout(function () {
	    elem.style.opacity = 1;
	    if (game) {
	      game.bubbles = [];
	      game.windups.forEach(function (windup) {
	        windup.y = 0;
	      });
	      game.dino.x = game.canvas.width / 2;
	      game.dino.y = game.canvas.height - game.dino.height - 10;
	    }
	  }, 2000);
	}

	function endGameSequence() {
	  nextLevel(null);
	  setTimeout(function () {
	    document.getElementById('end-game').className = "";
	  }, 2000);
	}

	function allFruitsCollected(fruits) {
	  return fruits.every(function (element) {
	    return element.status === "collected";
	  });
	}

	function levelOver(windups, fruits, dino, bubbles) {
	  return windups.length === 0 && allFruitsCollected(fruits) && allFilledBubblesPopped(bubbles);
	}

	function allFilledBubblesPopped(bubbles) {
	  for (var i = 0; i < bubbles.length; i++) {
	    if (bubbles[i].filled && !(bubbles[i].status === "popped")) {
	      return false;
	    }
	  }
	  return true;
	}

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";

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

	Fruit.prototype.draw = function (context) {
	  context.drawImage(this.image, this.x, this.y, this.width, this.height);
	  return this;
	};

	Fruit.prototype.fall = function () {
	  if (this.y < this.canvas.height - this.height - 10) {
	    this.count++;
	    this.y += this.fallRate;
	  }
	  return this;
	};

	Fruit.prototype.collectible = function () {
	  return this.y > this.startingY + 10 && this.status !== "collected";
	};

	function createImage(imageSrc) {
	  var image = document.createElement("img");
	  image.src = imageSrc;
	  image.style.visibility = 'hidden';
	  return image;
	}

	function createFruitImage() {
	  var randFruit = 'lib/fruit' + Math.round(Math.random() * 5) + '.png';
	  return createImage(randFruit);
	}
	module.exports = Fruit;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Floor = __webpack_require__(9);

	function Levels() {}

	Levels.prototype.whichLevel = function (canvas, level) {
	  if (level === 1) {
	    return levelOne(canvas);
	  } else if (level === 2) {
	    return levelTwo(canvas);
	  } else if (level === 3) {
	    return levelThree(canvas);
	  }
	};

	function levelOne(canvas) {
	  return [new Floor(canvas, 85, 100, 10, 230), new Floor(canvas, 85, 215, 10, 230), new Floor(canvas, 85, 315, 10, 230), new Floor(canvas, 0, 315, 10, 50), new Floor(canvas, 0, 215, 10, 50), new Floor(canvas, 0, 100, 10, 50), new Floor(canvas, 350, 100, 10, 50), new Floor(canvas, 350, 215, 10, 50), new Floor(canvas, 350, 315, 10, 50), new Floor(canvas, 0, canvas.height - 10, 10, canvas.width)];
	}

	function levelTwo(canvas) {
	  return [new Floor(canvas, 0, canvas.height - 10, 10, canvas.width), new Floor(canvas, 55, 315, 10, 75), new Floor(canvas, 165, 315, 10, 75), new Floor(canvas, 275, 315, 10, 75), new Floor(canvas, 90, 235, 10, 225), new Floor(canvas, 140, 160, 10, 50), new Floor(canvas, 225, 160, 10, 50), new Floor(canvas, 170, 85, 10, 70)];
	}

	function levelThree(canvas) {
	  return [new Floor(canvas, 0, canvas.height - 10, 10, canvas.width), new Floor(canvas, 0, 315, 10, 75), //1
	  new Floor(canvas, 105, 315, 10, 50), //2
	  new Floor(canvas, 250, 315, 10, 50), //3
	  new Floor(canvas, 325, 315, 10, 75), //4
	  new Floor(canvas, 50, 55, 200, 10), // left vertical
	  new Floor(canvas, 350, 55, 200, 10), //right vertical
	  new Floor(canvas, 50, 55, 10, 115), //top left
	  new Floor(canvas, 50, 155, 10, 135), //left middle
	  new Floor(canvas, 50, 255, 10, 145), //bottom left
	  new Floor(canvas, 215, 255, 10, 145), //bottom right
	  new Floor(canvas, 225, 155, 10, 135), //middle right
	  new Floor(canvas, 245, 55, 10, 115)]; //top right
	}

	module.exports = Levels;

/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";

	function Floor(canvas, x, y, height, width) {
	  this.x = x;
	  this.y = y;
	  this.height = height;
	  this.width = width;
	}

	Floor.prototype.draw = function (context) {
	  context.fillStyle = "#28B463";
	  context.fillRect(this.x, this.y, this.width, this.height);
	  context.fillStyle = "#000";
	  return this;
	};

	module.exports = Floor;

/***/ }
/******/ ]);