var assert = require('chai').assert;
var Dinosaur = require('../lib/dinosaur');

describe('dinosaur', function(){
  it('has starting properties', function(){
    var dino = new Dinosaur();
    assert.equal(dino.height, 25);
  });
});
