function collision(collider, receiver) {
  return collideX(collider, receiver) && collideY(collider, receiver);
}

function collideX(collider, receiver) {
  return collider.x >= receiver.minX && collider.x <= receiver.maxX;
}

function collideY(collider, receiver) {
  return collider.y >= receiver.minY && collider.y <= receiver.maxY;
}

function generateCollider(object) {
  return {x: object.x+object.width/2,
          y: object.y+object.height/2};
};

function generateReceiver(object) {
  return {minX: object.x,
          maxX: object.x+object.width,
          minY: object.y,
          maxY: object.y+object.height};
};

module.exports.collision = collision;
module.exports.generateCollider = generateCollider;
module.exports.generateReceiver = generateReceiver;
