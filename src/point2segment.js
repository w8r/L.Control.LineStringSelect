"use strict";

function pointDistance(a, b) {
  var dx = a[0] - b[0],
    dy = a[1] - b[1];
  return dx * dx + dy * dy;
}

function pointLineSegmentDistance(c, a, b) {
  var dx = b[0] - a[0],
    dy = b[1] - a[1],
    d2 = dx * dx + dy * dy,
    t = d2 && ((c[0] - a[0]) * dx + (c[1] - a[1]) * (b[1] - a[1])) / d2;
  return pointDistance(c, t <= 0 ? a : t >= 1 ? b : [a[0] + t * dx, a[1] + t * dy]);
}

module.exports = pointLineSegmentDistance;
