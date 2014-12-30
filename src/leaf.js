"use strict";

var pointLineSegmentDistance = require('./point2segment');

function Leaf(point0, point1) {
  this.coordinates = [point0, point1];
  this.extent = [
    [Math.min(point0[0], point1[0]), Math.min(point0[1], point1[1])],
    [Math.max(point0[0], point1[0]), Math.max(point0[1], point1[1])]
  ];
}


Leaf.prototype.distance = function(point) {
  return pointLineSegmentDistance(point, this.coordinates[0], this.coordinates[1]);
}

module.exports = Leaf;
