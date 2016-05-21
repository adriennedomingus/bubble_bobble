var assert = require('chai').assert;
var Level = require('../lib/levels');
var Floor = require('../lib/floors');

describe('level', function(){
  beforeEach(function(){
    this.canvas = {height: 100, width: 200};
    this.levels = new Level();
  });

  it('returns an array of floors', function(){
    var lev1 = this.levels.whichLevel(this.canvas, 1);
    assert.typeOf(lev1, 'array');
    assert.instanceOf(lev1[0], Floor);
    assert.equal(lev1.length, 10);
  });

  it('has different floors for each level', function(){
    var lev2 = this.levels.whichLevel(this.canvas, 2);
    assert.equal(lev2.length, 8);
    var lev3 = this.levels.whichLevel(this.canvas, 3);
    assert.equal(lev3.length, 13);
  });
});
