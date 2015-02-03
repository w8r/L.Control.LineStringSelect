!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var n;"undefined"!=typeof window?n=window:"undefined"!=typeof global?n=global:"undefined"!=typeof self&&(n=self);var o=n;o=o.L||(o.L={}),o=o.Control||(o.Control={}),o.LineStringSelect=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
/**
 * Leaflet LineString selection control
 * @license MIT
 * @author Alexander Milevski <info@w8r.name>
 * @preserve
 */

var L = global.L || require('leaflet');

L.Control.LineStringSelect = module.exports = require('./src/select');

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./src/select":6,"leaflet":undefined}],2:[function(require,module,exports){
/*
 (c) 2013, Vladimir Agafonkin
 RBush, a JavaScript library for high-performance 2D spatial indexing of points and rectangles.
 https://github.com/mourner/rbush
*/

(function () { 'use strict';

function rbush(maxEntries, format) {

    // jshint newcap: false, validthis: true
    if (!(this instanceof rbush)) return new rbush(maxEntries, format);

    // max entries in a node is 9 by default; min node fill is 40% for best performance
    this._maxEntries = Math.max(4, maxEntries || 9);
    this._minEntries = Math.max(2, Math.ceil(this._maxEntries * 0.4));

    if (format) {
        this._initFormat(format);
    }

    this.clear();
}

rbush.prototype = {

    all: function () {
        return this._all(this.data, []);
    },

    search: function (bbox) {

        var node = this.data,
            result = [],
            toBBox = this.toBBox;

        if (!intersects(bbox, node.bbox)) return result;

        var nodesToSearch = [],
            i, len, child, childBBox;

        while (node) {
            for (i = 0, len = node.children.length; i < len; i++) {

                child = node.children[i];
                childBBox = node.leaf ? toBBox(child) : child.bbox;

                if (intersects(bbox, childBBox)) {
                    if (node.leaf) result.push(child);
                    else if (contains(bbox, childBBox)) this._all(child, result);
                    else nodesToSearch.push(child);
                }
            }
            node = nodesToSearch.pop();
        }

        return result;
    },

    load: function (data) {
        if (!(data && data.length)) return this;

        if (data.length < this._minEntries) {
            for (var i = 0, len = data.length; i < len; i++) {
                this.insert(data[i]);
            }
            return this;
        }

        // recursively build the tree with the given data from stratch using OMT algorithm
        var node = this._build(data.slice(), 0, data.length - 1, 0);

        if (!this.data.children.length) {
            // save as is if tree is empty
            this.data = node;

        } else if (this.data.height === node.height) {
            // split root if trees have the same height
            this._splitRoot(this.data, node);

        } else {
            if (this.data.height < node.height) {
                // swap trees if inserted one is bigger
                var tmpNode = this.data;
                this.data = node;
                node = tmpNode;
            }

            // insert the small tree into the large tree at appropriate level
            this._insert(node, this.data.height - node.height - 1, true);
        }

        return this;
    },

    insert: function (item) {
        if (item) this._insert(item, this.data.height - 1);
        return this;
    },

    clear: function () {
        this.data = {
            children: [],
            height: 1,
            bbox: empty(),
            leaf: true
        };
        return this;
    },

    remove: function (item) {
        if (!item) return this;

        var node = this.data,
            bbox = this.toBBox(item),
            path = [],
            indexes = [],
            i, parent, index, goingUp;

        // depth-first iterative tree traversal
        while (node || path.length) {

            if (!node) { // go up
                node = path.pop();
                parent = path[path.length - 1];
                i = indexes.pop();
                goingUp = true;
            }

            if (node.leaf) { // check current node
                index = node.children.indexOf(item);

                if (index !== -1) {
                    // item found, remove the item and condense tree upwards
                    node.children.splice(index, 1);
                    path.push(node);
                    this._condense(path);
                    return this;
                }
            }

            if (!goingUp && !node.leaf && contains(node.bbox, bbox)) { // go down
                path.push(node);
                indexes.push(i);
                i = 0;
                parent = node;
                node = node.children[0];

            } else if (parent) { // go right
                i++;
                node = parent.children[i];
                goingUp = false;

            } else node = null; // nothing found
        }

        return this;
    },

    toBBox: function (item) { return item; },

    compareMinX: function (a, b) { return a[0] - b[0]; },
    compareMinY: function (a, b) { return a[1] - b[1]; },

    toJSON: function () { return this.data; },

    fromJSON: function (data) {
        this.data = data;
        return this;
    },

    _all: function (node, result) {
        var nodesToSearch = [];
        while (node) {
            if (node.leaf) result.push.apply(result, node.children);
            else nodesToSearch.push.apply(nodesToSearch, node.children);

            node = nodesToSearch.pop();
        }
        return result;
    },

    _build: function (items, left, right, height) {

        var N = right - left + 1,
            M = this._maxEntries,
            node;

        if (N <= M) {
            // reached leaf level; return leaf
            node = {
                children: items.slice(left, right + 1),
                height: 1,
                bbox: null,
                leaf: true
            };
            calcBBox(node, this.toBBox);
            return node;
        }

        if (!height) {
            // target height of the bulk-loaded tree
            height = Math.ceil(Math.log(N) / Math.log(M));

            // target number of root entries to maximize storage utilization
            M = Math.ceil(N / Math.pow(M, height - 1));
        }

        // TODO eliminate recursion?

        node = {
            children: [],
            height: height,
            bbox: null
        };

        // split the items into M mostly square tiles

        var N2 = Math.ceil(N / M),
            N1 = N2 * Math.ceil(Math.sqrt(M)),
            i, j, right2, right3;

        multiSelect(items, left, right, N1, this.compareMinX);

        for (i = left; i <= right; i += N1) {

            right2 = Math.min(i + N1 - 1, right);

            multiSelect(items, i, right2, N2, this.compareMinY);

            for (j = i; j <= right2; j += N2) {

                right3 = Math.min(j + N2 - 1, right2);

                // pack each entry recursively
                node.children.push(this._build(items, j, right3, height - 1));
            }
        }

        calcBBox(node, this.toBBox);

        return node;
    },

    _chooseSubtree: function (bbox, node, level, path) {

        var i, len, child, targetNode, area, enlargement, minArea, minEnlargement;

        while (true) {
            path.push(node);

            if (node.leaf || path.length - 1 === level) break;

            minArea = minEnlargement = Infinity;

            for (i = 0, len = node.children.length; i < len; i++) {
                child = node.children[i];
                area = bboxArea(child.bbox);
                enlargement = enlargedArea(bbox, child.bbox) - area;

                // choose entry with the least area enlargement
                if (enlargement < minEnlargement) {
                    minEnlargement = enlargement;
                    minArea = area < minArea ? area : minArea;
                    targetNode = child;

                } else if (enlargement === minEnlargement) {
                    // otherwise choose one with the smallest area
                    if (area < minArea) {
                        minArea = area;
                        targetNode = child;
                    }
                }
            }

            node = targetNode;
        }

        return node;
    },

    _insert: function (item, level, isNode) {

        var toBBox = this.toBBox,
            bbox = isNode ? item.bbox : toBBox(item),
            insertPath = [];

        // find the best node for accommodating the item, saving all nodes along the path too
        var node = this._chooseSubtree(bbox, this.data, level, insertPath);

        // put the item into the node
        node.children.push(item);
        extend(node.bbox, bbox);

        // split on node overflow; propagate upwards if necessary
        while (level >= 0) {
            if (insertPath[level].children.length > this._maxEntries) {
                this._split(insertPath, level);
                level--;
            } else break;
        }

        // adjust bboxes along the insertion path
        this._adjustParentBBoxes(bbox, insertPath, level);
    },

    // split overflowed node into two
    _split: function (insertPath, level) {

        var node = insertPath[level],
            M = node.children.length,
            m = this._minEntries;

        this._chooseSplitAxis(node, m, M);

        var newNode = {
            children: node.children.splice(this._chooseSplitIndex(node, m, M)),
            height: node.height
        };

        if (node.leaf) newNode.leaf = true;

        calcBBox(node, this.toBBox);
        calcBBox(newNode, this.toBBox);

        if (level) insertPath[level - 1].children.push(newNode);
        else this._splitRoot(node, newNode);
    },

    _splitRoot: function (node, newNode) {
        // split root node
        this.data = {
            children: [node, newNode],
            height: node.height + 1
        };
        calcBBox(this.data, this.toBBox);
    },

    _chooseSplitIndex: function (node, m, M) {

        var i, bbox1, bbox2, overlap, area, minOverlap, minArea, index;

        minOverlap = minArea = Infinity;

        for (i = m; i <= M - m; i++) {
            bbox1 = distBBox(node, 0, i, this.toBBox);
            bbox2 = distBBox(node, i, M, this.toBBox);

            overlap = intersectionArea(bbox1, bbox2);
            area = bboxArea(bbox1) + bboxArea(bbox2);

            // choose distribution with minimum overlap
            if (overlap < minOverlap) {
                minOverlap = overlap;
                index = i;

                minArea = area < minArea ? area : minArea;

            } else if (overlap === minOverlap) {
                // otherwise choose distribution with minimum area
                if (area < minArea) {
                    minArea = area;
                    index = i;
                }
            }
        }

        return index;
    },

    // sorts node children by the best axis for split
    _chooseSplitAxis: function (node, m, M) {

        var compareMinX = node.leaf ? this.compareMinX : compareNodeMinX,
            compareMinY = node.leaf ? this.compareMinY : compareNodeMinY,
            xMargin = this._allDistMargin(node, m, M, compareMinX),
            yMargin = this._allDistMargin(node, m, M, compareMinY);

        // if total distributions margin value is minimal for x, sort by minX,
        // otherwise it's already sorted by minY
        if (xMargin < yMargin) node.children.sort(compareMinX);
    },

    // total margin of all possible split distributions where each node is at least m full
    _allDistMargin: function (node, m, M, compare) {

        node.children.sort(compare);

        var toBBox = this.toBBox,
            leftBBox = distBBox(node, 0, m, toBBox),
            rightBBox = distBBox(node, M - m, M, toBBox),
            margin = bboxMargin(leftBBox) + bboxMargin(rightBBox),
            i, child;

        for (i = m; i < M - m; i++) {
            child = node.children[i];
            extend(leftBBox, node.leaf ? toBBox(child) : child.bbox);
            margin += bboxMargin(leftBBox);
        }

        for (i = M - m - 1; i >= m; i--) {
            child = node.children[i];
            extend(rightBBox, node.leaf ? toBBox(child) : child.bbox);
            margin += bboxMargin(rightBBox);
        }

        return margin;
    },

    _adjustParentBBoxes: function (bbox, path, level) {
        // adjust bboxes along the given tree path
        for (var i = level; i >= 0; i--) {
            extend(path[i].bbox, bbox);
        }
    },

    _condense: function (path) {
        // go through the path, removing empty nodes and updating bboxes
        for (var i = path.length - 1, siblings; i >= 0; i--) {
            if (path[i].children.length === 0) {
                if (i > 0) {
                    siblings = path[i - 1].children;
                    siblings.splice(siblings.indexOf(path[i]), 1);

                } else this.clear();

            } else calcBBox(path[i], this.toBBox);
        }
    },

    _initFormat: function (format) {
        // data format (minX, minY, maxX, maxY accessors)

        // uses eval-type function compilation instead of just accepting a toBBox function
        // because the algorithms are very sensitive to sorting functions performance,
        // so they should be dead simple and without inner calls

        // jshint evil: true

        var compareArr = ['return a', ' - b', ';'];

        this.compareMinX = new Function('a', 'b', compareArr.join(format[0]));
        this.compareMinY = new Function('a', 'b', compareArr.join(format[1]));

        this.toBBox = new Function('a', 'return [a' + format.join(', a') + '];');
    }
};


// calculate node's bbox from bboxes of its children
function calcBBox(node, toBBox) {
    node.bbox = distBBox(node, 0, node.children.length, toBBox);
}

// min bounding rectangle of node children from k to p-1
function distBBox(node, k, p, toBBox) {
    var bbox = empty();

    for (var i = k, child; i < p; i++) {
        child = node.children[i];
        extend(bbox, node.leaf ? toBBox(child) : child.bbox);
    }

    return bbox;
}

function empty() { return [Infinity, Infinity, -Infinity, -Infinity]; }

function extend(a, b) {
    a[0] = Math.min(a[0], b[0]);
    a[1] = Math.min(a[1], b[1]);
    a[2] = Math.max(a[2], b[2]);
    a[3] = Math.max(a[3], b[3]);
    return a;
}

function compareNodeMinX(a, b) { return a.bbox[0] - b.bbox[0]; }
function compareNodeMinY(a, b) { return a.bbox[1] - b.bbox[1]; }

function bboxArea(a)   { return (a[2] - a[0]) * (a[3] - a[1]); }
function bboxMargin(a) { return (a[2] - a[0]) + (a[3] - a[1]); }

function enlargedArea(a, b) {
    return (Math.max(b[2], a[2]) - Math.min(b[0], a[0])) *
           (Math.max(b[3], a[3]) - Math.min(b[1], a[1]));
}

function intersectionArea (a, b) {
    var minX = Math.max(a[0], b[0]),
        minY = Math.max(a[1], b[1]),
        maxX = Math.min(a[2], b[2]),
        maxY = Math.min(a[3], b[3]);

    return Math.max(0, maxX - minX) *
           Math.max(0, maxY - minY);
}

function contains(a, b) {
    return a[0] <= b[0] &&
           a[1] <= b[1] &&
           b[2] <= a[2] &&
           b[3] <= a[3];
}

function intersects (a, b) {
    return b[0] <= a[2] &&
           b[1] <= a[3] &&
           b[2] >= a[0] &&
           b[3] >= a[1];
}

// sort an array so that items come in groups of n unsorted items, with groups sorted between each other;
// combines selection algorithm with binary divide & conquer approach

function multiSelect(arr, left, right, n, compare) {
    var stack = [left, right],
        mid;

    while (stack.length) {
        right = stack.pop();
        left = stack.pop();

        if (right - left <= n) continue;

        mid = left + Math.ceil((right - left) / n / 2) * n;
        select(arr, left, right, mid, compare);

        stack.push(left, mid, mid, right);
    }
}

// sort array between left and right (inclusive) so that the smallest k elements come first (unordered)
function select(arr, left, right, k, compare) {
    var n, i, z, s, sd, newLeft, newRight, t, j;

    while (right > left) {
        if (right - left > 600) {
            n = right - left + 1;
            i = k - left + 1;
            z = Math.log(n);
            s = 0.5 * Math.exp(2 * z / 3);
            sd = 0.5 * Math.sqrt(z * s * (n - s) / n) * (i - n / 2 < 0 ? -1 : 1);
            newLeft = Math.max(left, Math.floor(k - i * s / n + sd));
            newRight = Math.min(right, Math.floor(k + (n - i) * s / n + sd));
            select(arr, newLeft, newRight, k, compare);
        }

        t = arr[k];
        i = left;
        j = right;

        swap(arr, left, k);
        if (compare(arr[right], t) > 0) swap(arr, left, right);

        while (i < j) {
            swap(arr, i, j);
            i++;
            j--;
            while (compare(arr[i], t) < 0) i++;
            while (compare(arr[j], t) > 0) j--;
        }

        if (compare(arr[left], t) === 0) swap(arr, left, j);
        else {
            j++;
            swap(arr, j, right);
        }

        if (j <= k) left = j + 1;
        if (k <= j) right = j - 1;
    }
}

function swap(arr, i, j) {
    var tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
}


// export as AMD/CommonJS module or global variable
if (typeof define === 'function' && define.amd) define(function() { return rbush; });
else if (typeof module !== 'undefined') module.exports = rbush;
else if (typeof self !== 'undefined') self.rbush = rbush;
else window.rbush = rbush;

})();

},{}],3:[function(require,module,exports){
"use strict";

var Marker = require('./marker');

/**
 * Selection endpoint
 *
 * @class  EndPoint
 * @extends {Marker}
 */
var Endpoint = Marker.extend( /** @lends Endpoint.prototype */ {

  /**
   * @type {Object}
   */
  options: {
    /**
     * Grow marker by this ratio on mouseover
     * @type {Number}
     */
    radiusRatio: 1.2
  },

  /**
   * @param  {L.Map} map
   */
  onAdd: function(map) {
    this.on('mouseover', this._onMouseOver, this)
      .on('mouseout', this._onMouseOut, this);
    Marker.prototype.onAdd.call(this, map);
  },

  /**
   * @param  {L.Map} map
   */
  onRemove: function(map) {
    this.off('mouseover', this._onMouseOver, this)
      .off('mouseout', this._onMouseOut, this);
    Marker.prototype.onRemove.call(this, map);
  },

  /**
   * Grow radius
   */
  _onMouseOver: function() {
    this.setRadius(this.options.radius * this.options.radiusRatio);
  },

  /**
   * Set radius back
   */
  _onMouseOut: function() {
    this.setRadius(this.options.radius / this.options.radiusRatio);
  }

});

module.exports = Endpoint;

},{"./marker":5}],4:[function(require,module,exports){
"use strict";

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
  pointSegmentDistance: pointLineSegmentDistance,
  closestPointOnSegment: closestPointOnSegment,
  pointOnSegment: pointOnSegment,
  distance: euclidianDistance
};

},{}],5:[function(require,module,exports){
(function (global){
"use strict";

var L = global.L || require('leaflet');

/**
 * Vector circle marker class with additional hide/show methods
 *
 * @class  Marker
 * @extends {L.CircleMarker}
 */
var Marker = L.CircleMarker.extend( /** @lends Marker.prototype */ {

  /**
   * Show marker
   * @return {Marker}
   */
  show: function() {
    this._container.style.visibility = '';
    return this;
  },

  /**
   * Hide marker
   * @return {Marker}
   */
  hide: function() {
    this._container.style.visibility = 'hidden';
    return this;
  }

});

module.exports = Marker;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"leaflet":undefined}],6:[function(require,module,exports){
(function (global){
"use strict";

var L = global.L || require('leaflet');
var geometry = require('./geometry');
var ControlMarker = require('./marker');
var Endpoint = require('./endpoint');
var Selection = require('./selection');
var rbush = global.rbush || require('rbush');

/**
 * LineString select control
 *
 * @class  L.Control.LineStringSelect
 * @extends {L.Control}
 */
var Select = L.Control.extend( /**  @lends Select.prototype */ {

  includes: L.Mixin.Events,

  statics: {
    Selection: Selection,
    Endpoint: Endpoint,
    ControlMarker: ControlMarker
  },

  /**
   * @type {Object}
   */
  options: {
    startMarkerClass: 'select-marker select-start-marker',
    endMarkerClass: 'select-marker select-end-marker',
    movingMarkerClass: 'select-marker select-moving-marker',
    name: 'leaflet-linestring-select',
    lineWeight: 4,
    lineTolerance: L.Browser.touch ? 10 : 5,

    // moving(sliding) marker
    movingMarkerStyle: {
      fillColor: '#fff',
      fillOpacity: 1,
      weight: 2,
      opacity: 0.5,
      color: '#000'
    },

    // endpoint
    endpointStyle: {
      radius: 5,
      color: '#111',
      fillColor: '#fff',
      fillOpacity: 1
    },

    selectionStyle: {
      color: '#0ff',
      opacity: 1
    },

    useTouch: L.Browser.touch,

    position: 'topright' // chose your own if you want
  },

  /**
   * @param  {Object} options
   * @constructor
   */
  initialize: function(options) {

    options = options || {};

    /**
     * @type {Endpoint}
     */
    this._startMarker = null;

    /**
     * @type {Endpoint}
     */
    this._endMarker = null;

    /**
     * @type {Marker}
     */
    this._movingMarker = null;

    /**
     * @type {Object}
     */
    this._feature = null;

    /**
     * @type {L.Polyline}
     */
    this._layer = null;

    /**
     * @type {Selection}
     */
    this._selection = null;

    /**
     * Mouse pointer tolerance
     * @type {L.LatLng}
     */
    this._tolerance = null;

    L.Util.setOptions(this, options);
    L.Control.prototype.initialize.call(this, this.options);
  },

  /**
   * @param {L.Map} map
   */
  onAdd: function(map) {
    var container = this._container = L.DomUtil.create('div',
      this.options.containerClass
    );
    L.DomEvent
      .disableClickPropagation(container)
      .disableScrollPropagation(container);

    return container;
  },

  /**
   * @param  {L.Map} map
   */
  onRemove: function(map) {
    this.disable();
  },

  /**
   * Enable selection mode for line string
   * @param  {Object}     options
   * @param  {L.Polyline} options.layer
   * @param  {Object}     options.feature
   * @return {Select}
   */
  enable: function(options) {
    this._layer = options['layer'];
    this._feature = options['feature'] || options['layer'].toGeoJSON();

    this._createHandles();

    this._buildTree();

    this._layer.on('click', this._onLayerClick, this);

    this._map.on('moveend zoomend resize', this._calculatePointerTolerance, this)
      .on('mousemove touchmove', this._onMousemove, this)
      .on(L.Draggable.START.join(' '), this._onMouseDown, this)
      .on('click contextmenu', this._onMapClick, this);

    this._calculatePointerTolerance();

    return this;
  },

  /**
   * Disable selection
   * @return {Select}
   */
  disable: function() {
    this.reset();

    this._map.removeLayer(this._movingMarker);
    this._movingMarker = null;

    this._layer.off('click', this._onLayerClick, this);

    this._map.off('moveend zoomend resize', this._calculatePointerTolerance, this)
      .off('mousemove touchmove', this._onMousemove, this)
      .off(L.Draggable.START.join(' '), this._onMouseDown, this)
      .off('click contextmenu', this._onMapClick, this);

    this._feature = null;
    this._layer = null;

    return this;
  },

  /**
   * Reset selection
   * @return {Select}
   */
  reset: function() {
    if (this._startMarker) {
      this._map.removeLayer(this._startMarker);
      this._startMarker = null;
    }

    if (this._endMarker) {
      this._map.removeLayer(this._endMarker);
      this._endMarker = null;
    }

    if (this._selection) {
      this._map.removeLayer(this._selection);
      this._selection = null;
    }

    this._movingMarker.setLatLng(this._layer.getLatLngs()[0]);
    if (!this.options.useTouch) {
      this._movingMarker.show();
    }

    this.fire('reset');

    return this;
  },

  /**
   * Selection latlngs
   * @return {Array.<L.LatLng>}
   */
  getSelection: function() {
    if (this._selection) {
      return this._selection.getLatLngs();
    }
    return null;
  },

  /**
   * Selection geoJSON
   * @return {Object|Null}
   */
  toGeoJSON: function() {
    if (this._selection) {
      return this._selection.toGeoJSON();
    }
    return null;
  },

  /**
   * Select from one meter point to another
   * @param  {Number} startM
   * @param  {Number} endM
   * @return {Select}
   */
  selectMeters: function(startM, endM) {
    this.reset();

    if (startM < 0 || endM < 0) {
      throw new Error("Can't use negative meter values for distance selection");
    }

    var start = this._pointAtM(startM);
    var end = this._pointAtM(endM);

    start = this._getNearestPoint(start);
    end = this._getNearestPoint(end);

    this._setPoint(start, start.start, start.end);
    this._setPoint(end, end.start, end.end);
    return this;
  },

  /**
   * Replace this method if you want to subclass moving marker
   * @param  {L.LatLng} pos
   * @param  {Object}   style
   * @return {L.Control.LineStringSelect.ControlMarker}
   */
  movingMarkerFactory: function(pos, style) {
    return new ControlMarker(pos, style);
  },

  /**
   * Replace this method if you want to subclass endpoint marker
   * @param  {L.LatLng} pos
   * @param  {Object}   style
   * @param  {Boolean}  isEnd
   * @return {L.Control.LineStringSelect.Endpoint}
   */
  endpointFactory: function(pos, style, isEnd) {
    return new Endpoint(pos, style);
  },

  /**
   * Craetes a selection polyline. Replace or extend if you want
   * to subclass selection polyline
   * @param  {Array.<L.LatLng>} coords
   * @param  {Object}           style
   * @param  {L.Polyline}       layer
   * @return {L.Control.LineStringSelect.Selection}
   */
  selectionFactory: function(coords, style, layer) {
    return new Selection(coords, style, layer);
  },

  /**
   * Calculate distance in meters from one point to another
   *
   * @param  {Array.<Number>} A
   * @param  {Array.<Number>} B
   * @return {Number}
   */
  _distance: function(A, B) {
    if (this.options.distance) {
      return this.options.distance(A, B);
    } else {
      return new L.LatLng(A[1], A[0]).distanceTo(new L.LatLng(B[1], B[0]));
    }
  },

  /**
   * Projected point from GeoJSON
   *
   * @param  {Array.<Number>} coord
   * @return {Array.<Number>}
   */
  _getProjectedPoint: function(coord) {
    if (this.options.getProjectedPoint) {
      return this.options.getProjectedPoint.call(this, coord);
    }
    coord = this._map.options.crs.latLngToPoint(new L.LatLng(coord[1], coord[0]), this._map.getMaxZoom());
    return [coord.x, coord.y];
  },

  /**
   * Point on segment, `m` meters from the start
   * @param  {Array.<Number>} start
   * @param  {Array.<Number>} end
   * @param  {Number}         m
   * @return {Array.<Number>}
   */
  _pointAtSegmentM: function(start, end, m) {
    var length = this._distance(start, end);

    start = this._getProjectedPoint(start);
    end = this._getProjectedPoint(end);

    var coords = geometry.pointOnSegment(start, end, m, length);
    return L.point(coords);
  },

  /**
   * Point at `m` mark on the linestring
   * @param  {Number} m
   * @return {L.LatLng}
   */
  _pointAtM: function(m) {
    var coords = this._feature.geometry.coordinates;
    var dist = 0;
    var point;

    for (var i = 1, len = coords.length; i < len; i++) {
      var segmentLength = this._distance(coords[i - 1], coords[i]);
      if (dist + segmentLength <= m) {
        dist += segmentLength;
      } else {
        break;
      }
    }

    if (dist === m || i === coords.length) {
      point = coords[i - 1];
      return new L.LatLng(point[1], point[0]);
    }

    point = this._pointAtSegmentM(coords[i - 1], coords[i], m - dist);
    return this._map.options.crs.pointToLatLng(point, this._map.getMaxZoom());
  },

  /**
   * Calculates buffer zone around pointer.
   * If map state changes it has to be recalculated in order
   * to maintain precision
   */
  _calculatePointerTolerance: function() {
    var center = this._map.getCenter();
    var shift = this.options.lineWeight * 0.5 + this.options.lineTolerance;
    var shifted = this._map.layerPointToLatLng(
      this._map.latLngToLayerPoint(center)
      .add(new L.Point(shift, shift)));

    this._tolerance = new L.LatLng(
      Math.abs(center.lat - shifted.lat),
      Math.abs(center.lng - shifted.lng)
    );
  },

  /**
   * Control handles
   */
  _createHandles: function() {
    var pos = L.latLng(this._layer._latlngs[0]);
    var style = this.options.movingMarkerStyle;

    style.radius = this.options.lineTolerance;
    style.className = this.options.movingMarkerClass;

    this._movingMarker = this.movingMarkerFactory(pos, style).addTo(this._map);
    this._movingMarker.on('click', this._onMovingMarkerClick, this);

    if (this.options.useTouch) {
      this._movingMarker.hide();
    }
  },

  /**
   * @param  {Object} evt
   */
  _onMovingMarkerClick: function(evt) {
    this._setPoint(this._movingMarker.getLatLng(),
      this._movingMarker.start,
      this._movingMarker.end);
  },

  /**
   * No moving marker on touch device
   * @param  {L.MouseEvent}   evt
   */
  _onLayerClick: function(evt) {
    var coords = this._getNearestPoint(evt.latlng);
    if (coords) {
      this._setPoint(L.latLng(coords), coords.start, coords.end);
    } else {
      this._setPoint(evt.latlng);
    }
  },

  /**
   * Map clicked, if near the moving point - set endpoint
   * @param  {L.MouseEvent} evt
   */
  _onMapClick: function(evt) {
    if (!this._endMarker) {
      var pos = this._map.latLngToLayerPoint(evt.latlng);
      var coords = this._movingMarker.getLatLng();

      if (this.options.useTouch) { // no mousemove, try and moving morker here
        var nearest = this._getNearestPoint(evt.latlng);
        if (nearest) {
          coords = L.latLng(nearest)
          this._movingMarker.setLatLng(coords);
        }
      }

      var mPos = this._map.latLngToLayerPoint(coords);
      var distance = geometry.distance([pos.x, pos.y], [mPos.x, mPos.y]);

      if (distance <= this.options.lineTolerance * 2) {
        coords = this._getNearestPoint(coords);
        this._setPoint(coords, coords.start, coords.end);
      }
    }
  },

  /**
   * @param {Object} evt
   */
  _setPoint: function(pos, start, end) {
    var style = this.options.endpointStyle;
    if (!this._startMarker) {
      style.className = this.options.startMarkerClass;

      this._startMarker = this.endpointFactory(pos, style, false).addTo(this._map);
      // this._startMarker.on('mouseover', this._movingMarker.hide, this._movingMarker)
      //   .on('mouseout', this._movingMarker.show, this._movingMarker);
      this._startMarker.start = start;
      this._startMarker.end = end;

      this.fire('select:start', {
        latlng: pos
      });
    } else if (!this._endMarker) {
      style.className = this.options.endMarkerClass;
      this._endMarker = this.endpointFactory(pos, style, true).addTo(this._map);
      // this._endMarker.on('mouseover', this._movingMarker.hide, this._movingMarker)
      //   .on('mouseout', this._movingMarker.show, this._movingMarker);

      this._endMarker.start = start;
      this._endMarker.end = end;

      //this._map.off('mousemove', this._onMousemove, this);
      this._movingMarker.hide();
      this.fire('select:end', {
        latlng: pos
      });
      this._onSelect();
    }
  },

  /**
   * Mouse pointer bounds
   * @param  {L.LatLng} latlng
   * @return {Array.<Array.<Number>>}
   */
  _getPointerBounds: function(latlng) {
    var tx = this._tolerance.lng,
      ty = this._tolerance.lat;

    return [
      [latlng.lat - ty, latlng.lng - tx],
      [latlng.lat + ty, latlng.lng + tx]
    ];
  },

  /**
   * Check if user tries to drag a handle
   * @param  {Object} evt
   */
  _onMouseDown: function(evt) {
    var target = (evt['originalEvent'].target || evt['originalEvent'].srcElement);

    if (this.options.useTouch) {
      var point;
      if (this._startMarker) {
        point = this._map.latLngToContainerPoint(this._startMarker.getLatLng());
        if (geometry.distance(
            [evt.containerPoint.x, evt.containerPoint.y], [point.x, point.y]
          ) <= this.options.lineTolerance * 2) {
          //this._startMarker._onMouseOver();
          target = this._startMarker._path;
        }
      }
      if (this._endMarker) {
        point = this._map.latLngToContainerPoint(this._endMarker.getLatLng());
        if (geometry.distance(
            [evt.containerPoint.x, evt.containerPoint.y], [point.x, point.y]
          ) <= this.options.lineTolerance * 2) {
          //this._endMarker._onMouseOver();
          target = this._endMarker._path;
        }
      }
    }

    if (this._startMarker && this._startMarker._path === target) {
      this._dragging = this._startMarker;
      this._static = this._endMarker;
    } else if (this._endMarker && this._endMarker._path === target) {
      this._dragging = this._endMarker;
      this._static = this._startMarker;
    }

    if (this._dragging) {
      L.DomEvent.stop(evt);
      this._dragging._dragging = true;

      L.Draggable._disabled = true;
      this._map.dragging.disable();

      this._map.once('mouseup', this._stopHandlerDrag, this);
    }
  },

  /**
   * Clears drag handlers
   * @param  {L.MouseEvent} evt
   */
  _stopHandlerDrag: function(evt) {
    if (this._dragging) {
      global.clearTimeout(this._dragTimer);

      L.Draggable._disabled = false;
      this._map.dragging.enable();

      this._dragging._dragging = null;
      this._dragging = null;
      this._onDragStopped(this._dragging, evt.latlng);
    }
  },

  /**
   * @param  {Endpoint} handle
   * @param  {L.LatLng} coords
   */
  _onDragStopped: function(handle, coords) {
    this._onSelect();
  },

  /**
   * Ensures that the startpoint would be before endpoint
   */
  _checkEndPoints: function() {
    if (this._startMarker.start > this._endMarker.start) {
      var swap = this._startMarker;
      this._startMarker = this._endMarker;
      this._endMarker = swap;
    }
  },

  /**
   * Selection event, show selected polyline
   */
  _onSelect: function() {
    this._checkEndPoints();

    var start = this._startMarker.end;
    var end = this._endMarker.start;
    var coords = this._layer._latlngs.slice(start, end + 1);

    coords.unshift(this._startMarker.getLatLng());
    coords.push(this._endMarker.getLatLng());

    if (!this._selection) {
      this._selection = this.selectionFactory(
        coords,
        this.options.selectionStyle,
        this._layer
      ).addTo(this._map);

      // markers should be above the selection
      this._startMarker.bringToFront();
      this._endMarker.bringToFront();
    } else {
      this._selection._latlngs = coords;
      this._selection.updatePathFromSource(
        this._startMarker.end,
        this._endMarker.start
      );
    }
    this.fire('selection');
  },

  /**
   * Mouse move: follow the path with the moving marker or drag
   *
   * @param  {L.MouseEvent} evt
   */
  _onMousemove: function(evt) {
    var coords = this._getNearestPoint(evt.latlng);
    if (this._dragging) {
      if (coords) {
        this._dragging.start = coords.start;
        this._dragging.end = coords.end;
        this._dragging.setLatLng(coords);
      }
      if (this._startMarker && this._endMarker) {
        this._onSelect();
      }
      global.clearTimeout(this._dragTimer);
      this._dragTimer = global.setTimeout(this._stopHandlerDrag.bind(this, evt), 750);
    } else {
      if (coords) {
        this._movingMarker.setLatLng(coords);
        this._movingMarker.start = coords.start;
        this._movingMarker.end = coords.end;
      }
    }
  },

  /**
   * Fin nearest point on the line string.
   * 1. search RTree of segments
   * 2. calculate nearest segment
   * 3. , then the point on it
   *
   * @param  {L.LatLng} latlng
   * @param  {L.LatLng} tolerance
   * @return {Array.<Number>}
   */
  _getNearestPoint: function(latlng, tolerance) {
    var coords = this._getPointerBounds(latlng, tolerance);
    var map = this._map;

    ////// visual debug
    // if (!this._m) {
    //   this._m = new L.Rectangle(coords, {
    //     weight: 2,
    //     fillOpacity: 0
    //   }).addTo(this._map);
    //   this._m.bringToBack();
    // } else {
    //   this._m.setBounds(coords);
    // }
    ////// visual debug

    var boxes = this._tree.search(
      this._toTreeNode(coords[0].reverse(), coords[1].reverse())
    );

    if (boxes.length !== 0) {
      var fcoords = this._feature.geometry.coordinates;
      var d = Number.MAX_VALUE;
      var pos = [latlng.lng, latlng.lat];
      var startIndex = boxes[0].start;
      var endIndex = boxes[0].end;
      var start = fcoords[startIndex];
      var end = fcoords[endIndex];

      if (boxes.length > 1) { // avoid distance calculation
        for (var i = 0, len = boxes.length; i < len; i++) {
          var box = boxes[i];
          var A = fcoords[boxes[i].start];
          var B = fcoords[boxes[i].end];
          var dist = geometry.pointSegmentDistance(pos, A, B);

          if (dist < d) {
            d = dist;
            start = A;
            end = B;
            startIndex = boxes[i].start;
            endIndex = boxes[i].end;
          }
        }
      }

      pos = geometry.closestPointOnSegment(pos, start, end);
      pos = [pos[1], pos[0]];
      pos.start = startIndex;
      pos.end = endIndex;

      return pos;
    } else {
      return null;
    }
  },

  /**
   * Builds R-Tree for the feature
   */
  _buildTree: function() {
    var coords = this._feature.geometry.coordinates,
      data = [];

    if (this._tree) {
      this._tree.clear();
    } else {
      this._tree = rbush();
    }

    for (var i = 1, len = coords.length; i < len; i++) {
      var obj = this._toTreeNode(coords[i - 1], coords[i]);
      obj.start = i - 1;
      obj.end = i;
      data.push(obj);
    }
    this._tree.load(data);
  },

  /**
   * Two points to BBOX node for RBush
   *
   * @param  {Array.<Number>} a
   * @param  {Array.<Number>} b
   * @return {Array.<Number>}
   */
  _toTreeNode: function(a, b) {
    var xmin = a[0],
      xmax = b[0],
      ymin = a[1],
      ymax = b[1];

    if (xmin > xmax) {
      xmax = a[0];
      xmin = b[0];
    }

    if (ymin > ymax) {
      ymax = a[1];
      ymin = b[1];
    }

    return [xmin, ymin, xmax, ymax];
  }

});

module.exports = Select;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./endpoint":3,"./geometry":4,"./marker":5,"./selection":7,"leaflet":undefined,"rbush":2}],7:[function(require,module,exports){
(function (global){
"use strict";

var L = global.L || require('leaflet');

/**
 * Selection polyline
 * @class  Selection
 * @extends {L.Polyline}
 */
var Selection = L.Polyline.extend( /** @lends Selection.prototype */ {

  /**
   * @param  {Array.<L.LatLng>} latlngs
   * @param  {Object}           options
   * @param  {L.Polyline}       source
   * @constructor
   */
  initialize: function(latlngs, options, source) {

    /**
     * @type {L.Polyline}
     */
    this._source = source;

    L.Polyline.prototype.initialize.call(this, latlngs, options);
  },

  /**
   * Updates path from the source path string, avoid re-projections
   * 1. get the path chunk from the source, put it all together
   * 2. get the endpoints from latlng array
   * 3. update path
   *
   * @param  {Number} start
   * @param  {Number} end
   */
  updatePathFromSource: function(start, end) {
    this._originalPoints = this._source._originalPoints.slice(start, end + 1);
    this._originalPoints.unshift(
      this._map.latLngToLayerPoint(this._latlngs[0])
    );
    this._originalPoints.push(
      this._map.latLngToLayerPoint(this._latlngs[this._latlngs.length - 1])
    );
    this._updatePath();
  }

});

module.exports = Selection;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"leaflet":undefined}]},{},[1])(1)
});