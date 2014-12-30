var L = global.L || require('leaflet');
var data = require('./data.json');
var Select = require('../index');

L.Icon.Default.imagePath = "http://cdn.leafletjs.com/leaflet-0.7/images";

var map = global.map = new L.Map('map', {}).setView([22.2670, 114.188], 13);

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution: '&copy; ' +
    '<a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var selectControl = global.control = new L.Control.LineStringSelect({});
map.addControl(selectControl);

var layer = global.layer = L.geoJson(data).addTo(map);

control.enable({
  feature: layer.getLayers()[0].feature,
  layer: layer.getLayers()[0]
});
