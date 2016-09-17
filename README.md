# L.Control.LineStringSelect [![npm version](https://badge.fury.io/js/leaflet-linestring-select.svg)](https://badge.fury.io/js/leaflet-linestring-select) [![CircleCI](https://circleci.com/gh/w8r/L.Control.LineStringSelect.svg?style=shield)](https://circleci.com/gh/w8r/L.Control.LineStringSelect)

![Screenshot](http://s16.postimg.org/c1f3efm1h/lss.jpg)

LineString selection tool: you can select a part or a stretch of a polyline on the map. Performance-oriented, uses [rbush](https://github.com/mourner/rbush/) for segment lookup

## [Demo](https://w8r.github.io/L.Control.LineStringSelect)

Look how this thing deals with a coastline polyline consisting of ~500 points

[demo](https://w8r.github.io/L.Control.LineStringSelect)

## API

`.enable({layer: polyline, feature: feature})`
Enables control, initializes it with provided polyline. You can pass GeoJSON object as well, otherwise it will be auto-generated

`.disable()`
Disable control, remove handlers and selection

`.reset()`
Reset selection

`.selectMeters(startMeter, endMeter)`
Select stretch by meter distances from linestring start.

`.toGeoJSON()`
Returns selection GeoJSON

`.getSelection()`
Returns array of selection `L.LatLng`s

### Events

`selection`
Selection changed or finished.

`reset`
Selection cleared

`select:start : {pos: <L.LatLng>}`
First point set

`select:end : {pos: <L.LatLng>}`
Second point set

## Usage

```javascript
npm install --save leaflet-linestring-select
...
var Select = require('leaflet-linestring-select');
```

or

```
<script type="text/javascript" src="leaflet.js"></script>
<script type="text/javascript" src="path/to/L.Control.LineStringSelect.min.js"></script>
```

See `/examples/app.js` for initialization and other things


## License

The MIT License (MIT)

Copyright (c) 2015 Alexander Milevski

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
