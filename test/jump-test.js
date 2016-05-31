var assert = require('chai').assert;
var Jump = require('../lib/jump');
var Dinosaur = require('../lib/dinosaur');
var Floor = require('../lib/floors');

describe('jump', function(){
  beforeEach(function() {
    this.canvas = { width: 200, height: 100};
    this.dino = new Dinosaur(this.canvas);
    this.jump = new Jump();
    this.floors = [new Floor(this.canvas, 0, this.canvas.height-10, 10, this.canvas.width)];
  });

  it('jumps', function(){
    this.jump.jump(this.floors, this.dino);
    assert.equal(this.dino.y, 65-this.dino.jumpSize);
    assert.equal(this.dino.count, 1);
    this.dino.count = 21;
    this.jump.jump(this.floors, this.dino);
    assert.equal(this.dino.y, 65);
    assert.equal(this.dino.count, 22);
    this.dino.count = 40;
    this.jump.jump(this.floors, this.dino);
    assert.equal(this.dino.y, 65);
    assert.equal(this.dino.count, 0);
    assert.equal(this.dino.status, null);
  });

});
