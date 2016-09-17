/**
 * Externs file for google closure compiler
 */

// this makes GCC play with browserify

/**
 * @param {*=}o
 * @param {*=}u
 */
window.require = function(o, u) {};

/**
 * @type {Object}
 */
window.module = {
  exports: {}
};

var L = {
  'version': {},
  'noConflict': function() {},
  'Util': {
    'extend': function() {},
    'bind': function() {},
    'stamp': function() {},
    'invokeEach': function() {},
    'limitExecByInterval': function() {},
    'falseFn': function() {},
    'formatNum': function() {},
    'trim': function() {},
    'splitWords': function() {},
    'setOptions': function() {},
    'getParamString': function() {},
    'template': function() {},
    'isArray': function() {},
    'emptyImageUrl': {},
    'requestAnimFrame': function() {},
    'cancelAnimFrame': function() {}
  },
  'extend': function() {},
  'bind': function() {},
  'stamp': function() {},
  'setOptions': function() {},
  'Class': function() {},
  'Mixin': {
    'Events': {
      'addEventListener': function() {},
      'hasEventListeners': function() {},
      'removeEventListener': function() {},
      'clearAllEventListeners': function() {},
      'fireEvent': function() {},
      'addOneTimeEventListener': function() {},
      'on': function() {},
      'off': function() {},
      'once': function() {},
      'fire': function() {}
    }
  },
  'Browser': {
    'ie': {},
    'ielt9': {},
    'webkit': {},
    'gecko': {},
    'android': {},
    'android23': {},
    'chrome': {},
    'ie3d': {},
    'webkit3d': {},
    'gecko3d': {},
    'opera3d': {},
    'any3d': {},
    'mobile': {},
    'mobileWebkit': {},
    'mobileWebkit3d': {},
    'mobileOpera': {},
    'touch': {},
    'msPointer': {},
    'pointer': {},
    'retina': {},
    'svg': {},
    'vml': {},
    'canvas': {}
  },
  'Point': function() {},
  'point': function() {},
  'Bounds': function() {},
  'bounds': function() {},
  'Transformation': function() {},
  'DomUtil': {
    'get': function() {},
    'getStyle': function() {},
    'getViewportOffset': function() {},
    'documentIsLtr': function() {},
    'create': function() {},
    'hasClass': function() {},
    'addClass': function() {},
    'removeClass': function() {},
    '_setClass': function() {},
    '_getClass': function() {},
    'setOpacity': function() {},
    'testProp': function() {},
    'getTranslateString': function() {},
    'getScaleString': function() {},
    'setPosition': function() {},
    'getPosition': function() {},
    'TRANSFORM': {},
    'TRANSITION': {},
    'TRANSITION_END': {},
    'disableTextSelection': function() {},
    'enableTextSelection': function() {},
    'disableImageDrag': function() {},
    'enableImageDrag': function() {}
  },
  'LatLng': function() {},
  'latLng': function() {},
  'LatLngBounds': function() {},
  'latLngBounds': function() {},
  'Projection': {
    'SphericalMercator': {
      'MAX_LATITUDE': {},
      'project': function() {},
      'unproject': function() {}
    },
    'LonLat': {
      'project': function() {},
      'unproject': function() {}
    },
    'Mercator': {
      'MAX_LATITUDE': {},
      'R_MINOR': {},
      'R_MAJOR': {},
      'project': function() {},
      'unproject': function() {}
    }
  },
  'CRS': {
    'latLngToPoint': function() {},
    'pointToLatLng': function() {},
    'project': function() {},
    'scale': function() {},
    'getSize': function() {},
    'Simple': {
      'latLngToPoint': function() {},
      'pointToLatLng': function() {},
      'project': function() {},
      'scale': function() {},
      'getSize': function() {},
      'projection': {
        'project': function() {},
        'unproject': function() {}
      },
      'transformation': {
        '_a': {},
        '_b': {},
        '_c': {},
        '_d': {},
        'transform': function() {},
        '_transform': function() {},
        'untransform': function() {}
      }
    },
    'EPSG3857': {
      'latLngToPoint': function() {},
      'pointToLatLng': function() {},
      'project': function() {},
      'scale': function() {},
      'getSize': function() {},
      'Simple': {
        'latLngToPoint': function() {},
        'pointToLatLng': function() {},
        'project': function() {},
        'scale': function() {},
        'getSize': function() {},
        'projection': {
          'project': function() {},
          'unproject': function() {}
        },
        'transformation': {
          '_a': {},
          '_b': {},
          '_c': {},
          '_d': {},
          'transform': function() {},
          '_transform': function() {},
          'untransform': function() {}
        }
      },
      'code': {},
      'projection': {
        'MAX_LATITUDE': {},
        'project': function() {},
        'unproject': function() {}
      },
      'transformation': {
        '_a': {},
        '_b': {},
        '_c': {},
        '_d': {},
        'transform': function() {},
        '_transform': function() {},
        'untransform': function() {}
      }
    },
    'EPSG900913': {
      'latLngToPoint': function() {},
      'pointToLatLng': function() {},
      'project': function() {},
      'scale': function() {},
      'getSize': function() {},
      'Simple': {
        'latLngToPoint': function() {},
        'pointToLatLng': function() {},
        'project': function() {},
        'scale': function() {},
        'getSize': function() {},
        'projection': {
          'project': function() {},
          'unproject': function() {}
        },
        'transformation': {
          '_a': {},
          '_b': {},
          '_c': {},
          '_d': {},
          'transform': function() {},
          '_transform': function() {},
          'untransform': function() {}
        }
      },
      'code': {},
      'projection': {
        'MAX_LATITUDE': {},
        'project': function() {},
        'unproject': function() {}
      },
      'transformation': {
        '_a': {},
        '_b': {},
        '_c': {},
        '_d': {},
        'transform': function() {},
        '_transform': function() {},
        'untransform': function() {}
      }
    },
    'EPSG4326': {
      'latLngToPoint': function() {},
      'pointToLatLng': function() {},
      'project': function() {},
      'scale': function() {},
      'getSize': function() {},
      'Simple': {
        'latLngToPoint': function() {},
        'pointToLatLng': function() {},
        'project': function() {},
        'scale': function() {},
        'getSize': function() {},
        'projection': {
          'project': function() {},
          'unproject': function() {}
        },
        'transformation': {
          '_a': {},
          '_b': {},
          '_c': {},
          '_d': {},
          'transform': function() {},
          '_transform': function() {},
          'untransform': function() {}
        }
      },
      'EPSG3857': {
        'latLngToPoint': function() {},
        'pointToLatLng': function() {},
        'project': function() {},
        'scale': function() {},
        'getSize': function() {},
        'Simple': {
          'latLngToPoint': function() {},
          'pointToLatLng': function() {},
          'project': function() {},
          'scale': function() {},
          'getSize': function() {},
          'projection': {
            'project': function() {},
            'unproject': function() {}
          },
          'transformation': {
            '_a': {},
            '_b': {},
            '_c': {},
            '_d': {},
            'transform': function() {},
            '_transform': function() {},
            'untransform': function() {}
          }
        },
        'code': {},
        'projection': {
          'MAX_LATITUDE': {},
          'project': function() {},
          'unproject': function() {}
        },
        'transformation': {
          '_a': {},
          '_b': {},
          '_c': {},
          '_d': {},
          'transform': function() {},
          '_transform': function() {},
          'untransform': function() {}
        }
      },
      'EPSG900913': {
        'latLngToPoint': function() {},
        'pointToLatLng': function() {},
        'project': function() {},
        'scale': function() {},
        'getSize': function() {},
        'Simple': {
          'latLngToPoint': function() {},
          'pointToLatLng': function() {},
          'project': function() {},
          'scale': function() {},
          'getSize': function() {},
          'projection': {
            'project': function() {},
            'unproject': function() {}
          },
          'transformation': {
            '_a': {},
            '_b': {},
            '_c': {},
            '_d': {},
            'transform': function() {},
            '_transform': function() {},
            'untransform': function() {}
          }
        },
        'code': {},
        'projection': {
          'MAX_LATITUDE': {},
          'project': function() {},
          'unproject': function() {}
        },
        'transformation': {
          '_a': {},
          '_b': {},
          '_c': {},
          '_d': {},
          'transform': function() {},
          '_transform': function() {},
          'untransform': function() {}
        }
      },
      'code': {},
      'projection': {
        'project': function() {},
        'unproject': function() {}
      },
      'transformation': {
        '_a': {},
        '_b': {},
        '_c': {},
        '_d': {},
        'transform': function() {},
        '_transform': function() {},
        'untransform': function() {}
      }
    },
    'EPSG3395': {
      'latLngToPoint': function() {},
      'pointToLatLng': function() {},
      'project': function() {},
      'scale': function() {},
      'getSize': function() {},
      'Simple': {
        'latLngToPoint': function() {},
        'pointToLatLng': function() {},
        'project': function() {},
        'scale': function() {},
        'getSize': function() {},
        'projection': {
          'project': function() {},
          'unproject': function() {}
        },
        'transformation': {
          '_a': {},
          '_b': {},
          '_c': {},
          '_d': {},
          'transform': function() {},
          '_transform': function() {},
          'untransform': function() {}
        }
      },
      'EPSG3857': {
        'latLngToPoint': function() {},
        'pointToLatLng': function() {},
        'project': function() {},
        'scale': function() {},
        'getSize': function() {},
        'Simple': {
          'latLngToPoint': function() {},
          'pointToLatLng': function() {},
          'project': function() {},
          'scale': function() {},
          'getSize': function() {},
          'projection': {
            'project': function() {},
            'unproject': function() {}
          },
          'transformation': {
            '_a': {},
            '_b': {},
            '_c': {},
            '_d': {},
            'transform': function() {},
            '_transform': function() {},
            'untransform': function() {}
          }
        },
        'code': {},
        'projection': {
          'MAX_LATITUDE': {},
          'project': function() {},
          'unproject': function() {}
        },
        'transformation': {
          '_a': {},
          '_b': {},
          '_c': {},
          '_d': {},
          'transform': function() {},
          '_transform': function() {},
          'untransform': function() {}
        }
      },
      'EPSG900913': {
        'latLngToPoint': function() {},
        'pointToLatLng': function() {},
        'project': function() {},
        'scale': function() {},
        'getSize': function() {},
        'Simple': {
          'latLngToPoint': function() {},
          'pointToLatLng': function() {},
          'project': function() {},
          'scale': function() {},
          'getSize': function() {},
          'projection': {
            'project': function() {},
            'unproject': function() {}
          },
          'transformation': {
            '_a': {},
            '_b': {},
            '_c': {},
            '_d': {},
            'transform': function() {},
            '_transform': function() {},
            'untransform': function() {}
          }
        },
        'code': {},
        'projection': {
          'MAX_LATITUDE': {},
          'project': function() {},
          'unproject': function() {}
        },
        'transformation': {
          '_a': {},
          '_b': {},
          '_c': {},
          '_d': {},
          'transform': function() {},
          '_transform': function() {},
          'untransform': function() {}
        }
      },
      'EPSG4326': {
        'latLngToPoint': function() {},
        'pointToLatLng': function() {},
        'project': function() {},
        'scale': function() {},
        'getSize': function() {},
        'Simple': {
          'latLngToPoint': function() {},
          'pointToLatLng': function() {},
          'project': function() {},
          'scale': function() {},
          'getSize': function() {},
          'projection': {
            'project': function() {},
            'unproject': function() {}
          },
          'transformation': {
            '_a': {},
            '_b': {},
            '_c': {},
            '_d': {},
            'transform': function() {},
            '_transform': function() {},
            'untransform': function() {}
          }
        },
        'EPSG3857': {
          'latLngToPoint': function() {},
          'pointToLatLng': function() {},
          'project': function() {},
          'scale': function() {},
          'getSize': function() {},
          'Simple': {
            'latLngToPoint': function() {},
            'pointToLatLng': function() {},
            'project': function() {},
            'scale': function() {},
            'getSize': function() {},
            'projection': {
              'project': function() {},
              'unproject': function() {}
            },
            'transformation': {
              '_a': {},
              '_b': {},
              '_c': {},
              '_d': {},
              'transform': function() {},
              '_transform': function() {},
              'untransform': function() {}
            }
          },
          'code': {},
          'projection': {
            'MAX_LATITUDE': {},
            'project': function() {},
            'unproject': function() {}
          },
          'transformation': {
            '_a': {},
            '_b': {},
            '_c': {},
            '_d': {},
            'transform': function() {},
            '_transform': function() {},
            'untransform': function() {}
          }
        },
        'EPSG900913': {
          'latLngToPoint': function() {},
          'pointToLatLng': function() {},
          'project': function() {},
          'scale': function() {},
          'getSize': function() {},
          'Simple': {
            'latLngToPoint': function() {},
            'pointToLatLng': function() {},
            'project': function() {},
            'scale': function() {},
            'getSize': function() {},
            'projection': {
              'project': function() {},
              'unproject': function() {}
            },
            'transformation': {
              '_a': {},
              '_b': {},
              '_c': {},
              '_d': {},
              'transform': function() {},
              '_transform': function() {},
              'untransform': function() {}
            }
          },
          'code': {},
          'projection': {
            'MAX_LATITUDE': {},
            'project': function() {},
            'unproject': function() {}
          },
          'transformation': {
            '_a': {},
            '_b': {},
            '_c': {},
            '_d': {},
            'transform': function() {},
            '_transform': function() {},
            'untransform': function() {}
          }
        },
        'code': {},
        'projection': {
          'project': function() {},
          'unproject': function() {}
        },
        'transformation': {
          '_a': {},
          '_b': {},
          '_c': {},
          '_d': {},
          'transform': function() {},
          '_transform': function() {},
          'untransform': function() {}
        }
      },
      'code': {},
      'projection': {
        'MAX_LATITUDE': {},
        'R_MINOR': {},
        'R_MAJOR': {},
        'project': function() {},
        'unproject': function() {}
      },
      'transformation': {
        '_a': {},
        '_b': {},
        '_c': {},
        '_d': {},
        'transform': function() {},
        '_transform': function() {},
        'untransform': function() {}
      }
    }
  },
  'Map': function() {},
  'map': function() {},
  'TileLayer': function() {},
  'tileLayer': function() {},
  'ImageOverlay': function() {},
  'imageOverlay': function() {},
  'Icon': function() {},
  'icon': function() {},
  'Marker': function() {},
  'marker': function() {},
  'DivIcon': function() {},
  'divIcon': function() {},
  'Popup': function() {},
  'popup': function() {},
  'LayerGroup': function() {},
  'layerGroup': function() {},
  'FeatureGroup': function() {},
  'featureGroup': function() {},
  'Path': function() {},
  'LineUtil': {
    'simplify': function() {},
    'pointToSegmentDistance': function() {},
    'closestPointOnSegment': function() {},
    '_simplifyDP': function() {},
    '_simplifyDPStep': function() {},
    '_reducePoints': function() {},
    'clipSegment': function() {},
    '_getEdgeIntersection': function() {},
    '_getBitCode': function() {},
    '_sqDist': function() {},
    '_sqClosestPointOnSegment': function() {}
  },
  'Polyline': function() {},
  'polyline': function() {},
  'PolyUtil': {
    'clipPolygon': function() {}
  },
  'Polygon': function() {},
  'polygon': function() {},
  'MultiPolyline': function() {},
  'MultiPolygon': function() {},
  'multiPolyline': function() {},
  'multiPolygon': function() {},
  'Rectangle': function() {},
  'rectangle': function() {},
  'Circle': function() {},
  'circle': function() {},
  'CircleMarker': function() {},
  'circleMarker': function() {},
  'GeoJSON': function() {},
  'geoJson': function() {},
  'DomEvent': {
    'addListener': function() {},
    'removeListener': function() {},
    'stopPropagation': function() {},
    'disableScrollPropagation': function() {},
    'disableClickPropagation': function() {},
    'preventDefault': function() {},
    'stop': function() {},
    'getMousePosition': function() {},
    'getWheelDelta': function() {},
    '_skipEvents': function() {},
    '_fakeStop': function() {},
    '_skipped': function() {},
    '_checkMouse': function() {},
    '_getEvent': function() {},
    '_filterClick': function() {},
    'on': function() {},
    'off': function() {},
    '_touchstart': {},
    '_touchend': {},
    'addDoubleTapListener': function() {},
    'removeDoubleTapListener': function() {},
    'POINTER_DOWN': {},
    'POINTER_MOVE': {},
    'POINTER_UP': {},
    'POINTER_CANCEL': {},
    '_pointers': function() {},
    '_pointerDocumentListener': {},
    'addPointerListener': function() {},
    'addPointerListenerStart': function() {},
    'addPointerListenerMove': function() {},
    'addPointerListenerEnd': function() {},
    'removePointerListener': function() {}
  },
  'Draggable': function() {},
  'Handler': function() {},
  'Control': function() {},
  'control': function() {},
  'PosAnimation': function() {}
};

