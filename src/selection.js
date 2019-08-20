var L = require('leaflet');

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
    var sourcePoints = this._source._rings[0];
    var originalPoints = sourcePoints.slice(start, end + 1);
    originalPoints.unshift(
      this._map.latLngToLayerPoint(this._latlngs[0])
    );
    originalPoints.push(
      this._map.latLngToLayerPoint(this._latlngs[this._latlngs.length - 1])
    );
    this._rings[0] = originalPoints;
    this._update();
  }

});

module.exports = Selection;
