var assert = require('chai').assert;
var Bubble = require('../lib/bubbles');

describe('bubble', function(){
  beforeEach(function(){
     this.canvas = { width: 200, height: 100};
     this.bubble = new Bubble(35, 65, "right", this.canvas);
  });

  it('has initial properties', function(){
    assert.equal(this.bubble.x, 38);
    assert.equal(this.bubble.y, 65);
    assert.equal(this.bubble.direction, "right");
    assert.equal(this.bubble.status, "new");
    assert.equal(this.bubble.height, 30);
    assert.equal(this.bubble.width, 30);
    assert.equal(this.bubble.xInc, 1);
    assert.equal(this.bubble.count, 0);
    assert.equal(this.bubble.canvas, this.canvas);
  });

  it('moves', function(){
    this.bubble.move();
    assert.equal(this.bubble.x, 39);
    assert.equal(this.bubble.count, 1);
    assert.equal(this.bubble.status, "new");
    this.bubble.count = 99;
    this.bubble.move();
    assert.equal(this.bubble.status, "floating");
  });

  it('stops at the top of the screen', function(){
    this.bubble.y = 1;
    this.bubble.status = "floating";
    this.bubble.move();
    assert.equal(this.bubble.y, 0);
    assert.equal(this.bubble.status, "done");
    this.bubble.move();
    assert.equal(this.bubble.y, 0);
  });

  it('cant move left past the screen', function(){
    this.bubble.x = 1;
    this.bubble.xInc = -1;
    this.bubble.move();
    assert.equal(this.bubble.x, 0);
    this.bubble.move();
    assert.equal(this.bubble.x, 0);
  });

  it('cant move right past the screen', function(){
    this.bubble.x = 199;
    this.bubble.xInc = 1;
    this.bubble.move();
    assert.equal(this.bubble.x, 170);
    this.bubble.move();
    assert.equal(this.bubble.x, 170);
  });

  it('can be filled up', function(){
    this.bubble.fillUp();
    assert.equal(this.bubble.status, "floating");
    assert(this.bubble.filled);
    assert.equal(this.bubble.height, 30);
    assert.equal(this.bubble.width, 30);
  });
});
