"use strict";

// Common expressions
const highwaySelector = ["match", ["get", "class"]];

export const surface = {
  id: "oneway_surface",
  filter: [
    "all",
    ["==", ["get", "oneway"], 1],
    ["!=", ["get", "ramp"], 1],
    ["!", ["in", ["get", "brunnel"], ["literal", ["bridge", "tunnel"]]]],
    ["!", ["in", ["get", "class"], ["literal", ["path", "track"]]]],
  ],
  source: "openmaptiles",
  "source-layer": "transportation",
  type: "symbol",
  minzoom: 15,

  layout: {
    "icon-size": [
      "interpolate",
      ["exponential", 1.2],
      ["zoom"],
      15,
      [...highwaySelector, ["motorway", "trunk", "primary"], 0.5, 0.3],
      19,
      [
        ...highwaySelector,
        ["motorway", "trunk", "primary"],
        1,
        "secondary",
        0.8,
        0.6,
      ],
    ],
    "icon-image": "oneway_black",
    visibility: "visible",
    "icon-padding": 2,
    "symbol-spacing": [
      "interpolate",
      ["exponential", 1.2],
      ["zoom"],
      15,
      75,
      19,
      300,
    ],
    "symbol-placement": "line",
    "icon-rotation-alignment": "map",
    // Assumes driving on the right.
    "icon-offset": [0, 10],
  },
  paint: {
    "icon-opacity": 0.5,
  },
};

export const tunnel = {
  ...surface,
  id: "oneway_tunnel",
  filter: [
    "all",
    ["==", ["get", "oneway"], 1],
    ["!=", ["get", "ramp"], 1],
    ["==", ["get", "brunnel"], "tunnel"],
    ["!", ["in", ["get", "class"], ["literal", ["path", "track"]]]],
  ],
  paint: {
    "icon-opacity": 0.2,
  },
};

export const bridge = {
  ...surface,
  id: "oneway_bridge",
  filter: [
    "all",
    ["==", ["get", "oneway"], 1],
    ["!=", ["get", "ramp"], 1],
    ["==", ["get", "brunnel"], "bridge"],
    ["!", ["in", ["get", "class"], ["literal", ["path", "track"]]]],
  ],
};
