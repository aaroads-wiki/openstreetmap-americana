"use strict";

export const urbanizedArea = {
  id: "urbanized-area",
  type: "fill",
  minzoom: 4,
  maxzoom: 6,
  filter: ["==", ["get", "class"], "residential"],
  paint: {
    "fill-color": "hsl(60, 100%, 91%)",
  },
  source: "openmaptiles",
  "source-layer": "landuse",
};

export const legendEntries = [
  {
    description: "Urban area",
    layers: [urbanizedArea.id],
  },
];
