"use strict";

/**
 * @param  {Array.<Number>} p2
 * @param  {Array.<Number>} p0
 * @param  {Array.<Number>} p1
 * @return {Number}
 */
function pointLineSegmentParameter(p2, p0, p1) {
  var x10 = p1[0] - p0[0],
    y10 = p1[1] - p0[1],
    x20 = p2[0] - p0[0],
    y20 = p2[1] - p0[1];
  return (x20 * x10 + y20 * y10) / (x10 * x10 + y10 * y10);
}

/**
 * @param  {Array.<Number>} p2 Point
 * @param  {Array.<Number>} p0 Segment start
 * @param  {Array.<Number>} p1 Segment end
 * @return {Array.<Number>} Closest point/projection
 */
function closestPointOnSegment(p2, p0, p1) {
  var t = pointLineSegmentParameter(p2, p0, p1),
    x10 = p1[0] - p0[0],
    y10 = p1[1] - p0[1],
    p3 = [p0[0] + t * x10, p0[1] + t * y10];
  return p3;
}

module.exports = closestPointOnSegment;
