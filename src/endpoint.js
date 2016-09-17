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
