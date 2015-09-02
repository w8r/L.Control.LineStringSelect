"use strict";

var tape = require('tape');
var L = require('leaflet');
var Select = require('../');
var geometry = require('../src/geometry');

tape('geometry', function(t) {

  t.test('pointSegmentDistance', function(tt) {
    tt.equal(geometry.pointSegmentDistance([0, 0], [100, 100], [12, 12]), 288);
    tt.end();
  });

  t.test('closestPointOnSegment', function(tt) {
    tt.deepEqual(geometry.closestPointOnSegment([0, 0], [100, 100], [12, 12]), [12, 12]);
    tt.deepEqual(geometry.closestPointOnSegment([200, 200], [100, 100], [12, 12]), [100, 100]);
    tt.deepEqual(geometry.closestPointOnSegment([60, 50], [100, 100], [12, 12]), [55, 55]);
    tt.end();
  });

  t.test('euclidianDistance', function(tt) {
    tt.equal(geometry.distance([0, 0], [2, 2]), Math.sqrt(8));
    tt.end();
  });

  t.test('pointOnSegment', function(tt) {
    tt.deepEqual(
      geometry.pointOnSegment([0, 0], [2, 2], 0.5, Math.sqrt(8)), [0.35355339059327373, 0.35355339059327373]
    );
    tt.end();
  });

  t.end();
});
