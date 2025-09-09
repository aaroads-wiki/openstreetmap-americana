import { StyleSpecification } from "@maplibre/maplibre-gl-style-spec";
import * as Layers from "../layer/index.js";

// Generate style.json
export function build(
  tileURL: string,
  spriteURL: string,
  glyphURL: string,
  locales: string[]
): StyleSpecification {
  let today = new Date();
  let fool = today.getMonth() === 3 && today.getDate() === 1;
  return {
    name: "Americana",
    glyphs: glyphURL,
    layers: Layers.build(locales),
    sources: {
      openmaptiles: {
        url: tileURL,
        type: "vector",
      },
      dem: {
        attribution:
          '<a target="_blank" rel="noopener" href="https://registry.opendata.aws/terrain-tiles/">Terrain Tiles</a>',
        type: "raster-dem",
        tiles: [
          "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png",
        ],
        encoding: "terrarium",
        tileSize: 256,
        // The actual maxzoom is 15
        maxzoom: 13,
      },
      controlcities: {
        type: "geojson",
        data: fool ? {
          "type": "FeatureCollection",
          "features": [
            {
              "type": "Feature",
              "properties": {
                "name": "Other Desert Cities",
                "name:en": "Other Desert Cities",
                "name:ja": "アザー・デザート・シティーズ",
                "name:zh": "其他沙漠城市",
              },
              "geometry": {
                "type": "Point",
                "coordinates": [-116.3694769,33.7667042]
              }
            },
            {
              "type": "Feature",
              "properties": {
                "name": "Limón",
                "name:en": "Limon",
                "name:es": "Limón",
                "name:uk": "Лаймон",
                "name:sr": "Лимон",
                "name:kk": "Лимон",
                "name:arz": "ليمون",
                "name:ce": "Лаймон",
                "name:mr": "लायमन",
                "name:ky": "Лимон",
                "name:zh": "利蒙",
                "name:ar": "ليمون",
                "name:fa": "لیمون",
                "name:tt": "Лаймон",
                "name:bg": "Лаймън",
                "capital": 4,
              },
              "geometry": {
                "type": "Point",
                "coordinates": [-103.6931230,39.2648545]
              }
            }
          ]
        } : {}
      },
    },
    sprite: spriteURL,
    light: {
      anchor: "viewport",
      color: "white",
      intensity: 0.12,
    },
    version: 8,
  };
}
