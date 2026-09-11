# AGENTS.md

## Project Overview

iOS/macOS widgets for the [Scriptable](https://scriptable.app/) app. Source is a CommonJS module tree under `src/`, bundled by esbuild into the single committed `Mosaic.js` that runs inside Scriptable on device. Relies on Scriptable globals (`ListWidget`, `Stack`, `SFSymbol`, `Font`, `Color`, `Request`, `FileManager`, `Keychain`, `Script`, `Location`, `config`, `args`).

- `npm run build` — bundle `src/index.js` → `Mosaic.js` (Scriptable metadata banner comes from `build.mjs`)
- `npm test` / `node --test` — run the suite in `test/` against `src/` directly (no build needed)
- `npm run check` — build, then test

`src/index.js` is a thin composition root: it wires modules, re-exports the public surface for tests, and runs the app only when `Script` is defined (an IIFE, not top-level await, so Node can `require` it). `test/scriptable-stubs.js` stubs the Scriptable globals touched at module-load time (currently just `Color`); extend it if a future test needs to exercise rendering.

Widget rendering is interactive only: build, copy `Mosaic.js` to the Scriptable iCloud folder, run in the Scriptable app. Pure logic (`FormatUtils`, StatusBoard extractor coverage, per-source config validation) is covered by `node --test`.

## Architecture

### CONFIG object (`src/config.js`)

Structural defaults only: endpoints, icons, refresh intervals, sizing constants, color palette, design tokens. User-specific settings live in `widget-config.json` (synced via iCloud), never in the JS file. `ConfigManager` deep-merges the two at startup (`Object.assign` on `CONFIG.sources` — shallow merge per source, not deep).

### Module layout

- `src/config.js` — `CONFIG`, including the semantic color palette and type scale
- `src/design-system.js` — render primitives: `typography.*(sizes)`, `addSeparator`, `addTag`, `addGlassSurface`
- `src/core/` — `APIClient`, `ImageCache`, `CacheManager`, `RefreshManager`, `ConfigManager`, `FormatUtils`
- `src/data/data-source.js` — `DataSource` base class
- `src/data/sources/` — one file per data source
- `src/data/data-source-factory.js` — `DataSourceFactory` registry
- `src/ui/` — `ConfigManager`'s alert flows (`config-ui.js`), the in-app source picker (`source-picker.js`), and widget chrome: footer, error widget + `classifyError`, presentation (`widget-chrome.js`)
- `src/app.js` — `Mosaic` entry point (orchestration only)
- `src/index.js` — composition root, re-exports, execution guard

`StatusBoardDataSource` requires `DataSourceFactory` lazily inside `fetchData()` — the factory itself imports every source, so a top-level require would be a load-time cycle yielding `undefined`.

### Class hierarchy

- **`APIClient`** — HTTP wrapper (GET/POST with token auth, timeout, URL building)
- **`ImageCache`** — in-memory image cache with 5s timeout
- **`CacheManager`** — JSON file cache in iCloud `widget-cache/` directory, 48h max age
- **`RefreshManager`** — tracks fetch success/error per source, exponential backoff on refresh intervals (2^n, capped at 8x)
- **`ConfigManager`** — loads/saves `widget-config.json` from iCloud (source-specific fields only) and owns the `getEditableFields()` schema. `apiToken` is stored in `Keychain`, not the iCloud JSON; `load()` migrates a legacy plaintext `apiToken` out of the JSON file on first run. The `Alert` UI lives separately in `src/ui/config-ui.js`.
- **`FormatUtils`** — static helpers: `truncate`, `formatNumber`, `formatTimeAgo`, `formatDuration`, `pluralize`, `formatTime`, `formatDateLabel`, `cleanTitle`, `stripHtml`
- **`DataSource`** (base class) — subclasses must implement `fetchData(widgetSize)`, `isEmpty(data)`, `renderWidget(widget, data, widgetSize)`. Base provides `addHeader`, `addBadge`, `addSourceBadge`, `renderItemList`, `renderGrid`
- **14 DataSource subclasses** — `BillboardDataSource`, `IMDbDataSource`, `SteamDataSource`, `HackerNewsDataSource`, `GitHubDataSource`, `WikipediaDataSource`, `TimelineDataSource`, `BookmarksDataSource`, `BooksDataSource`, `AstronomyDataSource`, `BlueskyDataSource`, `ActivityDataSource`, `StatusBoardDataSource`, `DHBWTimetableDataSource`
- **`DataSourceFactory`** — parses `"source:extra"` parameter syntax, maps source name to class
- **`Mosaic`** — entry point: loads config, creates data source, fetches data, renders widget

### Widget parameter syntax

`sourceName` or `sourceName:extra`. Extra is stored as `instance.isbn` (books) or `instance.category` (everything else). Examples: `"timeline:contributions"`, `"books:9780099518471"`, `"bookmarks:dev"`.

### Data flow

1. `ConfigManager.load()` — merge iCloud config into `CONFIG`
2. Read `args.widgetParameter` (or `CONFIG.defaultSource`)
3. `DataSourceFactory.create(sourceName, apiClient)`
4. `fetchData(widgetSize)` → `RefreshManager.recordSuccess/Error` → `CacheManager.save`
5. `renderWidget(widget, data, widgetSize)`
6. Network failure → `CacheManager.load` fallback
7. `addFooter` (medium: time only, large: time + offline text, small: none)
8. In-app run: source picker with config setup UI for sources with editable fields

### Source-specific behavior

- **Books** creates its own `APIClient` for Google Books API (not the main `api.michi.onl` endpoint)
- **Astronomy** creates its own `APIClient` for Open-Meteo API, also uses `Location.current()` with cache fallback
- **StatusBoard** fetches multiple sub-sources concurrently via `Promise.allSettled`, with per-source cache fallback. Add new sources to `extractTopItem()` mapping
- **Activity** also fetches multiple sub-sources (github, wikipedia) concurrently

## Design Conventions

Design system v2 is Apple-native / SF-clean; the spec is `design-system.md`. Tokens live in `CONFIG.colors`, `CONFIG.sizing.<family>.fontSize`, `CONFIG.images`, and `CONFIG.designTokens`.

- **Semantic colors only**: `CONFIG.colors.label` / `secondaryLabel` / `tertiaryLabel` / `quaternaryLabel`, `separator`, `fill`, plus `accent` (systemBlue) and status colors. Color is identity/status, never decoration.
- **Typography via helpers**: use `typography.title/body/footnote/caption(sizes)` from `src/design-system.js` rather than calling `Font.*` with a hardcoded weight. Titles are semibold, not bold.
- **Tags/badges** use `DataSource.addBadge()` (delegates to `addTag`): neutral translucent `fill` capsule with a colored label or glyph. Plain styled text labels (like GitHub pre-release) stay inline.
- **Separators**: list rows are separated by spacing only — `renderItemList` draws no rules. The only hairline is the footer rule, via `addSeparator()`/the `separator` token (0.5pt).
- **Radii** are concentric: `designTokens.cornerRadius` = `{ badge: 6, control: 10, card: 12, icon: 4, cover: 8 }`.
- **`addHeader()`** accepts optional `options` object with `subtitle` for filtered views. Do not add item counts to headers.
- **Footers**: medium (compact, time only) and large (time + offline text). Small widgets have no footer.
- **Error widget** is size-aware — always pass `widgetSize` to `createErrorWidget()`.
- **Liquid Glass**: a `ListWidget` cannot blur; iOS already renders the widget as a material. Keep content first and use `addGlassSurface()` only for small grouping surfaces.
- **TimelineDataSource** and **ActivityDataSource** have `static sourceIcons` and `static sourceColors` mapping internal source types — these are class properties, not user config. `DataSource.addSourceBadge()` reads these via `this.constructor.sourceIcons/sourceColors`.
- **Per-source header tint**: `CONFIG.sources.<name>.color` (a `Color`, usually the service's own brand color) tints that source's header icon via `addHeader()` and its Status Board row icon. Omit it for aggregator sources (Timeline, Activity, StatusBoard) and ones already color-coded per-row (DHBW Timetable) — falls back to `CONFIG.colors.accent`.

## Constraints

- Line 1–3 of the bundled `Mosaic.js` are the Scriptable metadata comment (`icon-color`, `icon-glyph`), injected by the `banner` option in `build.mjs`. Never hand-edit them in `Mosaic.js` — edit `build.mjs` and rebuild.
- `widget-config.json` in the repo is a template. Real user config lives in the Scriptable iCloud folder and is never committed. `apiToken` is set via the in-app "API Token" menu (stored in `Keychain`), not this file.
- `ConfigManager.getEditableFields()` defines which sources have in-app setup UI. Adding a new editable source requires updating this method.
- `DataSourceFactory.sourceMap` is the registry of all source names to classes. Adding a source requires an entry here.