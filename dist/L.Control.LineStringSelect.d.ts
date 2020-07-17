import * as L from 'leaflet';
import { Feature, LineString } from 'geojson';

declare module 'leaflet' {
  interface SelectOptions {
    layer: L.Polyline;
    feature: Feature<LineString>;
  }

  export interface LineStringSelectOptions {
    startMarkerClass?: string;
    endMarkerClass?: string;
    movingMarkerClass?: string;
    name?: string;
    lineWeight?: number;
    lineTolerance?: boolean;
    movingMarkerStyle?: L.CircleMarkerOptions;
    endpointStyle?: L.CircleMarkerOptions;
    selectionStyle?: L.PolylineOptions;
    useTouch?: boolean;
    position?: L.ControlPosition;
  }

  namespace Control {

    class LineStringSelect extends L.Control {
      constructor(options: LineStringSelectOptions);
      onAdd(map: L.Map): HTMLElement;
      enable(options: SelectOptions): this;
      reset(): this;
      disable(): this;
      toGeoJSON(): Feature<LineString> | null;
      selectMeters(start: number, end: number): this;
      movingMarkerFactory(pos: L.LatLng, style: L.CircleMarkerOptions): LineStringSelect.ControlMarker;
      endpointFactory(pos: L.LatLng, style: L.CircleMarkerOptions, isEnd?: boolean): LineStringSelect.EndPoint;
      selectionFactory(coords: L.LatLng[], style: L.PolylineOptions, layer: L.Polyline): LineStringSelect.Selection;
    }

    namespace LineStringSelect {
      class Selection extends L.Polyline { }
      class EndPoint extends L.CircleMarker { }
      class ControlMarker extends L.CircleMarker { }
    }
  }

  namespace control {
    function lineStringSelect(options: LineStringSelectOptions): Control.LineStringSelect;
  }
}