L.MouseEvent = {
  latlng: undefined,
  layerPoint: undefined,
  containerPoint: undefined,
  originalEvent: undefined
};

L.Draggable = function() {};

L.Draggable.START = null;
L.Draggable.END = null;
L.Draggable.MOVE = null;

L.Draggable._disabled = false;

L.LatLng.prototype.distanceTo = function() {};

L.LatLng.prototype.lat;

L.LatLng.prototype.lng;

L.Map.prototype.addLayer = function() {};

L.Map.prototype.removeLayer = function() {};

L.Map.prototype.getMaxZoom = function() {};

L.Map.prototype.getCenter = function() {};

L.Map.prototype.latLngToContainerPoint = function() {};

L.Map.prototype.latLngToLayerPoint = function() {};

L.Map.prototype.layerPointToLatLng = function() {};

L.Map.prototype.dragging = {
  enable: function() {},
  disable: function() {}
};

L.Map.prototype.options = {
  crs: {
    latLngToPoint: function() {},
    pointToLatLng: function() {}
  }
};

L.Control.prototype.extend = function() {};

/**
 * @type {L.Map}
 */
L.Control.prototype._map = null;

L.CircleMarker.prototype.extend = function() {};

L.CircleMarker.prototype.setRadius = function() {};

L.CircleMarker.prototype.bringToFront = function() {};

