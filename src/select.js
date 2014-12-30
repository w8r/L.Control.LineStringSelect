"use strict";

var L = global.L || require('leaflet');
var ControlMarker = require('./marker');
var Tree = require('./tree');
var pointOnSegment = require('./point_segment')
var rbush = require('rbush');

/**
 * Bookmarks control
 * @class  L.Control.Bookmarks
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
  onRemove: function(map) {},


  enable: function(options) {
    this._feature = options.feature;
    this._layer = options.layer;

    this._createHandles();

    this._buildTree();

    this._map.on('mousemove', this._onMousemove, this);
  },

  disable: function() {},

  _createHandles: function() {
    var pos = this._map.getCenter();

    this._startMarker = new ControlMarker(pos, {
      className: this.options.startMarkerClass,
      radius: 5,
      fillColor: '#0f0'
    }).addTo(this._map);
    this._endMarker = new ControlMarker(pos, {
      className: this.options.endMarkerClass,
      radius: 5,
      fillColor: '#0f0'
    }).addTo(this._map);
    this._movingMarker = new ControlMarker(pos, {
      className: this.options.movingMarkerClass,
      fillColor: '#fff',
      color: '#000'
    }).addTo(this._map);
  },

  _onMousemove: function(evt) {
    var t = 0.011;
    console.log(this._tree.search([
      evt.latlng.lng + t,
      evt.latlng.lat + t,
      evt.latlng.lng - t,
      evt.latlng.lat - t
    ]));
    1
    return;
    var leaf = this._tree.nearest([evt.latlng.lng, evt.latlng.lat]);
    if (!this._d) {
      this._d = new L.Polyline([
        new L.LatLng(leaf.coordinates[0][1], leaf.coordinates[0][0]),
        new L.LatLng(leaf.coordinates[1][1], leaf.coordinates[1][0])
      ], {
        color: '#f00',
        opacity: 1
      }).addTo(this._map);
    } else {
      this._d.setLatLngs([
        new L.LatLng(leaf.coordinates[0][1], leaf.coordinates[0][0]),
        new L.LatLng(leaf.coordinates[1][1], leaf.coordinates[1][0])
      ]);
    }
    var closest = pointOnSegment([evt.latlng.lng, evt.latlng.lat],
      leaf.coordinates[0], leaf.coordinates[1]);
    this._movingMarker.setLatLng(new L.LatLng(closest[1], closest[0]));
    console.log(leaf);
  },

  _buildTree1: function() {
    this._tree = Tree(this._feature.geometry.coordinates);
  },

  _buildTree: function() {
    this._tree = rbush();
    var coords = this._feature.geometry.coordinates;
    for (var i = 1, len = coords.length; i < len; i++) {
      this._tree.insert(coords[i - 1].concat(coords[i]));
    }
  }



});

module.exports = Select;
