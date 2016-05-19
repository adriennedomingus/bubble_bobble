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

	var Bubble = __webpack_require__(1);
	var Dinosaur = __webpack_require__(2);
	var Windup = __webpack_require__(4);
	var Floor = __webpack_require__(5);
	var GamePlay = __webpack_require__(6);

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
	var floors = [new Floor(canvas, 50, 50, 75), new Floor(canvas, 0, canvas.height - 10, canvas.width)];

	document.addEventListener('keydown', function (key) {
	  if (key.keyCode === 65) {
	    dino.left();
	  } else if (key.keyCode === 68) {
	    dino.right();
	  } else if (key.keyCode === 87 || key.keyCode === 75) {
	    dino.setJumpingStatus();
	  } else if (key.keyCode === 32 || key.keyCode === 74) {
	    key.preventDefault();
	    var bubble = new Bubble(dino.mouthX(), dino.mouthY(), dino.direction, canvas);
	    bubbles.push(bubble);
	  }
	});

	var startScreen = document.getElementById("start-screen");
	startScreen.addEventListener('click', function () {
	  startScreen.className += "hidden";
	  requestAnimationFrame(gameLoop);
	});

	function gameLoop() {
	  context.clearRect(0, 0, canvas.width, canvas.height);
	  GamePlay.drawFloors(floors, context);
	  dino.move(floors).draw(context);
	  GamePlay.drawBubbles(bubbles, context);
	  windup = GamePlay.checkWindupBubbleCollisions(windup, bubbles);
	  GamePlay.checkDinoBubbleCollisions(dino, bubbles, fruits, canvas);
	  GamePlay.drawFruits(fruits, context);
	  GamePlay.checkDinoFruitCollisions(dino, fruits);
	  GamePlay.drawWindup(windup, context);
	  GamePlay.checkDinoWindupCollisions(dino, windup);
	  if (GamePlay.gameOver(dino)) {
	    console.log("Game is over, please play again");
	    return true;
	  }
	  requestAnimationFrame(gameLoop);
	}

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	function Bubble(x, y, direction, canvas) {
	  this.y = y;
	  this.direction = direction;
	  this.status = "new";
	  this.height = 5;
	  this.width = 5;
	  this.count = 0;
	  this.canvas = canvas;
	  this.setXAndXInc(x);
	}

	Bubble.prototype.draw = function (context) {
	  context.fillRect(this.x, this.y, this.width, this.height);
	  return this;
	};

	Bubble.prototype.setXAndXInc = function (x) {
	  if (this.direction === "right") {
	    this.x = x + 3;
	    this.xInc = 1;
	  } else {
	    this.x = x - 3;
	    this.xInc = -1;
	  }
	};

	Bubble.prototype.move = function () {
	  var bubble = this;
	  float(bubble);
	  bubble.count++;
	  if (doneFloatingSidewaysOrHitAWall(bubble)) {
	    bubble.status = "floating";
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
	  this.filled = true;
	  this.height = 15;
	  this.width = 15;
	};

	function doneFloatingSidewaysOrHitAWall(bubble) {
	  return onRightEdge(bubble) || onLeftEdge(bubble) || bubble.count === 50;
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

	module.exports = Bubble;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Collision = __webpack_require__(3);

	function Dinosaur(canvas, dino_img_left, dino_img_right) {
	  this.height = 25;
	  this.width = 25;
	  this.x = canvas.width / 2;
	  this.y = canvas.height - this.height - 10;
	  this.status = null;
	  this.direction = "right";
	  this.dino_img_left = dino_img_left;
	  this.dino_img_right = dino_img_right;
	  this.count = 0;
	  this.canvas = canvas;
	  this.points = 0;
	  this.rebornTime = 0;
	  this.lives = 3;
	  this.jumpSteps = 15;
	  this.jumpTotal = 55;
	  this.jumpSize = this.jumpTotal / this.jumpSteps;
	}

	Dinosaur.prototype.reborn = function () {
	  if (this.rebornTime === 0) {
	    this.x = this.canvas.width / 2;
	    this.y = this.canvas.height - this.height - 10;
	    this.direction = "right";
	    this.rebornTime = 500;
	    this.lives--;
	    resetDino(this);
	  }
	};

	Dinosaur.prototype.mouthX = function () {
	  if (this.direction === "right") {
	    return this.x + this.width;
	  }
	  return this.x;
	};

	Dinosaur.prototype.mouthY = function () {
	  return this.y + this.height / 2;
	};

	Dinosaur.prototype.dino_img = function () {
	  if (this.direction === "right") {
	    return this.dino_img_right;
	  } else {
	    return this.dino_img_left;
	  }
	};

	Dinosaur.prototype.draw = function (context) {
	  context.drawImage(this.dino_img(), this.x, this.y, this.width, this.height);
	  return this;
	};

	Dinosaur.prototype.left = function () {
	  if (this.x > 4) {
	    this.x -= 5;
	  } else {
	    this.x = 0;
	  }
	  this.direction = "left";
	  return this;
	};

	Dinosaur.prototype.right = function () {
	  if (this.x < this.canvas.width - this.width) {
	    this.x += 5;
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
	  if (!this.onAFloor(floors)) {
	    this.y += 1;
	  }
	  return this;
	};

	Dinosaur.prototype.onAFloor = function (floors) {
	  var dino = this;
	  var floor;
	  for (var i = 0; i < floors.length; i++) {
	    floor = floors[i];
	    if (onThisFloor(floor, dino)) {
	      return true;
	    }
	  }
	  return false;
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

	module.exports = Dinosaur;

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	function collision(collider, receiver) {
	  return collideX(collider, receiver) && collideY(collider, receiver);
	}

	function collideX(collider, receiver) {
	  return collider.x >= receiver.minX && collider.x <= receiver.maxX;
	}

	function collideY(collider, receiver) {
	  return collider.y >= receiver.minY && collider.y <= receiver.maxY;
	}

	function generateCollider(object) {
	  return { x: object.x + object.width / 2,
	    y: object.y + object.height / 2 };
	};

	function generateReceiver(object) {
	  return { minX: object.x,
	    maxX: object.x + object.width,
	    minY: object.y,
	    maxY: object.y + object.height };
	};

	module.exports.collision = collision;
	module.exports.generateCollider = generateCollider;
	module.exports.generateReceiver = generateReceiver;

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	function Windup(canvas) {
	  this.x = canvas.width / 2;
	  this.y = 0;
	  this.height = 17;
	  this.width = 17;
	  this.canvas = canvas;
	  this.count = 0;
	  this.fallRate = 0.75;
	  this.paceRate = 0.75;
	}

	Windup.prototype.draw = function (context) {
	  context.fillRect(this.x, this.y, this.width, this.height);
	  return this;
	};

	Windup.prototype.fall = function () {
	  if (this.y < this.canvas.height - this.height - 10) {
	    this.count++;
	    this.y += this.fallRate;
	  }
	  return this;
	};

	Windup.prototype.pace = function () {
	  if (this.x > this.canvas.width - this.width || this.x < 0) {
	    this.paceRate = -1 * this.paceRate;
	  }
	  this.x += this.paceRate;
	  return this;
	};

	Windup.prototype.move = function () {
	  if (this.y < this.canvas.height - this.height - 10) {
	    this.fall();
	  } else {
	    this.pace();
	  }
	  return this;
	};

	module.exports = Windup;

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";

	function Floor(canvas, x, y, width) {
	  this.x = x;
	  this.y = y;
	  this.height = 10;
	  this.width = width;
	}

	Floor.prototype.draw = function (context) {
	  context.fillStyle = "#28B463";
	  context.fillRect(this.x, this.y, this.width, this.height);
	  context.fillStyle = "#000";
	  return this;
	};

	module.exports = Floor;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.gameOver = gameOver;
	exports.checkDinoWindupCollisions = checkDinoWindupCollisions;
	exports.checkDinoFruitCollisions = checkDinoFruitCollisions;
	exports.checkDinoBubbleCollisions = checkDinoBubbleCollisions;
	exports.checkWindupBubbleCollisions = checkWindupBubbleCollisions;
	exports.drawWindup = drawWindup;
	exports.drawBubbles = drawBubbles;
	exports.drawFruits = drawFruits;
	exports.drawFloors = drawFloors;
	var Collision = __webpack_require__(3);
	var Fruit = __webpack_require__(7);

	function gameOver(dino) {
	  if (dino.lives === 0) {
	    return true;
	  }
	  return false;
	}

	function checkDinoWindupCollisions(dino, windup) {
	  if (windup) {
	    var windup_collider = Collision.generateCollider(windup);
	    var dino_receiver = Collision.generateReceiver(dino);
	    if (Collision.collision(windup_collider, dino_receiver)) {
	      dino.reborn();
	      console.log("dino has " + dino.lives + " lives remaining");
	    }
	  }
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

	function checkWindupBubbleCollisions(windup, bubbles) {

	  bubbles.forEach(function (bubble) {
	    if (windup) {
	      var bubble_collider = Collision.generateCollider(bubble);
	      var windup_receiver = Collision.generateReceiver(windup);
	      if (Collision.collision(bubble_collider, windup_receiver) && bubble.status === "new") {
	        bubble.fillUp();
	        windup = null;
	      }
	    }
	  });
	  return windup;
	}

	function drawWindup(windup, context) {
	  if (windup) {
	    windup.move().draw(context);
	  }
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

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";

	function Fruit(canvas, startingX, startingY, points) {
	  this.startingY = startingY;
	  this.x = startingX;
	  this.y = startingY;
	  this.height = 10;
	  this.width = 20;
	  this.canvas = canvas;
	  this.count = 0;
	  this.points = points;
	  this.fallRate = 0.75;
	  this.status = "new";
	}

	Fruit.prototype.draw = function (context) {
	  context.fillRect(this.x, this.y, this.width, this.height);
	  return this;
	};

	Fruit.prototype.fall = function () {
	  if (this.y < this.canvas.height - this.height) {
	    this.count++;
	    this.y += this.fallRate;
	  }
	  return this;
	};

	Fruit.prototype.collectible = function () {
	  return this.y > this.startingY + 10 && this.status !== "collected";
	};

	module.exports = Fruit;

/***/ }
/******/ ]);