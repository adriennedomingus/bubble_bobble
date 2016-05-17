var assert = require('chai').assert;
var Windup = require('../lib/windup');

describe('windup', function(){
  beforeEach(function(){
     this.canvas = { width: 200, height: 100};
     this.windup = new Windup(this.canvas);
  });

  it('has initial properties', function(){
    assert.equal(this.windup.x, 100);
    assert.equal(this.windup.y, 0);
    assert.equal(this.windup.height, 17);
    assert.equal(this.windup.width, 17);
    assert.equal(this.windup.canvas, this.canvas);
    assert.equal(this.windup.count, 0);
    assert.equal(this.windup.fallRate, 0.75);
    assert.equal(this.windup.paceRate, 0.75);
  });

  it('falls and then paces', function(){
    this.windup.move();
    assert.equal(this.windup.y, 0.75);
    this.y = this.canvas.height - 5;
    this.windup.move();
    assert.equal(this.windup.y, 1.5);
    this.windup.y = this.canvas.height;
    this.windup.move();
    assert.equal(this.windup.x, 100.75);
  });
});
