"use strict";

/**
 * Returns a list of languages as a comma-delimited string from the given URL hash.
 */
export function getLanguageFromURL(url) {
  let language = new URLSearchParams(url.hash.substr(1)).get("language");
  return language === "" ? null : language;
}

/**
 * Returns the languages that the user prefers.
 */
export function getLocales() {
  // Check the language "parameter" in the hash.
  let parameter = getLanguageFromURL(window.location)?.split(",");
  // Fall back to the user's language preference.
  let userLocales = parameter ?? navigator.languages ?? [navigator.language];
  let locales = [];
  let localeSet = new Set(); // avoid duplicates
  for (let locale of userLocales) {
    // Add progressively less specific variants of each user-specified locale.
    let components = locale.split("-");
    while (components.length > 0) {
      let parent = components.join("-");
      if (!localeSet.has(parent)) locales.push(parent);
      localeSet.add(parent);
      components.pop();
    }
  }
  return locales;
}

/**
 * Returns a `coalesce` expression that resolves to the feature's name in a
 * language that the user prefers.
 *
 * @param {[string]} locales - Locales of the name fields to include.
 * @param {boolean} includesLegacyFields - Whether to include the older fields
 *  that include underscores, for layers that have not transitioned to the
 *  colon syntax.
 */
export function getLocalizedNameExpression(locales, includesLegacyFields) {
  let nameFields = [
    ...locales.flatMap((l) => {
      let fields = [`name:${l}`];
      // transportation_label uses an underscore instead of a colon.
      // https://github.com/openmaptiles/openmaptiles/issues/769
      if (includesLegacyFields && (l === "de" || l === "en"))
        fields.push(`name_${l}`);
      return fields;
    }),
    "name",
  ];
  return ["coalesce", ...nameFields.map((f) => ["get", f])];
}

/**
 * Replaces the value of a variable in the given `let` expression.
 *
 * @param {array} letExpr - Expression to update.
 * @param {string} variable - Name of the variable to set.
 * @param {*} value - The variable's new value.
 */
export function updateVariable(letExpr, variable, value) {
  if (!letExpr || letExpr[0] !== "let") return;

  let variableNameIndex = letExpr.indexOf(variable);
  if (variableNameIndex % 2 === 1) {
    letExpr[variableNameIndex + 1] = value;
  }
}

/**
 * Updates localizable variables at the top level of each layer's `text-field` expression based on the given locales.
 *
 * @param {[object]} layers - The style layers to localize.
 * @param {[string]} locales - The locales to insert into each layer.
 */
export function localizeLayers(layers, locales) {
  let localizedNameExpression = getLocalizedNameExpression(locales, false);
  let legacyLocalizedNameExpression = getLocalizedNameExpression(locales, true);

  for (let layer of layers) {
    if ("layout" in layer && "text-field" in layer.layout) {
      let textField = layer.layout["text-field"];

      updateVariable(
        textField,
        "localizedName",
        // https://github.com/openmaptiles/openmaptiles/issues/769
        layer["source-layer"] === "transportation_name"
          ? legacyLocalizedNameExpression
          : localizedNameExpression
      );

      updateVariable(textField, "localizedCollator", [
        "collator",
        {
          "case-sensitive": false,
          "diacritic-sensitive": true,
          locale: locales[0],
        },
      ]);

      // Only perform diacritic folding in English. English normally uses few diacritics except when labeling foreign place names on maps.
      updateVariable(textField, "diacriticInsensitiveCollator", [
        "collator",
        {
          "case-sensitive": false,
          "diacritic-sensitive": !/^en\b/.test(locales[0]),
          locale: locales[0],
        },
      ]);
    }
  }
}

