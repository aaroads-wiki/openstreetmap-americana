# OpenStreetMap Americana on AARoads

_A quintessentially American map style_ [🗺 View the map](https://aaroads-wiki.github.io/openstreetmap-americana/)

<img src="doc-img/osm-americana-logo.png" alt="Americana map style logo" width="200" align="right"/>

> _The United States of America is such a glorious mess of contradiction, such a crazy quilt of competing themes, such a fecund mishmash of people and ideas, that defining us is pretty much pointless. There is, of course, a kind of faded notion of "Americana", one that concerns Route 66, diners, freak rock formations, and the like—but even in its halcyon days this "roadside attraction" version of America was never an accurate or nuanced distillation of our massively complicated culture._ <br/><sub>-Hampton Sides, <i>[Americana: Dispatches from the New Frontier](<https://en.wikipedia.org/wiki/Americana_(Sides_book)>)</i> (2004)</sub>

<br />

The [AARoads Wiki](https://wiki.aaroads.com/) features this fork of [OpenStreetMap Americana](https://github.com/zelonewolf/openstreetmap-americana/) in [countless infoboxes and other contexts](https://wiki.aaroads.com/wiki/AARoads:Maps), making it easy for visitors to find their bearings as they read the mellifluous article text. Americana was chosen for its reliance on freely licensed, community-maintained OpenStreetMap data, its use of modern map technology, and its adherence to a visual style that North American roadgeeks would feel right at home in.

This fork retains Americana’s characteristic shields but tweaks the colors to match [a color scheme for static maps](https://en.wikipedia.org/wiki/Wikipedia:WikiProject_U.S._Roads/Maps_task_force#Standards) that the AARoads Wiki’s predecessor, the English Wikipedia’s WikiProject U.S. Roads, [adopted in 2006](https://en.wikipedia.org/wiki/Wikipedia_talk:WikiProject_U.S._Roads/Maps_task_force/Archive_1#Voting) with minor subsequent adjustments.

## How to use

You can install the OpenStreetMap Americana package and [deploy it anywhere](CONTRIBUTING.md#Production%20builds) as a static webpage. For your convenience, we’ve deployed it [on GitHub Pages](https://aaroads-wiki.github.io/openstreetmap-americana/). Click the Legend button to learn the meaning of each symbol, line, and color based on the features currently visible on the map.

The style tries to label places in [your browser’s preferred language](https://www.w3.org/International/questions/qa-lang-priorities). To change this preference, consult your browser’s documentation: [Chrome](https://support.google.com/chrome/answer/173424), [Firefox](https://support.mozilla.org/en-US/kb/use-firefox-another-language), [Safari for macOS](https://support.apple.com/guide/mac-help/change-the-system-language-mh26684/mac), [Safari for iOS](https://support.apple.com/en-us/HT204031). You can also override this preference by adding `&language=` to the URL, followed by a comma-separated list of [IETF language tags](https://www.w3.org/International/articles/language-tags/). For example, here’s a map labeled [in Portuguese, falling back to Spanish](https://aaroads-wiki.github.io/openstreetmap-americana/#language=pt,es). If we don’t have the name of a place in any of your preferred languages, the style shows the name in the local language as a last resort.

## Contributor’s guide

_Contributors welcome!_

The repository is organized as follows:

- **src/** - The map style. See [CONTRIBUTING.md](CONTRIBUTING.md).
- **dev/** - Development tools used for style development. See [Style Developer Tools](dev/README.md)
- **test/** - Automated unit tests.
- **shieldlib/** - Maplibre [shield rendering library](shieldlib/README.md) ([npm entry](https://www.npmjs.com/package/@americana/maplibre-shield-generator?activeTab=readme)).

Some general guidelines:

- Please follow the coding style guidelines described in each sub-folder. These guidelines are designed to make it easier for collaboration and reduce the chance of edit conflicts.
- Innovation is encouraged! Please open a new ticket with your great ideas as a centralized focal point for discussion.
- New contributors are welcome!
- This style operates on the principle of consensus. Maintainers should ensure that changes represent a broad consensus within the American mapping community.
- Maintainers are also responsible to ensure that this principle of consensus does not cause stagnation or inaction. Contributor time is valuable; accepting the responsibility of being a maintainer means committing to responding to issues and PRs on a reasonable timeline that encourages community participation.

## Technology stack

The technology stack for this style can be summarized below:

<img src="doc-img/architecture.drawio.svg" alt="Americana technology stack" />

The dynamic shield generator is included as a [module](shieldlib/README.md) in this repository and also [published to npm](https://www.npmjs.com/package/@americana/maplibre-shield-generator).

## Artifacts

- Style users can use the maplibre [StyleJSON](https://aaroads-wiki.github.io/openstreetmap-americana/style.json), and sprite sheets ([1x](https://aaroads-wiki.github.io/openstreetmap-americana/sprites/sprite.png), [2x](https://aaroads-wiki.github.io/openstreetmap-americana/sprites/sprite@2x.png)).
- For highway shield library users, a [ShieldJSON](https://aaroads-wiki.github.io/openstreetmap-americana/shields.json) must be supplied to associate route networks with sprite images and drawn shield shapes.
- The project [taginfo.json](https://aaroads-wiki.github.io/openstreetmap-americana/taginfo.json) lists which tags are used by the style.

## Data sources

The OpenStreetMap Americana style is built upon the [OpenMapTiles schema](https://openmaptiles.org/schema/), which includes:

- Feature data from OpenStreetMap
- Translated name labels from [Wikidata](https://www.wikidata.org/wiki/Wikidata:Main_Page) for places, POIs, airports, roads, bodies of water, parks, and mountain peaks.
- Low-zoom ocean/water, boundary, and urbanized area data from [Natural Earth](https://www.naturalearthdata.com/).

The legend’s “Route markers” section is labeled using labels of Wikidata items that are tagged with the [corresponding OSM tag](https://www.wikidata.org/wiki/Property:P1282).

## Coverage

Americana is compatible with vector tiles covering the entire world.

Americana displays custom route shields for routes in all U.S. states and territories, and for routes in the following countries:

<img src="doc-img/shield_map_world.svg" width="500" alt="Countries">

We are hoping that it will support more countries; you can [help us](https://github.com/osm-americana/openstreetmap-americana/projects/1)!

## Tile Server

Although the source code in this repository is dedicated to the public domain under a CC0 waiver, it is configured by default to load map tiles from an [OpenStreetMap US](https://www.openstreetmap.us/) hosted community [tile server](https://tile.ourmap.us). OpenStreetMap US, the local chapter for OpenStreetMap in the United States, makes this server available for use by other hobbyist and community projects with constraints. See the [tile server usage policy](https://tile.ourmap.us/usage.html) for more details. This usage policy describes the allowable usage of the tiles for other projects, separate from this style or the application being developed in this repository.
