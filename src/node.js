"use strict";

var pointLineSegmentDistance = require('./point2segment');
var minHeap = require('./heap');

function Node(child0, child1) {
  var e0 = child0.extent,
    e1 = child1.extent;

  this.children = [child0, child1];
  this.extent = [
    [Math.min(e0[0][0], e1[0][0]), Math.min(e0[0][1], e1[0][1])],
    [Math.max(e0[1][0], e1[1][0]), Math.max(e0[1][1], e1[1][1])]
  ];
}

Node.prototype.nearest = function(point) {
  var minNode,
    minDistance = Infinity,
    heap = minHeap(function(a, b) {
      return a.distance - b.distance;
    }),
    node = this,
    distance = node.distance(point),
    candidate = {
      distance: distance,
      node: node
    };

  do {
    node = candidate.node;
    if (node.children) {
      heap.push({
        distance: node.children[0].distance(point),
        node: node.children[0]
      });
      heap.push({
        distance: node.children[1].distance(point),
        node: node.children[1]
      });
    } else {
      distance = node.distance(point);
      if (distance < minDistance) minDistance = distance, minNode = node;
    }

  } while ((candidate = heap.pop()) && (distance = candidate.distance) <= minDistance);

  return minNode;
};

Node.prototype.distance = function(point) {
  var x = point[0],
    y = point[1],
    x0 = this.extent[0][0],
    y0 = this.extent[0][1],
    x1 = this.extent[1][0],
    y1 = this.extent[1][1];
  return x < x0 ? pointLineSegmentDistance(point, [x0, y0], [x0, y1]) : x > x1 ? pointLineSegmentDistance(
    point, [x1, y0], [x1, y1]) : y < y0 ? y0 - y : y > y1 ? y - y1 : 0;
};

module.exports = Node;