/**
 * Returns an expression that replaces a finite number of occurrences of a
 * substring expression withing a larger string expression, starting at a given
 * index.
 *
 * This expression nests recursively by the maximum number of replacements. Take
 * special care to minimize this limit, which exponentially increases the length
 * of a property value in JSON. Excessive nesting causes acute performance
 * problems when loading the style.
 *
 * The returned expression can be complex, so use it only once within a property
 * value. To reuse the evaluated value, bind it to a variable in a let
 * expression.
 *
 * @param haystack The overall string expression to search within.
 * @param needle The string to search for, or an expression that evaluates to
 *  this string.
 */
export function replaceExpression(
  haystack,
  needle,
  replacement,
  haystackStart,
  numReplacements = 1
) {
  let asIs = ["slice", haystack, haystackStart];
  if (numReplacements <= 0) {
    return asIs;
  }

  let needleStart = ["index-of", needle, haystack, haystackStart];
  let needleLength =
    typeof needle === "object" ? ["length", needle] : needle.length;
  let needleEnd = ["+", needleStart, needleLength];
  return [
    "case",
    [">=", needleStart, 0],
    [
      "concat",
      ["slice", haystack, haystackStart, needleStart],
      replacement,
      replaceExpression(
        haystack,
        needle,
        replacement,
        needleEnd,
        numReplacements - 1
      ),
    ],
    asIs,
  ];
}

/**
 * Maximum number of values in a semicolon-delimited list of values.
 *
 * Increasing this constant deepens recursion for replacing delimiters in the
 * list, potentially affecting style loading performance.
 */
const maxValueListLength = 9;

/**
 * Returns an expression interpreting the given string as a list of tag values,
 * pretty-printing the standard semicolon delimiter with the given separator.
 *
 * https://wiki.openstreetmap.org/wiki/Semi-colon_value_separator
 *
 * The returned expression can be complex, so use it only once within a property
 * value. To reuse the evaluated value, bind it to a variable in a let
 * expression.
 *
 * @param valueList A semicolon-delimited list of values.
 * @param separator A string to insert between each value, or an expression that
 *  evaluates to this string.
 */
export function listValuesExpression(valueList, separator) {
  let maxSeparators = maxValueListLength - 1;
  // Replace the ;; escape sequence with a placeholder sequence unlikely to
  // legitimately occur inside a value or separator.
  const objReplacementChar = "\x91\ufffc\x92"; // https://overpass-turbo.eu/s/1pJx
  let safeValueList = replaceExpression(
    valueList,
    ";;",
    objReplacementChar,
    0,
    maxSeparators
  );
  // Pretty-print the ; delimiter.
  let prettyValueList = replaceExpression(
    ["var", "safeValueList"],
    ";",
    separator,
    0,
    maxSeparators
  );
  // Replace the placeholder sequence with an unescaped semicolon.
  let prettySafeValueList = replaceExpression(
    ["var", "prettyValueList"],
    objReplacementChar,
    ";",
    0,
    maxSeparators
  );
  return [
    "let",
    "safeValueList",
    safeValueList,
    ["let", "prettyValueList", prettyValueList, prettySafeValueList],
  ];
}

/**
 * The names in the user's preferred language, each on a separate line.
 */
export const localizedName = [
  "let",
  "localizedName",
  "",
  listValuesExpression(["var", "localizedName"], "\n"),
];

/**
 * The names in the user's preferred language, all on the same line.
 */
export const localizedNameInline = [
  "let",
  "localizedName",
  "",
  listValuesExpression(["var", "localizedName"], " \u2022 "),
];

/**
 * Returns an expression that tests whether the target has the given prefix,
 * respecting word boundaries.
 */
function startsWithExpression(target, candidatePrefix, collator) {
  // "Quebec City" vs. "Québec", "Washington, D.C." vs. "Washington"
  let wordBoundaries = " ,";
  return [
    "all",
    [
      "==",
      ["slice", target, 0, ["length", candidatePrefix]],
      candidatePrefix,
      collator,
    ],
    [
      "in",
      [
        "slice",
        // Pad the target in case the prefix matches exactly.
        // "Montreal " vs. "Montréal"
        ["concat", target, wordBoundaries[0]],
        ["length", candidatePrefix],
        ["+", ["length", candidatePrefix], 1],
      ],
      wordBoundaries,
    ],
  ];
}

