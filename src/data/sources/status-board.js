const { CONFIG } = require("../../config.js");
const { CacheManager } = require("../../core/cache-manager.js");
const { FormatUtils } = require("../../core/format-utils.js");
const { DataSource } = require("../data-source.js");

class StatusBoardDataSource extends DataSource {
  async fetchData(widgetSize) {
    // Required lazily: DataSourceFactory pulls in this module, so a top-level
    // require here would be a load-time cycle and yield undefined.
    const { DataSourceFactory } = require("../data-source-factory.js");
    const boardSources = this.config.boardSources || [];
    const sizes = CONFIG.sizing[widgetSize];
    const maxSources =
      widgetSize === "small" ? 2 : widgetSize === "medium" ? 3 : 5;
    const sourcesToFetch = boardSources.slice(0, maxSources);

    const results = await Promise.allSettled(
      sourcesToFetch.map(async (sourceName) => {
        try {
          const source = DataSourceFactory.create(sourceName, this.api);
          const data = await source.fetchData(widgetSize);

          if (source.isEmpty(data)) {
            return {
              name: sourceName,
              config: CONFIG.sources[sourceName],
              topItem: null,
              error: null,
            };
          }

          const topItem = this.extractTopItem(sourceName, data);
          return {
            name: sourceName,
            config: CONFIG.sources[sourceName],
            topItem,
            error: null,
          };
        } catch (error) {
          // Try cache fallback
          const cached = await CacheManager.load(sourceName);
          if (cached) {
            const topItem = this.extractTopItem(sourceName, cached.data);
            return {
              name: sourceName,
              config: CONFIG.sources[sourceName],
              topItem,
              error: null,
            };
          }
          return {
            name: sourceName,
            config: CONFIG.sources[sourceName],
            topItem: null,
            error: error.message,
          };
        }
      }),
    );

    const sources = results.map((r) =>
      r.status === "fulfilled"
        ? r.value
        : { name: "unknown", topItem: null, error: r.reason },
    );
    return { sources };
  }

  // Every entry in CONFIG.sources (other than statusboard itself) needs an extractor
  // here, or its Status Board row silently shows "no data" even with a successful fetch.
  static topItemExtractors = {
    billboard: (data) =>
      data.items?.[0] && `${data.items[0].title} — ${data.items[0].subtitle}`,
    imdb: (data) =>
      data.movies?.[0] && `${data.movies[0].title} (${data.movies[0].year})`,
    steam: (data) => {
      const allGames = data.games || [];
      return allGames[0] && allGames[0].name;
    },
    hackernews: (data) => data.stories?.[0]?.title,
    github: (data) =>
      data.releases?.[0] &&
      `${data.releases[0].repo} ${data.releases[0].tagName}`,
    wikipedia: (data) => data.edits?.[0]?.title,
    timeline: (data) => data.events?.[0]?.title,
    bookmarks: (data) => data.bookmarks?.[0]?.title,
    bluesky: (data) =>
      data.posts?.[0] && FormatUtils.truncate(data.posts[0].text, 60),
    astronomy: () => "Astronomy data",
    "dhbw-timetable": (data) => data.events?.[0]?.name,
    books: (data) => data.title,
    activity: (data) => data.items?.[0]?.title,
  };

  extractTopItem(sourceName, data) {
    if (!data) return null;
    const extractor = StatusBoardDataSource.topItemExtractors[sourceName];
    return extractor ? extractor(data) || null : null;
  }

  isEmpty(data) {
    return !data || !data.sources || data.sources.length === 0;
  }

  renderWidget(widget, data, widgetSize) {
    const sizes = CONFIG.sizing[widgetSize];

    this.addHeader(widget, "Status Board", sizes);
    widget.addSpacer(sizes.spacing);

    const contentStack = widget.addStack();
    contentStack.layoutVertically();

    const visible = data.sources.slice(
      0,
      this.maxItemsThatFit(sizes, widgetSize),
    );
    visible.forEach((source, index) => {
      this.renderSourceRow(contentStack, source, sizes, widgetSize);
      if (index < visible.length - 1) {
        contentStack.addSpacer(sizes.spacing);
      }
    });
  }

  // One semibold line vs the leading source icon.
  rowHeight(sizes) {
    return Math.max(sizes.iconSize, sizes.fontSize.primary * 1.2);
  }

  renderSourceRow(stack, source, sizes, widgetSize) {
    const row = stack.addStack();
    row.layoutHorizontally();
    row.centerAlignContent();

    if (source.config?.urlScheme) {
      row.url = source.config.urlScheme;
    }

    // Source icon
    const iconName = source.config?.icon || "questionmark.circle";
    const icon = row.addImage(SFSymbol.named(iconName).image);
    icon.imageSize = new Size(sizes.iconSize, sizes.iconSize);
    icon.tintColor = source.config?.color || CONFIG.colors.accent;
    row.addSpacer(sizes.spacing);

    if (source.error) {
      const errorText = row.addText(source.config?.name || source.name);
      errorText.font = Font.systemFont(sizes.fontSize.secondary);
      errorText.textColor = CONFIG.colors.tertiaryLabel;
    } else if (source.topItem) {
      const textStack = row.addStack();
      textStack.layoutVertically();

      const itemText = textStack.addText(
        FormatUtils.truncate(source.topItem, widgetSize === "small" ? 30 : 60),
      );
      itemText.font = Font.semiboldSystemFont(sizes.fontSize.primary);
      itemText.textColor = CONFIG.colors.label;
      itemText.lineLimit = 1;
    } else {
      const emptyText = row.addText(
        `${source.config?.name || source.name} — no data`,
      );
      emptyText.font = Font.systemFont(sizes.fontSize.secondary);
      emptyText.textColor = CONFIG.colors.tertiaryLabel;
    }
  }
}

module.exports = { StatusBoardDataSource };
