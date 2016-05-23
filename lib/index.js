var Game = require('../lib/game');

var canvas = document.getElementById('game');

var game = new Game(canvas);
game.play();
