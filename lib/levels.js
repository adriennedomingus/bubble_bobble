var Floor = require('../lib/floors');

function Levels(){}

Levels.prototype.whichLevel = function(canvas, level) {
  if (level === 1) {
    return levelOne(canvas);
  } else if (level === 2) {
    return levelTwo(canvas);
  } else if(level === 3) {
    return levelThree(canvas);
  }
};

function levelOne(canvas) {
  return [new Floor(canvas, 85, 100, 10, 230),
          new Floor(canvas, 85, 215, 10, 230),
          new Floor(canvas, 85, 315, 10, 230),
          new Floor(canvas, 0, 315, 10, 50),
          new Floor(canvas, 0, 215, 10, 50),
          new Floor(canvas, 0, 100, 10, 50),
          new Floor(canvas, 350, 100, 10, 50),
          new Floor(canvas, 350, 215, 10, 50),
          new Floor(canvas, 350, 315, 10, 50),
          new Floor(canvas, 0, canvas.height-10, 10, canvas.width)];
}

function levelTwo(canvas) {
  return [new Floor(canvas, 0, canvas.height-10, 10, canvas.width),
          new Floor(canvas, 55, 315, 10, 75),
          new Floor(canvas, 165, 315, 10, 75),
          new Floor(canvas, 275, 315, 10, 75),
          new Floor(canvas, 90, 235, 10, 225),
          new Floor(canvas, 140, 160, 10, 50),
          new Floor(canvas, 225, 160, 10, 50),
          new Floor(canvas, 170, 85, 10, 70)];
}

function levelThree(canvas) {
  return [new Floor(canvas, 0, canvas.height-10, 10, canvas.width),
          new Floor(canvas, 0, 315, 10, 75), //1
          new Floor(canvas, 105, 315, 10, 50),  //2
          new Floor(canvas, 250, 315, 10, 50), //3
          new Floor(canvas, 325, 315, 10, 75), //4
          new Floor(canvas, 50, 55, 200, 10), // left vertical
          new Floor(canvas, 350, 55, 200, 10), //right vertical
          new Floor(canvas, 50, 55, 10, 115), //top left
          new Floor(canvas, 50, 155, 10, 135), //left middle
          new Floor(canvas, 50, 255, 10, 145),//bottom left
          new Floor(canvas, 215, 255, 10, 145),//bottom right
          new Floor(canvas, 225, 155, 10, 135),//middle right
          new Floor(canvas, 225, 55, 10, 135)];//top right
}


module.exports = Levels;
