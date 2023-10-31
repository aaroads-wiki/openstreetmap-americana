export const backgroundFill = `hsl(60, 39%, 95%)`;
export const backgroundFillTranslucent = `hsla(60, 39%, 95%, 0.8)`;

export const waterFill = "hsl(201, 100%, 87%)";
export const waterFillTranslucent = "hsla(201, 100%, 87%, 0.5)";
export const waterIntermittentFill = "hsla(201, 60%, 87%, 0.3)";
export const waterIntermittentOutline = "hsl(201, 100%, 30%)";
export const waterLine = "hsl(201, 42%, 70%)";
export const waterLineBold = "hsl(201, 42%, 50%)";
export const waterLabel = "hsl(201, 43%, 28%)";

export const hueBorder = 0;
export const hueBorderCasing = 281;

export const border = "hsl(0, 0%, 61%)";
export const borderCasing = `hsl(${hueBorderCasing}, 35%, 86%)`;

export const parkFill = "hsl(110, 41%, 75%)";
export const parkOutline = "hsla(110, 41%, 70%, 50%)";
export const parkLabel = "hsl(110, 71%, 29%)";
export const parkLabelHalo = "hsl(90, 27%, 94%)";

export const aerialwayLine = "hsl(310, 41%, 59%)";
export const aerialwayLabel = "hsl(310, 71%, 29%)";

export const airportFill = "hsl(250, 41%, 95%)";
export const airportOutline = "hsl(250, 41%, 79%)";
export const airportRunway = "hsl(250, 41%, 79%)";
export const airportLabel = "hsl(250, 71%, 29%)";

//TODO - rename this variable to "palette"
export const palette = {
  black: "black",
  blue: "#003f87", // Pantone 294
  brown: "#693f23", // Pantone 469
  green: "#006747", // Pantone 342
  mauve: "#a20067", // Pantone 234 C
  orange: "#f38f00", // Pantone 152
  texas_orange: "#bf5700", // UTexas Orange
  pink: "#df4661", // Pantone 198
  purple: "#6d2077", // Pantone 259
  red: "#bf2033", // Pantone 187
  tan: "#ddcba4", // Pantone 468 C
  white: "white",
  yellow: "#ffcd00", // Pantone 116
  yellow_green: "#c4d600", // Pantone 382
};

export const shields = {
  black: palette.black,
  blue: palette.blue, // Pantone 294
  brown: palette.brown, // Pantone 469
  green: palette.green, // Pantone 342
  orange: palette.orange, // Pantone 152
  pink: palette.pink, // Pantone 198
  purple: palette.purple, // Pantone 259
  red: palette.red, // Pantone 187
  tan: palette.tan, // Pantone 468 C
  white: palette.white,
  yellow: palette.yellow, // Pantone 116
  yellow_green: palette.yellow_green, // Pantone 382
};

export const railwayTunnelFill = "hsl(0, 0%, 90%)";

export const railFill = "hsl(0, 0%, 60%)";
export const narrowGaugeFill = "hsl(0, 0%, 60%)";
export const subwayFill = "hsl(0, 0%, 50%)";
export const lightRailFill = "hsl(0, 0%, 50%)";
export const tramFill = "hsl(0, 0%, 60%)";
export const monorailFill = "hsl(0, 0%, 50%)";
export const funicularFill = "hsl(0, 0%, 50%)";

export const hue = {
  tollRoad: 48,
  park: 136,
  water: 211,
  airport: 273,
  borderCasing: 281,
};

export const poi = {
  infrastructure: palette.blue,
  consumer: palette.texas_orange,
  //outdoor:
  attraction: palette.brown,
  airport: `hsl(${hue.airport}, 100%, 28%)`,
  transport: palette.mauve,
};
