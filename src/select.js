"use strict";

var L = global.L || require('leaflet');
var ControlMarker = require('./marker');
var Endpoint = require('./endpoint');
var pointOnSegment = require('./point_segment');
var pointSegmentDistance = require('./point2segment')
var rbush = require('rbush');

/**
 * LineString select control
 *
 * @class  L.Control.LineStringSelect
 * @extends {L.Control}
 */
var Select = L.Control.extend( /**  @lends Select.prototype */ {

  /**
   * @type {Object}
   */
  options: {
    startMarkerClass: 'select-marker select-start-marker',
    endMarkerClass: 'select-marker select-end-marker',
    movingMarkerClass: 'select-marker select-moving-marker',
    name: 'leaflet-bookmarks',
    lineWeight: 4,
    lineTolerance: 4,
    position: 'topright' // chose your own if you want
  },

  /**
   * @param  {Object} options
   * @constructor
   */
  initialize: function(options) {

    options = options || {};

    this._startMarker = null;
    this._endMarker = null;
    this._movingMarker = null;
    this._feature = null;
    this._layer = null;
    this._selectedLineString = null;

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

    map.on('moveend zoomend resize', this._calculatePointerTolerance, this);
    this._calculatePointerTolerance();
    return container;
  },

  /**
   * @param  {L.Map} map
   */
  onRemove: function(map) {
    map.off('moveend zoomend resize', this._calculatePointerTolerance, this);
  },

  /**
   * Enable selection mode for line string
   * @param  {Object} options
   */
  enable: function(options) {
    this._feature = options.feature;
    this._layer = options.layer;

    this._createHandles();

    this._buildTree();

    this._layer.on('click', this._onLayerClick, this);
    this._map.on('mousemove', this._onMousemove, this)
      .on('mousedown', this._onMouseDown, this);
  },

  /**
   * Disable selection
   */
  disable: function() {
    this._map.removeLayer(this._startMarker);
    this._map.removeLayer(this._endMarker);
    this._map.removeLayer(this._movingMarker);

    this._layer.off('click', this._onLayerClick, this);
    this._map.off('mousemove', this._onMousemove, this);

    this._feature = null;
    this._layer = null;
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
    var pos = this._map.getCenter();

    this._movingMarker = new ControlMarker(pos, {
      className: this.options.movingMarkerClass,
      fillColor: '#fff',
      fillOpacity: 1,
      weight: 2,
      opacity: 0.5,
      radius: this.options.lineTolerance,
      color: '#000'
    }).addTo(this._map);
    this._movingMarker.on('click', this._onMovingMarkerClick, this);
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
   * @param  {Object} evt
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
   * @param {Object} evt
   */
  _setPoint: function(pos, start, end) {
    if (!this._startMarker) {
      this._startMarker = new Endpoint(pos, {
        className: this.options.startMarkerClass,
        radius: 5,
        color: '#222',
        fillColor: '#fff',
        fillOpacity: 1
      }).addTo(this._map);
      // this._startMarker.on('mouseover', this._movingMarker.hide, this._movingMarker)
      //   .on('mouseout', this._movingMarker.show, this._movingMarker);
      this._startMarker.start = start;
      this._startMarker.end = end;
    } else if (!this._endMarker) {
      this._endMarker = new Endpoint(pos, {
        className: this.options.endMarkerClass,
        radius: 5,
        color: '#222',
        fillColor: '#fff',
        fillOpacity: 1
      }).addTo(this._map);
      // this._endMarker.on('mouseover', this._movingMarker.hide, this._movingMarker)
      //   .on('mouseout', this._movingMarker.show, this._movingMarker);

      this._endMarker.start = start;
      this._endMarker.end = end;

      //this._map.off('mousemove', this._onMousemove, this);
      this._movingMarker.hide();
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
    var target = (evt.originalEvent.target || evt.originalEvent.srcElement);
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
      this._map.dragging.disable();
      this._map.once('mouseup', this._stopHandlerDrag, this);
    }
  },

  /**
   * Clears drag handlers
   * @param  {Object} evt
   */
  _stopHandlerDrag: function(evt) {
    if (this._dragging) {
      global.clearTimeout(this._dragTimer);
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

    var start = this._startMarker.getLatLng();
    var end = this._endMarker.getLatLng();
    var coords = [];

    for (var i = this._startMarker.end, len = this._endMarker.start + 1; i < len; i++) {
      coords.push(this._feature.geometry.coordinates[i].slice().reverse());
    }
    coords.unshift([start.lat, start.lng]);
    coords.push([end.lat, end.lng]);

    //console.log(this._startMarker.end, this._endMarker.start, coords);

    if (!this._selectedLineString) {
      this._selectedLineString = new L.Polyline(coords, {
        color: '#0ff'
      }).addTo(map);
      this._startMarker.bringToFront();
      this._endMarker.bringToFront();
    } else {
      this._selectedLineString.setLatLngs(coords);
    }
  },

  /**
   * Mouse move: follow the path with the moving marker or drag
   *
   * @param  {Object} evt
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
          var dist = pointSegmentDistance(pos, A, B);

          if (dist < d) {
            d = dist;
            start = A;
            end = B;
            startIndex = boxes[i].start;
            endIndex = boxes[i].end;
          }
        }
      }

      pos = pointOnSegment(pos, start, end);
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
