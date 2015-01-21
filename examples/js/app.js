// var L = global.L || require('leaflet');
var data = require('../data.json');
var jsonFormat = global.jsonFormat = require('./json-format');
//var Select = require('../../index');
require('./L.TouchExtend');

// this piece here doubles the number of points in geojson
// for (var i = 0, coords = data.geometry.coordinates, len = coords.length - 1; i < len; i += 2) {
//   var c1 = coords[i];
//   var c2 = coords[i + 1];
//   var mid = [(c1[0] + c2[0]) / 2, (c1[1] + c2[1]) / 2];

//   coords.splice(i + 1, 0, mid);
//   len++;
// }
// console.log(JSON.stringify(coords));

L.Icon.Default.imagePath = "http://cdn.leafletjs.com/leaflet-0.7/images";

////////////////////////////////////////////////////////////////////////////////
var map = global.map = new L.Map('map', {}).setView([22.42658, 114.1452], 11);

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution: '&copy; ' +
    '<a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var selectControl = global.control = new L.Control.LineStringSelect({});
map.addControl(selectControl);

var layer = global.layer = L.geoJson(data).addTo(map);
layer = layer.getLayers()[0];

control.enable({
  feature: layer.feature,
  layer: layer
});

////////////////////////////////////////////////////////////////////////////////

document.querySelector('#reset').addEventListener('click', function() {
  control.reset();
  startRange.disabled = true;
  endRange.disabled = true;
});

////////////////////////////////////////////////////////////////////////////////
var length = 0,
  distances = [];
for (var i = 1, len = layer._latlngs.length; i < len; i++) {
  var dist = layer._latlngs[i].distanceTo(layer._latlngs[i - 1]);
  distances.push(dist);
  length += dist;
}

function getDistance(marker) {
  var d = 0;
  for (var i = 0, len = marker.start; i < len; i++) {
    d += distances[i];
  }
  d += marker.getLatLng()
    .distanceTo(layer._latlngs[marker.start]);

  return d;
}

function getStartDistance() {
  return getDistance(control._startMarker);
}

function getEndDistance() {
  return getDistance(control._endMarker);
}

////////////////////////////////////////////////////////////////////////////////

var startRange = document.querySelector('#start-range');
var startM = document.querySelector('#start');

var endRange = document.querySelector('#end-range');
var endM = document.querySelector('#end');

function onStartRangeChange() {
  var meters = parseInt(startRange.value * length);
  if (endRange.value <= startRange.value) {
    endRange.value = startRange.value;
    endM.value = meters;
  }
  start.value = meters;

  control.selectMeters(meters, endM.value);
}

function onEndRangeChange() {
  var meters = parseInt(endRange.value * length);
  if (startRange.value >= endRange.value) {
    startRange.value = endRange.value;
    startM.value = meters;
  }
  end.value = meters;

  control.selectMeters(startM.value, meters);
}

startRange.onchange = startRange.oninput = onStartRangeChange;
endRange.onchange = endRange.oninput = onEndRangeChange;

var textarea = document.querySelector('#geojson');
control.on('select:start', function() {
  var dist = getStartDistance();
  startRange.disabled = false;
  startRange.value = dist / length;
  startM.value = parseInt(dist);
});

control.on('selection', function() {
  var dist1 = getStartDistance();
  var dist2 = getEndDistance();

  //console.log(dist1, startM.value, dist2, endM.value);

  startRange.value = dist1 / length;
  endRange.value = dist2 / length;

  startM.value = Math.round(dist1);
  endM.value = Math.round(dist2);

  endRange.disabled = false;
  textarea.value = jsonFormat(JSON.stringify(control.toGeoJSON()));
});

control.on('reset', function() {
  startRange.value = endRange.value = 0;
  endM.value = startM.value = 0;
  textarea.value = '';
});

global.getStartDistance = getStartDistance;
global.getEndDistance = getEndDistance;
