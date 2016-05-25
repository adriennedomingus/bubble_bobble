var Dinosaur = require('../lib/dinosaur');
var Windup = require('../lib/windup');
var GamePlay = require('../lib/game_play');
var Levels = require('../lib/levels');

function Game(canvas){
  this.canvas = canvas;
  this.context = canvas.getContext('2d');
  this.dino = new Dinosaur(this.canvas, "bob");
  this.windups = [new Windup(canvas), new Windup(canvas)];
  this.bubbles = [];
  this.fruits = [];
  this.keyPressed = {};
}

Game.prototype.play = function(){
  setKeyBindings(this);
  loadHighScores();
  setStartScreen(gameLoop, gameLoop2P, this);
  setEndScreen(gameLoop, this);
  set2PEndScreens(gameLoop2P, this);
};

Game.prototype.floors = function(){
  return new Levels().whichLevel(this.canvas, this.dino.level);
};

function gameLoop(){
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
  GamePlay.decrementFruitValues(game.fruits);
  if (GamePlay.gameOver(game.dino, game.bubbles, game.windups, game.fruits)) {
    recordScore(game);
    loadHighScores();
    GamePlay.endGameSequence(game.dino);
    return true;
  }
  var newWindups = GamePlay.levelUp(game.dino, game.fruits, game.windups, game.canvas, game.bubbles);
  if (newWindups) {
    game.windups = newWindups;
    GamePlay.nextLevel(game);
  }
  requestAnimationFrame(gameLoop.bind(game));
}

function gameLoop2P(){
  var game = this;
  game.context.clearRect(0, 0, game.canvas.width, game.canvas.height);
  GamePlay.drawFloors(game.floors(), game.context);
  GamePlay.respondToPresses2P(game);
  game.dino.move(game.floors()).draw(game.context);
  game.dino2.move(game.floors()).draw(game.context);
  GamePlay.drawBubbles(game.bubbles, game.context);
  GamePlay.checkWindupBubbleCollisions(game.windups, game.bubbles);
  GamePlay.checkDinoBubbleCollisions(game.dino, game.bubbles, game.fruits, game.canvas);
  GamePlay.checkDinoBubbleCollisions(game.dino2, game.bubbles, game.fruits, game.canvas);
  GamePlay.drawFruits(game.fruits, game.context);
  GamePlay.checkDinoFruitCollisions(game.dino, game.fruits);
  GamePlay.checkDinoFruitCollisions(game.dino2, game.fruits);
  GamePlay.drawWindups(game.windups, game.context, game.dino);
  GamePlay.checkDinoWindupCollisions(game.dino, game.windups);
  GamePlay.checkDinoWindupCollisions(game.dino2, game.windups);
  GamePlay.drawScore(game.dino, game.context);
  GamePlay.drawScore2(game.dino2, game.context);
  GamePlay.decrementFruitValues(game.fruits);
  if (GamePlay.gameOver2P(game.dino, game.dino2, game.bubbles, game.windups, game.fruits)) {
    if (game.dino.points > game.dino2.points){
      recordScore2P(game, game.dino);
    } else {
      recordScore2P(game, game.dino2);
    }
    loadHighScores2P();
    GamePlay.endGameSequence2P(game.dino, game.dino2);
    return true;
  }
  var newWindups = GamePlay.levelUp(game.dino, game.fruits, game.windups, game.canvas, game.bubbles);
  if (newWindups) {
    game.windups = newWindups;
    GamePlay.nextLevel2P(game);
  }
  requestAnimationFrame(gameLoop2P.bind(game));
}

function setKeyBindings(game){
  document.addEventListener('keydown', function(e) {
    e.preventDefault();
    game.keyPressed[e.keyCode] = true;
  }, false);
  document.addEventListener('keyup', function(e) {
    game.keyPressed[e.keyCode] = false;
  }, false);
}

