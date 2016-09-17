/**
 * Squared distance
 * @param  {Array.<Number>} a
 * @param  {Array.<Number>} b
 * @return {Number}
 */
function pointDistance(a, b) {
  var dx = a[0] - b[0],
    dy = a[1] - b[1];
  return dx * dx + dy * dy;
}

/**
 * @param  {Array.<Number>} a
 * @param  {Array.<Number>} b
 * @return {Number}
 */
function euclidianDistance(a, b) {
  return Math.sqrt(pointDistance(a, b));
}

/**
 * @param  {Array.<Number>} c The point
 * @param  {Array.<Number>} a Endpoint 1
 * @param  {Array.<Number>} b Endpoint 2
 * @return {Number}
 */
function pointLineSegmentDistance(c, a, b) {
  var dx = b[0] - a[0],
    dy = b[1] - a[1],
    d2 = dx * dx + dy * dy,
    t = d2 && ((c[0] - a[0]) * dx + (c[1] - a[1]) * (b[1] - a[1])) / d2;
  return pointDistance(c, t <= 0 ? a : t >= 1 ? b : [a[0] + t * dx, a[1] + t * dy]);
}

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
    y20 = p2[1] - p0[1],
    t = (x20 * x10 + y20 * y10) / (x10 * x10 + y10 * y10);
  return t < 0 ? 0 : t > 1 ? 1 : t;
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

/**
 * Performs linear interpolation between values a and b. Returns the value
 * between a and b proportional to x (when x is between 0 and 1. When x is
 * outside this range, the return value is a linear extrapolation).
 *
 * @param {Number} a A number.
 * @param {Number} b A number.
 * @param {Number} x The proportion between a and b.
 *
 * @return {Number} The interpolated value between a and b.
 */
function linearInterpolation(a, b, x) {
  return a + x * (b - a);
}

/**
 * @param  {Array.<Number>} start
 * @param  {Array.<Number>} end
 * @param  {Number}         m
 * @param  {Number}         length
 * @return {Array.<Number>}
 */
function pointOnSegment(start, end, m, length) {
  var t = m / length;
  return [
    linearInterpolation(start[0], end[0], t),
    linearInterpolation(start[1], end[1], t)
  ];
}

module.exports = {
  pointSegmentDistance:  pointLineSegmentDistance,
  closestPointOnSegment: closestPointOnSegment,
  pointOnSegment:        pointOnSegment,
  distance:              euclidianDistance
};
