# AGENTS.md

## Project Overview

iOS/macOS widgets for the [Scriptable](https://scriptable.app/) app. Single JavaScript file (`Mosaic.js`, ~3100 lines) that runs inside Scriptable on device. No build system, package manager, or test runner. Cannot be linted or executed in Node.js — relies on Scriptable globals (`ListWidget`, `Stack`, `SFSymbol`, `Font`, `Color`, `Request`, `FileManager`, `Keychain`, `Script`, `Location`, `config`, `args`).

Testing is interactive only: edit the JS file, copy to the Scriptable iCloud folder, run in the Scriptable app.

## Architecture

### CONFIG object (top of file)

Structural defaults only: endpoints, icons, refresh intervals, sizing constants, color palette, design tokens. User-specific settings live in `widget-config.json` (synced via iCloud), never in the JS file. `ConfigManager` deep-merges the two at startup (`Object.assign` on `CONFIG.sources` — shallow merge per source, not deep).

### Class hierarchy

- **`APIClient`** — HTTP wrapper (GET/POST with token auth, timeout, URL building)
- **`ImageCache`** — in-memory image cache with 5s timeout
- **`CacheManager`** — JSON file cache in iCloud `widget-cache/` directory, 48h max age
- **`RefreshManager`** — tracks fetch success/error per source, exponential backoff on refresh intervals (2^n, capped at 8x)
- **`ConfigManager`** — loads/saves `widget-config.json` from iCloud, provides in-app setup UI via `Alert`
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

- **Design tokens** live in `CONFIG.designTokens` (badge corner radius, padding, compact spacing). Use these instead of hardcoded values.
- **Badges** use `DataSource.addBadge()` for colored rounded-rect labels. Plain styled text labels (like GitHub pre-release) stay inline.
- **`addHeader()`** accepts optional `options` object with `subtitle` for filtered views. Do not add item counts to headers.
- **Footers**: medium (compact, time only) and large (time + offline text). Small widgets have no footer.
- **Error widget** is size-aware — always pass `widgetSize` to `createErrorWidget()`.
- **Separators** (`renderItemList` with `useSeparators = true`) are for text-heavy list widgets without visual anchors. Avoid in multi-column layouts.
- **TimelineDataSource** and **ActivityDataSource** have `static sourceIcons` and `static sourceColors` mapping internal source types — these are class properties, not user config. `DataSource.addSourceBadge()` reads these via `this.constructor.sourceIcons/sourceColors`.

## Constraints

- Line 1–3 of `Mosaic.js` are Scriptable metadata comment (`icon-color`, `icon-glyph`). Must stay at the very top.
- `widget-config.json` in the repo is a template. Real user config lives in the Scriptable iCloud folder and is never committed.
- `ConfigManager.getEditableFields()` defines which sources have in-app setup UI. Adding a new editable source requires updating this method.
- `DataSourceFactory.sourceMap` is the registry of all source names to classes. Adding a source requires an entry here.