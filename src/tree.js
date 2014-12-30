"use strict";

var Leaf = require('./leaf');
var Node = require('./node');
var pointLineSegmentDistance = require('./point2segment');

// TODO support quantized, delta-encoded arcs
// TODO group arcs based on connectedness!
var tree = function(points) {
  return group([points].map(function(arc) {
    var i = 0,
      n = arc.length,
      p0,
      p1 = arc[0],
      children = new Array(n - 1);

    while (++i < n) {
      p0 = p1, p1 = arc[i];
      children[i - 1] = new Leaf(p0, p1);
    }

    return group(children);
  }));
};

function group(children) {
  var i0,
    i1,
    n0,
    n1,
    child0,
    child1,
    children1;

  while ((n0 = children.length) > 1) {
    children1 = new Array(n1 = Math.ceil(n0 / 2));

    for (i0 = 0, i1 = 0; i0 < n0 - 1; i0 += 2, i1 += 1) {
      child0 = children[i0];
      child1 = children[i0 + 1];
      children1[i1] = new Node(child0, child1);
    }

    if (i0 < n0) {
      children1[i1] = children[i0];
    }

    children = children1;
  }

  return children[0];
}

module.exports = tree;
