var Bubble = require('../lib/bubbles');
var Dinosaur = require('../lib/dinosaur');
var Windup = require('../lib/windup');
var GamePlay = require('../lib/game_play');
var Levels = require('../lib/levels');

function Game(canvas){
  this.canvas = canvas;
  this.context = canvas.getContext('2d');
  this.dino = new Dinosaur(this.canvas);
  this.windups = [new Windup(canvas), new Windup(canvas)];
  this.bubbles = [];
  this.fruits = [];
  this.keyPressed = {};
}

Game.prototype.play = function(){
  setKeyBindings(this);
  loadHighScores();
  setStartScreen(gameLoop, this);
  setEndScreen(gameLoop, this);
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

function setKeyBindings(game){
  document.addEventListener('keydown', function(e) {
    e.preventDefault();
    game.keyPressed[e.keyCode] = true;
  }, false);
  document.addEventListener('keyup', function(e) {
    game.keyPressed[e.keyCode] = false;
  }, false);
}

function setStartScreen(gameLoop, game) {
  var startScreen = document.getElementById("start-screen");
  var instructionsScreen = document.getElementById("instructions-screen");
  var startButton = document.getElementById("start");
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

}

function setEndScreen(gameLoop, game) {
  var endScreens = [document.getElementById('end-game-lose'), document.getElementById('end-game-win')];
  endScreens.forEach(function(screen){
    screen.addEventListener('click', function(){
      game.dino = new Dinosaur(game.canvas);
      game.windups = [new Windup(game.canvas), new Windup(game.canvas)];
      game.bubbles = [];
      game.fruits = [];
      screen.className += "hidden";
      setKeyBindings(game.canvas, game.dino, game.bubbles);
      requestAnimationFrame(gameLoop.bind(game));
    });
  });
}

function recordScore(game){
  var scores = localStorage.getItem('high-scores');
  if (scores) {
    insertScore(scores, game.dino.points);
  } else {
    localStorage.setItem('high-scores', game.dino.points);
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

function removeAllNodes(){
  var highScoreList = document.getElementById("high-score-list");
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
module.exports = Game;