L.CircleMarker.prototype._container = null;

L.CircleMarker.prototype.setLatLng = function() {};

L.CircleMarker.prototype.getLatLng = function() {};

L.CircleMarker.prototype.addTo = function(map) {};

L.CircleMarker.prototype._path;

L.Polyline.prototype.getLatLngs = function() {};

L.Polyline.prototype.setLatLngs = function(latlngs) {};

L.Polyline.prototype.toGeoJSON = function() {};

L.Polyline.prototype._map = null;

L.Polyline.prototype._latlngs = [];

L.Polyline.prototype._originalPoints = [];

L.Polyline.prototype._updatePath = function() {};

/**
 * @constructor
 * @extends {L.Control}
 */
L.Control.LineStringSelect = function(options) {};

L.Control.LineStringSelect.prototype.initialize = function(options) {};

L.Control.LineStringSelect.prototype.includes;

L.Control.LineStringSelect.prototype.statics;

/**
 * @constructor
 */
L.Control.LineStringSelect.Selection = function() {};

/**
 * @type {L.Polyline}
 */
L.Control.LineStringSelect.Selection.prototype._source = null;

L.Control.LineStringSelect.Endpoint = function() {};

/**
 * @param  {L.Map} map
 */
L.Control.LineStringSelect.Endpoint.prototype.onAdd = function(map) {};

