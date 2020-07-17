/**
 * Leaflet LineString selection control
 * @license MIT
 * @author Alexander Milevski <info@w8r.name>
 * @preserve
 */

var L = require('leaflet');

L.Control.LineStringSelect = module.exports = require('./src/select');
L.control.lineStringSelect = function (options) {
  return new L.Control.LineStringSelect(options);
};
