export function collision(collider, receiver) {
  return collideX(collider, receiver) && collideY(collider, receiver);
}

export function collisionVertical(collider, receiver, direction) {
  return collideXVertical(collider, receiver, direction) && collideYVertical(collider, receiver);
}

export function generateCollider(object) {
  return {x: object.x + object.width/2,
          y: object.y + object.height/2};
}

export function generateReceiver(object) {
  return {minX: object.x,
          maxX: object.x + object.width,
          minY: object.y,
          maxY: object.y + object.height};
}

function collideX(collider, receiver) {
  return collider.x >= receiver.minX && collider.x <= receiver.maxX;
}

function collideY(collider, receiver) {
  return collider.y >= receiver.minY && collider.y <= receiver.maxY;
}

function collideYVertical(collider, receiver) {
  return collider.maxY >= receiver.minY && collider.minY <= receiver.maxY;
}

function collideXVertical(collider, receiver, direction) {
  if (direction === "right") {
    return collider.maxX === receiver.minX;
  } else {
    return collider.minX === receiver.maxX;
  }
}