/**
 * @type {Object}
 */
L.Control.LineStringSelect.Endpoint.prototype.options = {
  /**
   * Grow marker by this ratio on mouseover
   * @type {Number}
   */
  radiusRatio: 1.2
};

/**
 * @param  {L.Map} map
 */
L.Control.LineStringSelect.Endpoint.prototype.onRemove = function(map) {};

L.Control.LineStringSelect.ControlMarker = function() {};

L.Control.LineStringSelect.ControlMarker.prototype.show = function() {};

L.Control.LineStringSelect.ControlMarker.prototype.hide = function() {};

/**
 * @type {Object}
 */
L.Control.LineStringSelect.prototype.options = {

  getProjectedPoint: function() {},

  distance: function() {},

  /**
   * @type {String}
   */
  startMarkerClass: '',

  /**
   * @type {String}
   */
  endMarkerClass: '',

  /**
   * @type {String}
   */
  movingMarkerClass: '',

  /**
   * @type {String}
   */
  name: '',

  /**
   * @type {Number}
   */
  lineWeight: 4,

  /**
   * @type {Number}
   */
  lineTolerance: L.Browser.touch ? 10 : 5,

  /**
   * @type {Object}
   */
  movingMarkerStyle: {
    fillColor: '',
    fillOpacity: 1,
    weight: 2,
    opacity: 0.5,
    color: ''
  },

  /**
   * @type {Object}
   */
  endpointStyle: {
    radius: 5,
    color: '',
    fillColor: '',
    fillOpacity: 1
  },

  /**
   * @type {Object}
   */
  selectionStyle: {
    color: '',
    opacity: 1
  },

  /**
   * @type {Boolean}
   */
  useTouch: true,

  /**
   * @type {String}
   */
  position: ''
};