function setStartScreen(gameLoop, gameLoop2P, game) {
  var startScreen = document.getElementById("start-screen");
  var instructionsScreen = document.getElementById("instructions-screen");
  var startButton = document.getElementById("start");
  var startButtonDoubleBubble = document.getElementById("start-double");
  var instructionsButton = document.getElementById("instructions");
  var backButton = document.getElementById("back");
  startButton.addEventListener('click', function(){
    startScreen.className += "hidden";
    requestAnimationFrame(gameLoop.bind(game));
  });
  instructionsButton.addEventListener('click', function(){
    startScreen.className += "hidden";
    instructionsScreen.className = "";
  });
  backButton.addEventListener('click', function(){
    startScreen.className = "";
    instructionsScreen.className += "hidden";
  });
  startButtonDoubleBubble.addEventListener('click', function(){
    startScreen.className += "hidden";
    game.dino2 = new Dinosaur(game.canvas, "bub");
    game.dino2.x = game.canvas.width - game.dino2.width;
    game.dino2.direction = "left";
    game.dino.x = 0;
    requestAnimationFrame(gameLoop2P.bind(game));
  });
}

function setEndScreen(gameLoop, game) {
  var endScreens = document.getElementsByClassName('new-single');
  for (var i = 0; i < endScreens.length; i++ ) {
    endScreens[i].addEventListener('click', function(){
      game.dino = new Dinosaur(game.canvas, "bob");
      game.windups = [new Windup(game.canvas), new Windup(game.canvas)];
      game.bubbles = [];
      game.fruits = [];
      this.parentElement.className += "hidden";
      setKeyBindings(game);
      requestAnimationFrame(gameLoop.bind(game));
    });
  }
}

function set2PEndScreens(gameLoop2P, game) {
  var endScreens = document.getElementsByClassName('new-double');
  for (var i = 0; i < endScreens.length; i++ ) {
    endScreens[i].addEventListener('click', function(){
      game.dino2 = new Dinosaur(game.canvas, "bub");
      game.dino2.x = game.canvas.width - game.dino2.width;
      game.dino2.direction = "left";
      game.dino.x = 0;
      game.dino.lives = 3;
      game.dino.level = 1;
      game.windups = [new Windup(game.canvas), new Windup(game.canvas)];
      game.bubbles = [];
      game.fruits = [];
      this.parentElement.className += "hidden";
      setKeyBindings(game);
      requestAnimationFrame(gameLoop2P.bind(game));
    });
  }
}

function recordScore(game){
  var scores = localStorage.getItem('high-scores');
  if (scores) {
    insertScore(scores, game.dino.points);
  } else {
    localStorage.setItem('high-scores', game.dino.points);
  }
}

function recordScore2P(game, winner){
  var scores = localStorage.getItem('high-scores-2p');
  if (scores) {
    insertScore(scores, winner.points);
  } else {
    localStorage.setItem('high-scores-2p', winner.points);
  }
}


function insertScore(scores, score) {
  var scoresArr = scores.split(" ");
  for(var i=0; i < scoresArr.length; i++) {
    if (score > scoresArr[i]) {
      scoresArr.splice(i, 0, score);
      break;
    }
  }
  if (score <= scoresArr[scoresArr.length-1]) {scoresArr.push(score);}
  localStorage.setItem('high-scores', scoresArr.slice(0, 10).join(" "));
}

function loadHighScores() {
  removeAllNodes();
  addHighScores();
}

function loadHighScores2P() {
  removeAllNodes2P();
  addHighScores2P();
}

function removeAllNodes(){
  var highScoreList = document.getElementById("high-score-list");
  while (highScoreList.firstChild) {
    highScoreList.removeChild(highScoreList.firstChild);
  }
}

function removeAllNodes2P(){
  var highScoreList = document.getElementById("high-score-list-double");
  while (highScoreList.firstChild) {
    highScoreList.removeChild(highScoreList.firstChild);
  }
}

function addHighScores(){
  var highScoreList = document.getElementById("high-score-list");
  var scores = localStorage.getItem('high-scores');
  if (scores) {
    scores = scores.split(" ");
    scores.forEach(function(score){
      var scoreElement = document.createElement("li");
      scoreElement.innerHTML = score;
      highScoreList.appendChild(scoreElement);
    });
  }
}

function addHighScores2P(){
  var highScoreList = document.getElementById("high-score-list-double");
  var scores = localStorage.getItem('high-scores-2p');
  if (scores) {
    scores = scores.split(" ");
    scores.forEach(function(score){
      var scoreElement = document.createElement("li");
      scoreElement.innerHTML = score;
      highScoreList.appendChild(scoreElement);
    });
  }
}
module.exports = Game;
