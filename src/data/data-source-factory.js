const { CONFIG } = require("../config.js");
const { BillboardDataSource } = require("./sources/billboard.js");
const { IMDbDataSource } = require("./sources/imdb.js");
const { SteamDataSource } = require("./sources/steam.js");
const { HackerNewsDataSource } = require("./sources/hacker-news.js");
const { GitHubDataSource } = require("./sources/github.js");
const { WikipediaDataSource } = require("./sources/wikipedia.js");
const { TimelineDataSource } = require("./sources/timeline.js");
const { BookmarksDataSource } = require("./sources/bookmarks.js");
const { BooksDataSource } = require("./sources/books.js");
const { AstronomyDataSource } = require("./sources/astronomy.js");
const { BlueskyDataSource } = require("./sources/bluesky.js");
const { ActivityDataSource } = require("./sources/activity.js");
const { StatusBoardDataSource } = require("./sources/status-board.js");
const { DHBWTimetableDataSource } = require("./sources/dhbw-timetable.js");

class DataSourceFactory {
  static sourceMap = {
    billboard: BillboardDataSource,
    imdb: IMDbDataSource,
    steam: SteamDataSource,
    hackernews: HackerNewsDataSource,
    github: GitHubDataSource,
    wikipedia: WikipediaDataSource,
    timeline: TimelineDataSource,
    bookmarks: BookmarksDataSource,
    books: BooksDataSource,
    astronomy: AstronomyDataSource,
    bluesky: BlueskyDataSource,
    activity: ActivityDataSource,
    statusboard: StatusBoardDataSource,
    "dhbw-timetable": DHBWTimetableDataSource,
  };

  static create(sourceName, apiClient) {
    let baseName = sourceName;
    let extra = null;

    if (sourceName.includes(":")) {
      [baseName, extra] = sourceName.split(":", 2);
    }

    const config = CONFIG.sources[baseName];
    const SourceClass = this.sourceMap[baseName];

    if (!config || !SourceClass) {
      throw new Error(`Unknown source: ${sourceName}`);
    }

    const instance = new SourceClass(config, apiClient);
    if (extra) {
      if (baseName === "books") {
        instance.isbn = extra;
      } else {
        instance.category = extra;
      }
    }
    return instance;
  }
}

module.exports = { DataSourceFactory };
