class Point {
  constructor(public x, public y) {}
  getDistance(p: Point) {
    let dx = p.x - this.x;
    let dy = p.y - this.y;
    return Math.sqrt(dx ** 2 + dy ** 2);
  }
}

interface Point {
  distanceFromOrigin(point: Point): number;
}

Point.prototype.distanceFromOrigin = function(point: Point) {
  return this.getDistance({ x: 0, y: 0 });
};
