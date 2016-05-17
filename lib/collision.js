function collideBubbleDinosaur(bubble, dinosaur) {
  return collideX(bubble, dinosaur) && collideY(bubble, dinosaur);
}

function collideX(bubble, dinosaur) {
   return bubble.x > dinosaur.x && bubble.x < dinosaur.x + dinosaur.width;
}

function collideY(bubble, dinosaur) {
  return bubble.y > dinosaur.y && bubble.y < dinosaur.y + dinosaur.height;
}

module.exports.collideBubbleDinosaur = collideBubbleDinosaur;
