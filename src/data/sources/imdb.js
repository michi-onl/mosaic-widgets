const { CONFIG } = require("../../config.js");
const { FormatUtils } = require("../../core/format-utils.js");
const { DataSource } = require("../data-source.js");

class IMDbDataSource extends DataSource {
  isEmpty(data) {
    return (
      (!data.movies || data.movies.length === 0) &&
      (!data.tvShows || data.tvShows.length === 0)
    );
  }

  async fetchData(widgetSize) {
    const response = await this.api.fetch(this.config.endpoint);

    const limit = CONFIG.sizing[widgetSize].maxItems;
    const half = Math.ceil(limit / 2);

    const movies =
      response.movies?.data && Array.isArray(response.movies.data)
        ? response.movies.data
            .slice(0, half)
            .map((m) => this.formatItem(m, "movie"))
        : [];
    const tvShows =
      widgetSize !== "small" &&
      response.tv_shows?.data &&
      Array.isArray(response.tv_shows.data)
        ? response.tv_shows.data
            .slice(0, half)
            .map((t) => this.formatItem(t, "tv"))
        : [];

    await DataSource.preloadImages(
      [...movies, ...tvShows],
      "imageUrl",
      "poster",
    );

    return {
      movies: movies,
      tvShows: tvShows,
    };
  }

  formatItem(item, type) {
    const subtitleParts = [];
    if (item.year) subtitleParts.push(item.year);
    if (item.length) subtitleParts.push(item.length);
    return {
      title: FormatUtils.truncate(item.title, 30),
      subtitle: subtitleParts.join(" • "),
      rating: item.rating,
      genre: item.genre || "",
      url: item.href || "",
      type: type,
      imageUrl: item.image || null,
      poster: null,
    };
  }

  static getRatingColor(rating) {
    if (rating === "") return CONFIG.colors.new;
    const value = parseFloat(rating);
    if (isNaN(value)) return CONFIG.colors.accent;
    if (value >= 7) return CONFIG.colors.up;
    if (value >= 5) return CONFIG.colors.warning;
    return CONFIG.colors.down;
  }

  renderWidget(widget, data, widgetSize) {
    const sizes = CONFIG.sizing[widgetSize];

    this.addHeader(widget, "Popular on IMDb", sizes, {
      subtitle: "Movies · TV",
    });
    widget.addSpacer(sizes.spacing);

    const allItems = [
      ...data.movies.map((m) => ({ ...m, type: "movie" })),
      ...data.tvShows.map((t) => ({ ...t, type: "tv" })),
    ].slice(0, sizes.maxItems);

    const contentStack = widget.addStack();
    this.renderGrid(contentStack, allItems, sizes, widgetSize);
  }

  renderItem(stack, item, sizes, widgetSize = "medium") {
    const itemStack = stack.addStack();
    itemStack.layoutHorizontally();
    itemStack.centerAlignContent();

    if (item.url) itemStack.url = item.url;

    if (item.poster) {
      const imgSize = CONFIG.images.gridTall[widgetSize];
      const coverImg = itemStack.addImage(item.poster);
      coverImg.imageSize = new Size(imgSize.width, imgSize.height);
      coverImg.cornerRadius = imgSize.cornerRadius;
      itemStack.addSpacer(sizes.spacing);
    }

    const textStack = itemStack.addStack();
    textStack.layoutVertically();

    const titleText = textStack.addText(FormatUtils.truncate(item.title, 30));
    titleText.font = Font.semiboldSystemFont(sizes.fontSize.primary);
    titleText.textColor = CONFIG.colors.label;
    titleText.lineLimit = 1;

    const metaText = textStack.addText(item.subtitle);
    metaText.font = Font.systemFont(sizes.fontSize.secondary);
    metaText.textColor = CONFIG.colors.secondaryLabel;
    metaText.lineLimit = 1;

    const badgeStack = textStack.addStack();
    badgeStack.addSpacer(2);
    this.addBadge(badgeStack, {
      text: item.rating === "" ? "NEW" : String(item.rating ?? ""),
      color: IMDbDataSource.getRatingColor(item.rating),
      sizes,
    });
  }
}

module.exports = { IMDbDataSource };
