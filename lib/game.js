var Dinosaur = require('../lib/dinosaur');
var Windup = require('../lib/windup');
var GamePlay = require('../lib/game_play');
var Levels = require('../lib/levels');
var ScoreKeeper = require('../lib/score-keeper');

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
  ScoreKeeper.loadHighScores();
  ScoreKeeper.loadHighScores2P();
  setStartScreen(gameLoop, gameLoop2P, this);
  setEndScreen(gameLoop, this);
  set2PEndScreens(gameLoop2P, this);
};

Game.prototype.floors = function(){
  return new Levels().whichLevel(this.canvas, this.dino.level);
};


function gameLoop(){
  var game = this;
  game.context.fillStyle = "000000";
  game.context.fillRect(0, 0, game.canvas.width, game.canvas.height);
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
    ScoreKeeper.recordScore(game);
    ScoreKeeper.loadHighScores();
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
  game.context.fillStyle = "000000";
  game.context.fillRect(0, 0, game.canvas.width, game.canvas.height);
  GamePlay.drawFloors(game.floors2p, game.context);
  GamePlay.respondToPresses2P(game);
  game.dino.move(game.floors2p).draw(game.context);
  game.dino2.move(game.floors2p).draw(game.context);
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
  if (GamePlay.gameOver2P(game.dino, game.dino2)) {
    if (game.dino.points > game.dino2.points){
      ScoreKeeper.recordScore2P(game, game.dino);
    } else {
      ScoreKeeper.recordScore2P(game, game.dino2);
    }
    ScoreKeeper.loadHighScores2P();
    clearInterval(game.intID);
    GamePlay.endGameSequence2P(game.dino, game.dino2);
    return true;
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
  document.addEventListener('keydown', function(e) {
    var themeMusic  = document.getElementById("game-music");
    if(e.keyCode === 51) {
      themeMusic.pause();
    } else if (e.keyCode === 52) {
      themeMusic.play();
    }
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
    var themeMusic  = document.getElementById("game-music");
    themeMusic.play();
    game.canvas.setAttribute('width', 400);
    game.canvas.style["marginLeft"] = "125px";
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
    var themeMusic  = document.getElementById("game-music");
    themeMusic.play();
    reset2Pgame(game);
    requestAnimationFrame(gameLoop2P.bind(game));
  });
}

function setEndScreen(gameLoop, game) {
  var endScreens = document.getElementsByClassName('new-single');
  for (var i = 0; i < endScreens.length; i++ ) {
    endScreens[i].addEventListener('click', function(){
      this.parentElement.className += "hidden";
      reset1Pgame(game);
      setKeyBindings(game);
      requestAnimationFrame(gameLoop.bind(game));
    });
  }
}

function set2PEndScreens(gameLoop2P, game) {
  var endScreens = document.getElementsByClassName('new-double');
  for (var i = 0; i < endScreens.length; i++ ) {
    endScreens[i].addEventListener('click', function(){
      this.parentElement.className += "hidden";
      setKeyBindings(game);
      reset2Pgame(game);
      requestAnimationFrame(gameLoop2P.bind(game));
    });
  }
}

function reset1Pgame(game) {
  game.canvas.setAttribute('width', 400);
  game.canvas.style["marginLeft"] = "125px";
  game.canvas.style["borderTop"] = "10px solid #ff1d8e";
  game.canvas.style["borderLeft"] = "10px solid #ff1d8e";
  game.canvas.style["borderRight"] = "10px solid #ff1d8e";
  game.dino = new Dinosaur(game.canvas, "bob");
  game.windups = [new Windup(game.canvas), new Windup(game.canvas)];
  game.bubbles = [];
  game.fruits = [];
}


function reset2Pgame(game){
  game.canvas.setAttribute('width', 550);
  game.canvas.style["marginLeft"] = "50px";
  game.canvas.style["borderTop"] = "20px solid #ff1d8e";
  game.canvas.style["borderLeft"] = "20px solid #ff1d8e";
  game.canvas.style["borderRight"] = "20px solid #ff1d8e";
  game.dino2 = new Dinosaur(game.canvas, "bub");
  game.dino2.x = game.canvas.width - game.dino2.width;
  game.dino2.direction = "left";
  game.dino2.floorHeight = 20;
  game.dino.floorHeight = 20;
  game.dino.x = 0;
  game.dino.y = game.canvas.height-game.dino.height-20;
  game.dino2.y = game.canvas.height-game.dino2.height-20;
  game.windups = [new Windup(game.canvas),
                  new Windup(game.canvas),
                  new Windup(game.canvas),
                  new Windup(game.canvas)];
  game.bubbles = [];
  game.fruits = [];
  game.windups.forEach(function(windup) {
    windup.floorHeight = 20;
  });
  game.dino.lives = 3;
  game.dino.points = 0;
  game.dino.rebornTime = 0;
  game.floors2p = new Levels().twoPlayer(game.canvas);
  game.intID = setInterval(makeNewWindups.bind(game), 5000);
}

function makeNewWindups(){
  var nw = new Windup(this.canvas);
  nw.floorHeight = 20;
  this.windups.push(nw);
  nw = new Windup(this.canvas);
  nw.floorHeight = 20;
  this.windups.push(nw);
}

module.exports = Game;
