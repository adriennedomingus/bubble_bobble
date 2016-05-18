var assert = require('chai').assert;
var Dinosaur = require('../lib/dinosaur');

describe('dinosaur', function(){
  beforeEach(function(){
     this.canvas = { width: 200, height: 100};
     this.dino_img_left = document.createElement('img');
     this.dino_img_right = document.createElement('img');
     this.dino = new Dinosaur(this.canvas, this.dino_img_left, this.dino_img_right);
  });

  it('has starting properties', function(){
    assert.equal(this.dino.height, 25);
    assert.equal(this.dino.width, 25);
    assert.equal(this.dino.x, 100);
    assert.equal(this.dino.y, 75);
    assert.equal(this.dino.status, null);
    assert.equal(this.dino.direction, "right");
    assert.equal(this.dino.dino_img_left, this.dino_img_left);
    assert.equal(this.dino.dino_img_right, this.dino_img_right);
    assert.equal(this.dino.count, 0);
    assert.equal(this.dino.canvas, this.canvas);
    assert.equal(this.dino.lives, 3);
    assert.equal(this.dino.rebornTime, 0);
    assert.equal(this.dino.jumpSteps, 15);
    assert.equal(this.dino.jumpTotal, 80);
    assert.equal(this.dino.jumpSize, 80/15);
  });

  it('has a mouth', function(){
    assert.equal(this.dino.mouthX(), 125);
    assert.equal(this.dino.mouthY(), 87.5);
    this.dino.direction = "left";
    assert.equal(this.dino.mouthX(), 100);
    assert.equal(this.dino.mouthY(), 87.5);
  });

  it('uses a different image depending on direction', function() {
    assert.equal(this.dino.dino_img(), this.dino.dino_img_right);
    this.dino.direction = "left";
    assert.equal(this.dino.dino_img(), this.dino.dino_img_left);
  });

  it('moves left', function() {
    this.dino.left();
    assert.equal(this.dino.x, 95);
    assert.equal(this.dino.direction, "left");
  });

  it('cannnot move left past a wall', function(){
    this.dino.x = 4;
    this.dino.left();
    assert.equal(this.dino.x, 0);
    assert.equal(this.dino.direction, "left");
  });

  it('moves right', function() {
    this.dino.right();
    assert.equal(this.dino.x, 105);
    assert.equal(this.dino.direction, "right");
  });

  it('cannnot move right past a wall', function(){
    this.dino.x = 196;
    this.dino.right();
    assert.equal(this.dino.x, 175);
    assert.equal(this.dino.direction, "right");
  });

  it('does not move if it is not jumping', function(){
    this.dino.move();
    assert.equal(this.dino.x, 100);
    assert.equal(this.dino.y, 75);
  });

  it('does move if jumping', function(){
    this.dino.status = "jumping";
    this.dino.move();
    assert.equal(this.dino.x, 100);
    assert.equal(this.dino.y, 75-this.dino.jumpSize);
    assert.equal(this.dino.count, 1);
  });

  it('jumps', function(){
    this.dino.jump();
    assert.equal(this.dino.y, 75-this.dino.jumpSize);
    assert.equal(this.dino.count, 1);
    this.dino.count = 16;
    this.dino.jump();
    assert.equal(this.dino.y, 75);
    assert.equal(this.dino.count, 17);
    this.dino.count = 30;
    this.dino.jump();
    assert.equal(this.dino.y, 75);
    assert.equal(this.dino.count, 0);
    assert.equal(this.dino.status, null);
  });

  it('can be reborn', function(){
    this.dino.reborn();
    assert.equal(this.dino.x, 100);
    assert.equal(this.dino.y, 75);
    assert.equal(this.dino.status, null);
    assert.equal(this.dino.direction, "right");
    assert.equal(this.dino.count, 0);
    assert.equal(this.dino.rebornTime, 500);
    assert.equal(this.dino.lives, 2);
  });

  it('has a rebornTime that decrements with every move until 0', function() {
    this.dino.rebornTime = 1;
    this.dino.move();
    assert.equal(this.dino.rebornTime, 0);
    this.dino.move();
    assert.equal(this.dino.rebornTime, 0);
  });

});
