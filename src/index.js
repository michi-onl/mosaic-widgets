const { CONFIG } = require("./config.js");
const { FormatUtils } = require("./core/format-utils.js");
const { APIClient } = require("./core/api-client.js");
const { ImageCache } = require("./core/image-cache.js");
const { CacheManager } = require("./core/cache-manager.js");
const { RefreshManager } = require("./core/refresh-manager.js");
const { ConfigManager } = require("./core/config-manager.js");
const { DataSource } = require("./data/data-source.js");
const { DataSourceFactory } = require("./data/data-source-factory.js");
const { BillboardDataSource } = require("./data/sources/billboard.js");
const { IMDbDataSource } = require("./data/sources/imdb.js");
const { SteamDataSource } = require("./data/sources/steam.js");
const { HackerNewsDataSource } = require("./data/sources/hacker-news.js");
const { GitHubDataSource } = require("./data/sources/github.js");
const { WikipediaDataSource } = require("./data/sources/wikipedia.js");
const { TimelineDataSource } = require("./data/sources/timeline.js");
const { BookmarksDataSource } = require("./data/sources/bookmarks.js");
const { BooksDataSource } = require("./data/sources/books.js");
const { AstronomyDataSource } = require("./data/sources/astronomy.js");
const { BlueskyDataSource } = require("./data/sources/bluesky.js");
const { ActivityDataSource } = require("./data/sources/activity.js");
const { StatusBoardDataSource } = require("./data/sources/status-board.js");
const { DHBWTimetableDataSource } = require("./data/sources/dhbw-timetable.js");
const { Mosaic } = require("./app.js");

// Guarded (and wrapped in an IIFE rather than top-level await, which CommonJS can't
// parse) so this file can be `require`'d from Node for testing — see test/. Scriptable
// always defines `Script`, Node never does.
if (typeof Script !== "undefined") {
  (async () => {
    const widget = new Mosaic();
    await widget.run();
  })();
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    CONFIG,
    FormatUtils,
    APIClient,
    ImageCache,
    CacheManager,
    RefreshManager,
    ConfigManager,
    DataSource,
    DataSourceFactory,
    BillboardDataSource,
    IMDbDataSource,
    SteamDataSource,
    HackerNewsDataSource,
    GitHubDataSource,
    WikipediaDataSource,
    TimelineDataSource,
    BookmarksDataSource,
    BooksDataSource,
    AstronomyDataSource,
    BlueskyDataSource,
    ActivityDataSource,
    StatusBoardDataSource,
    DHBWTimetableDataSource,
    Mosaic,
  };
}
