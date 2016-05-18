function collision(element1, element2) {
  return collideX(element1, element2) && collideY(element1, element2);
}

function collideX(element1, element2) {
   return element1.x > element2.x && element1.x < element2.x + element2.width;
}

function collideY(element1, element2) {
  return element1.y > element2.y && element1.y < element2.y + element2.height;
}

module.exports.collision = collision;
