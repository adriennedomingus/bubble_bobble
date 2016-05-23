var assert = require('chai').assert;
var Dinosaur = require('../lib/dinosaur');
var Floor = require('../lib/floors');
var Game = require('../lib/game');

describe('dinosaur', function(){
  beforeEach(function(){
     this.canvas = document.createElement('canvas');
     this.canvas.width = 200;
     this.canvas.height = 100;
     this.floors = [new Floor(this.canvas, 0, this.canvas.height-10, 10, this.canvas.width)];
     this.dino = new Dinosaur(this.canvas);
     this.game = new Game(this.canvas);
  });

  it('has starting properties', function(){
    assert.equal(this.dino.height, 25);
    assert.equal(this.dino.width, 25);
    assert.equal(this.dino.x, 100);
    assert.equal(this.dino.y, 65);
    assert.equal(this.dino.status, null);
    assert.equal(this.dino.direction, "right");
    assert.equal(this.dino.count, 0);
    assert.equal(this.dino.canvas, this.canvas);
    assert.equal(this.dino.lives, 3);
    assert.equal(this.dino.points, 0);
    assert.equal(this.dino.rebornTime, 0);
    assert.equal(this.dino.jumpSteps, 15);
    assert.equal(this.dino.jumpTotal, 140);
    assert.equal(this.dino.jumpSize, 140/15);
    assert.equal(this.dino.level, 1);
  });

  it('has a mouth', function(){
    assert.equal(this.dino.mouthX(), 125);
    assert.equal(this.dino.mouthY(), 65);
    this.dino.direction = "left";
    assert.equal(this.dino.mouthX(), 70);
    assert.equal(this.dino.mouthY(), 65);
  });

  it('uses a different image depending on direction', function() {
    assert.equal(this.dino.dino_img(), this.dino.dino_img_right);
    this.dino.direction = "left";
    assert.equal(this.dino.dino_img(), this.dino.dino_img_left);
  });

  context('#move', function(){
    it('moves left', function() {
      this.dino.left(this.game);
      assert.equal(this.dino.x, 95);
      assert.equal(this.dino.direction, "left");
    });

    it('cannnot move left past a wall', function(){
      this.dino.x = 4;
      this.dino.left(this.game);
      assert.equal(this.dino.x, 0);
      assert.equal(this.dino.direction, "left");
    });

    it('moves right', function() {
      this.dino.right(this.game);
      assert.equal(this.dino.x, 105);
      assert.equal(this.dino.direction, "right");
    });

    it('cannnot move right past a wall', function(){
      this.dino.x = 196;
      this.dino.right(this.game);
      assert.equal(this.dino.x, 175);
      assert.equal(this.dino.direction, "right");
    });

    it('does not move if it is not jumping', function(){
      this.dino.move([]);
      assert.equal(this.dino.x, 100);
      assert.equal(this.dino.y, 67);
    });

    it('does move if jumping', function(){
      this.dino.status = "jumping";
      this.dino.move([]);
      assert.equal(this.dino.x, 100);
      assert.equal(this.dino.y, 67-this.dino.jumpSize);
      assert.equal(this.dino.count, 1);
    });

    it('decrements rebornTime', function() {
      this.dino.rebornTime = 10;
      this.dino.move([]);
      assert.equal(this.dino.rebornTime, 9);
    });

    it('falls if not on a floor', function() {
      this.dino.y = 50;
      this.dino.move(this.floors);
      assert.equal(this.dino.y, 52);
    });

    it('does not fall if on a floor', function() {
      var initialY = this.dino.y;
      this.dino.move(this.floors);
      assert.equal(this.dino.y, initialY);
    });
  });

  it('jumps', function(){
    this.dino.jump([]);
    assert.equal(this.dino.y, 65-this.dino.jumpSize);
    assert.equal(this.dino.count, 1);
    this.dino.count = 16;
    this.dino.jump([]);
    assert.equal(this.dino.y, 65);
    assert.equal(this.dino.count, 17);
    this.dino.count = 30;
    this.dino.jump([]);
    assert.equal(this.dino.y, 65);
    assert.equal(this.dino.count, 0);
    assert.equal(this.dino.status, null);
  });

  it('can be reborn', function(){
    this.dino.reborn();
    assert.equal(this.dino.x, 100);
    assert.equal(this.dino.y, 65);
    assert.equal(this.dino.status, null);
    assert.equal(this.dino.direction, "right");
    assert.equal(this.dino.count, 0);
    assert.equal(this.dino.rebornTime, 150);
    assert.equal(this.dino.lives, 2);
  });

  it('does not get reborn if in provisional time', function(){
    this.dino.direction = "left";
    this.dino.rebornTime = 50;
    this.dino.reborn();
    assert.equal(this.dino.direction, "left");
    assert.equal(this.dino.rebornTime, 50);
  });

  it('has a rebornTime that decrements with every move until 0', function() {
    this.dino.rebornTime = 1;
    this.dino.move([]);
    assert.equal(this.dino.rebornTime, 0);
    this.dino.move([]);
    assert.equal(this.dino.rebornTime, 0);
  });

  describe('set Jumping status', function() {
    context('not jumping', function(){
      it('changes the status to jumping', function(){
        this.dino.setJumpingStatus();
        assert.equal("jumping", this.dino.status);
      });
    });

    context('already jumping', function(){
      it('the status remains jumping', function(){
        this.dino.setJumpingStatus();
        assert.equal("jumping", this.dino.status);
      });
    });

  });

});
