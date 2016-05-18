function collision(collider, receiver) {
  return collideX(collider, receiver) && collideY(collider, receiver);
}

function collideX(collider, receiver) {
  return collider.x >= receiver.minX && collider.x <= receiver.maxX;
}

function collideY(collider, receiver) {
  return collider.y >= receiver.minY && collider.y <= receiver.maxY;
}

module.exports.collision = collision;
