var assert = require('chai').assert;
var Bubble = require('../lib/bubbles');
var Dinosaur = require('../lib/dinosaur');
var Collision = require('../lib/collision');

describe('collision', function(){
  beforeEach(function(){
     this.canvas = { width: 200, height: 100};
     this.bubble = new Bubble(35, 65, "right", this.canvas);
     this.dino_img_left = document.createElement('img');
     this.dino_img_right = document.createElement('img');
     this.dino = new Dinosaur(this.canvas, this.dino_img_left, this.dino_img_right);
  });

  it('is a collision if both x and y are in range', function(){
    this.bubble.x = 175;
    this.dino.x = 155;
    this.bubble.y = 82.5;
    this.dino.y = 75;
    assert.isTrue(Collision.collision(this.bubble, this.dino));
  });

  it('is a collision only if both x and y are in range', function(){
    this.dino.x = 155;
    this.dino.y = 75;

    this.bubble.x = 50;
    this.bubble.y = 82.5;
    assert.isFalse(Collision.collision(this.bubble, this.dino));

    this.bubble.x = 50;
    this.bubble.y = 30;
    assert.isFalse(Collision.collision(this.bubble, this.dino));

    this.bubble.x = 50;
    this.bubble.y = 30;
    assert.isFalse(Collision.collision(this.bubble, this.dino));
  });


});
