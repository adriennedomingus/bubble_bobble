var assert = require('chai').assert;
var GamePlay = require('../lib/game_play');
var Dinosaur = require('../lib/dinosaur');
var Bubble = require('../lib/bubbles');
var Fruit = require('../lib/fruits');
var Windup = require('../lib/windup');

describe('GamePlay', function(){
  beforeEach(function(){
    this.canvas = {height: 100, width: 200};
    this.dino = new Dinosaur(this.canvas);
    this.bubble = new Bubble(30, 150, "right", this.canvas);
    this.windup = new Windup(this.canvas);
    this.fruit = new Fruit(this.canvas, 25, 40, 100);
  });

  context('game over', function(){
    it('can tell if dino has no lives',function(){
      assert.isFalse(GamePlay.gameOver(this.dino, [],[]));

      this.dino.lives = 0;
      assert.isTrue(GamePlay.gameOver(this.dino, [],[]));
    });

    it('can tell if dino is on the last level and wins',function(){
      this.dino.level = 3;
      this.bubble.status = "popped";
      this.fruit.status = "collected"
      assert(GamePlay.gameOver(this.dino, [this.bubble],[],[this.fruit]));
    });

    it('can tell if dinosaur not on last level',function(){
      this.dino.level = 2;
      this.bubble.filled = true;
      this.bubble.status = "popped";
      this.fruit.status = "collected"
      assert.isFalse(GamePlay.gameOver(this.dino, [this.bubble],[],[this.fruit]));
    });

    it('can tell if all bubbles with enemies are not popped',function(){
      this.dino.level = 3;
      this.bubble.filled = true;
      this.bubble.status = "floating";
      this.fruit.status = "collected";
      assert.isFalse(GamePlay.gameOver(this.dino, [this.bubble],[],[this.fruit]));
    });

    it('can tell if not all fruits are collected',function(){
      this.dino.level = 3;
      this.bubble.filled = true;
      this.bubble.status = "popped";
      assert.isFalse(GamePlay.gameOver(this.dino, [this.bubble],[],[this.fruit]));
    });

    it('can tell if not all enemies have been collected',function(){
      this.dino.level = 3;
      this.bubble.filled = true;
      this.bubble.status = "popped";
      this.fruit.status = "collected";
      assert.isFalse(GamePlay.gameOver(this.dino, [this.bubble],[this.windup],[this.fruit]));
    });
  });

})