L.Control.LineStringSelect.prototype._feature = {
  geometry: {
    coordinates: []
  }
};

L.Control.LineStringSelect.prototype._startMarker;

L.Control.LineStringSelect.prototype._endMarker;

L.Control.LineStringSelect.prototype._movingMarker;

L.Control.LineStringSelect.prototype.fire = function() {};

/**
 * @param {L.Map} map
 */
L.Control.LineStringSelect.prototype.onAdd = function(map) {};

/**
 * @param  {L.Map} map
 */
L.Control.LineStringSelect.prototype.onRemove = function(map) {};

/**
 * Enable selection mode for line string
 * @param  {Object} options
 * @return {Select}
 */
L.Control.LineStringSelect.prototype.enable = function(options) {};

/**
 * Disable selection
 * @return {Select}
 */
L.Control.LineStringSelect.prototype.disable = function() {};

/**
 * Reset selection
 * @return {Select}
 */
L.Control.LineStringSelect.prototype.reset = function() {};

/**
 * Selection latlngs
 * @return {Array.<L.LatLng>}
 */
L.Control.LineStringSelect.prototype.getSelection = function() {};

/**
 * Selection geoJSON
 * @return {Object|Null}
 */
L.Control.LineStringSelect.prototype.toGeoJSON = function() {};

/**
 * Select from one meter point to another
 * @param  {Number} startM
 * @param  {Number} endM
 * @return {Select}
 */
L.Control.LineStringSelect.prototype.selectMeters = function(startM, endM) {};

/**
 * Replace this method if you want to subclass moving marker
 * @param  {L.LatLng} pos
 * @param  {Object}   style
 * @return {L.Control.LineStringSelect.ControlMarker}
 */
L.Control.LineStringSelect.prototype.movingMarkerFactory = function(pos, style) {};

/**
 * Replace this method if you want to subclass endpoint marker
 * @param  {L.LatLng} pos
 * @param  {Object}   style
 * @param  {Boolean}  isEnd
 * @return {L.Control.LineStringSelect.Endpoint}
 */
L.Control.LineStringSelect.prototype.endpointFactory = function(pos, style, isEnd) {};

/**
 * Craetes a selection polyline. Replace or extend if you want
 * to subclass selection polyline
 * @param  {Array.<L.LatLng>} coords
 * @param  {Object}           style
 * @param  {L.Polyline}       layer
 * @return {L.Control.LineStringSelect.Selection}
 */
L.Control.LineStringSelect.prototype.selectionFactory = function(coords, style, layer) {};
