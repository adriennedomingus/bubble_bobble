var assert = require('chai').assert;
var Floor = require('../lib/floors');

describe('floor', function(){
  beforeEach(function(){
    this.floor = new Floor(this.canvas, 50, 50, 10, 75);
  });

  it('has starting properties', function(){
    assert.equal(this.floor.height, 10);
    assert.equal(this.floor.width, 75);
    assert.equal(this.floor.x, 50);
    assert.equal(this.floor.y, 50);
  });
});
