import * as Layers from "../layer/index.js";

// Generate style.json
export function build(tileURL, spriteURL, glyphURL, locales) {
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