function overwritePrefixExpression(target, newPrefix) {
  return ["concat", newPrefix, ["slice", target, ["length", newPrefix]]];
}

/**
 * Returns an expression that tests whether the target has the given suffix,
 * respecting word boundaries.
 */
function endsWithExpression(target, candidateSuffix, collator) {
  let wordBoundary = " ";
  return [
    "all",
    [
      "==",
      ["slice", target, ["-", ["length", target], ["length", candidateSuffix]]],
      candidateSuffix,
      collator,
    ],
    [
      "==",
      [
        "slice",
        target,
        ["-", ["-", ["length", target], ["length", candidateSuffix]], 1],
        ["-", ["length", target], ["length", candidateSuffix]],
      ],
      wordBoundary,
    ],
  ];
}

function overwriteSuffixExpression(target, newSuffix) {
  return [
    "concat",
    ["slice", target, 0, ["-", ["length", target], ["length", newSuffix]]],
    newSuffix,
  ];
}

/**
 * The name in the user's preferred language, followed by the name in the local
 * language in parentheses if it differs.
 */
export const localizedNameWithLocalGloss = [
  "let",
  "localizedName",
  "",
  "localizedCollator",
  ["collator", {}],
  "diacriticInsensitiveCollator",
  ["collator", {}],
  [
    "case",
    // If the name in the preferred and local languages match exactly...
    [
      "==",
      ["var", "localizedName"],
      ["get", "name"],
      ["var", "localizedCollator"],
    ],
    // ...just pick one.
    ["format", listValuesExpression(["var", "localizedName"], "\n")],
    // If the name in the preferred language is the same as the name in the
    // local language except for the omission of diacritics and/or the addition
    // of a suffix (e.g., "City" in English)...
    startsWithExpression(
      ["var", "localizedName"],
      ["get", "name"],
      ["var", "diacriticInsensitiveCollator"]
    ),
    // ...then replace the common prefix with the local name.
    [
      "format",
      overwritePrefixExpression(
        ["var", "localizedName"],
        listValuesExpression(["get", "name"], "\n")
      ),
    ],
    // If the name in the preferred language is the same as the name in the
    // local language except for the omission of diacritics and/or the addition
    // of a prefix (e.g., "City of" in English or "Ciudad de" in Spanish)...
    endsWithExpression(
      ["var", "localizedName"],
      ["get", "name"],
      ["var", "diacriticInsensitiveCollator"]
    ),
    // ...then replace the common suffix with the local name.
    [
      "format",
      overwriteSuffixExpression(
        ["var", "localizedName"],
        listValuesExpression(["get", "name"], "\n")
      ),
    ],
    // Otherwise, gloss the name in the local language if it differs from the
    // localized name.
    [
      "format",
      ["var", "localizedName"],
      "\n",
      "(\u200B",
      { "font-scale": 0.8 },
      // GL JS lacks support for bidirectional isolating characters, so use a
      // character from the localized name to insulate the parentheses from the
      // embedded text's writing direction. Make it so small that GL JS doesn't
      // bother rendering it.
      ["concat", ["slice", ["var", "localizedName"], 0, 1], " "],
      { "font-scale": 0.001 },
      listValuesExpression(["get", "name"], " \u2022 "),
      { "font-scale": 0.8 },
      ["concat", " ", ["slice", ["var", "localizedName"], 0, 1]],
      { "font-scale": 0.001 },
      // A ZWSP prevents GL JS from combining this component with the preceding
      // one, which would cause it to vanish along with the faux isolating
      // character.
      "\u200B)",
      { "font-scale": 0.8 },
    ],
  ],
];
