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
  });
});
