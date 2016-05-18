var assert = require('chai').assert;
var Fruit = require('../lib/fruits');

describe('fruit', function(){
  beforeEach(function(){
     this.canvas = { width: 200, height: 100};
     this.fruit = new Fruit(this.canvas, 72, 0, 1000);
  });

  it('has starting properties', function(){
    assert.equal(this.fruit.canvas, this.canvas);
    assert.equal(this.fruit.x, 72);
    assert.equal(this.fruit.y, 0);
    assert.equal(this.fruit.points, 1000);
    assert.equal(this.fruit.height, 10);
    assert.equal(this.fruit.width, 20);
    assert.equal(this.fruit.count, 0);
    assert.equal(this.fruit.fallRate, 0.75);
  });

  it('falls but not past the bottom', function(){
    this.fruit.fall();
    assert.equal(this.fruit.y, 0.75);
    this.fruit.fall();
    assert.equal(this.fruit.y, 1.5);
    this.fruit.y = 100;
    this.fruit.fall();
    assert.equal(this.fruit.y, 100);
  });
});
