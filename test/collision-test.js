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

  it('can generate a collider', function(){
    var object = {x: 8, y: 20, width: 10, height: 16};
    var collider = Collision.generateCollider(object);
    assert.equal(collider.x, 13);
    assert.equal(collider.y, 28);
  });

  it('can generate a receiver', function(){
    var object = {x: 8, y: 20, width: 10, height: 16};
    var receiver = Collision.generateReceiver(object);
    assert.equal(receiver.minX, 8);
    assert.equal(receiver.maxX, 18);
    assert.equal(receiver.minY, 20);
    assert.equal(receiver.maxY, 36);
  });

});
