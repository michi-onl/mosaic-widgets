const { CONFIG } = require("../../config.js");
const { FormatUtils } = require("../../core/format-utils.js");
const { DataSource } = require("../data-source.js");

class TimelineDataSource extends DataSource {
  static sourceIcons = {
    github: "chevron.left.forwardslash.chevron.right",
    wikipedia: "book.fill",
    blog: "doc.text.fill",
    gallery: "photo.fill",
    imdb: "film.fill",
  };

  static sourceColors = {
    github: new Color("#6e5494"),
    wikipedia: new Color("#636466"),
    blog: new Color("#007AFF"),
    gallery: new Color("#34C759"),
    imdb: new Color("#F5C518"),
  };

  isEmpty(data) {
    return !data.events || data.events.length === 0;
  }

  async fetchData(widgetSize) {
    const params = this.category ? { category: this.category } : {};
    const response = await this.api.fetch(this.config.endpoint, params);

    const timelineLimits = { small: 4, medium: 4, large: 8 };
    const limit =
      timelineLimits[widgetSize] ?? CONFIG.sizing[widgetSize].maxItems;

    if (!response || !Array.isArray(response)) {
      return { events: [] };
    }

    return {
      events: response.slice(0, limit).map((item) => ({
        title: item.title,
        source: item.source,
        date: item.date,
        url: item.url,
      })),
    };
  }

  renderWidget(widget, data, widgetSize) {
    const sizes = CONFIG.sizing[widgetSize];

    const headerOptions = this.category ? { subtitle: this.category } : {};
    this.addHeader(widget, "Timeline", sizes, headerOptions);
    widget.addSpacer(sizes.spacing);

    const contentStack = widget.addStack();
    contentStack.layoutVertically();

    this.renderItemList(contentStack, data.events, sizes, true, widgetSize);
  }

  renderItem(stack, event, sizes, widgetSize) {
    const itemStack = stack.addStack();
    itemStack.layoutHorizontally();
    itemStack.centerAlignContent();

    if (event.url) {
      itemStack.url = event.url;
    }

    this.addSourceBadge(itemStack, event, sizes);
    itemStack.addSpacer(sizes.spacing);

    const textStack = itemStack.addStack();
    textStack.layoutVertically();

    const titleText = textStack.addText(event.title);
    titleText.font = Font.boldSystemFont(sizes.fontSize.primary);
    titleText.textColor = CONFIG.colors.primary;
    titleText.lineLimit = 2;

    const timeText = textStack.addText(FormatUtils.formatTimeAgo(event.date));
    timeText.font = Font.systemFont(sizes.fontSize.tertiary);
    timeText.textColor = CONFIG.colors.secondary;

    itemStack.addSpacer();
  }
}

module.exports = { TimelineDataSource };
