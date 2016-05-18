var assert = require('chai').assert;
var Collision = require('../lib/collision');

describe('collision', function(){
  beforeEach(function(){
    this.receiver = {};
    this.receiver.minX = 155;
    this.receiver.maxX = 180;
    this.receiver.minY = 75;
    this.receiver.maxY = 100;
  });

  it('is a collision if both x and y are in range', function(){
    var collider = {};
    collider.x = 175;
    collider.y = 82.5;

    assert.isTrue(Collision.collision(collider, this.receiver));
  });

  it('is a collision only if both x and y are in range', function(){
    var collider = {};

    collider.x = 50;
    collider.y = 82.5;
    assert.isFalse(Collision.collision(collider, this.receiver));

    collider.x = 175;
    collider.y = 30;
    assert.isFalse(Collision.collision(collider, this.receiver));

    collider.x = 50;
    collider.y = 30;
    assert.isFalse(Collision.collision(collider, this.receiver));
  });


});
