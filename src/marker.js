var L = require('leaflet');

/**
 * Vector circle marker class with additional hide/show methods
 *
 * @class  Marker
 * @extends {L.CircleMarker}
 */
module.exports = L.CircleMarker.extend( /** @lends Marker.prototype */ {

  /**
   * Show marker
   * @return {Marker}
   */
  show: function () {
    this._container.style.visibility = '';
    return this;
  },

  /**
   * Hide marker
   * @return {Marker}
   */
  hide: function () {
    this._container.style.visibility = 'hidden';
    return this;
  }

});
