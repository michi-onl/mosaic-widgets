const { CONFIG } = require("../../config.js");
const { FormatUtils } = require("../../core/format-utils.js");
const { DataSource } = require("../data-source.js");

class BookmarksDataSource extends DataSource {
  isEmpty(data) {
    return !data.bookmarks || data.bookmarks.length === 0;
  }

  async fetchData(widgetSize) {
    const response = await this.api.fetch(this.config.endpoint);

    if (!response || !Array.isArray(response.bookmarks)) {
      return { bookmarks: [] };
    }

    let bookmarks = response.bookmarks;
    if (this.category) {
      const tag = this.category.toLowerCase();
      bookmarks = bookmarks.filter(
        (b) =>
          Array.isArray(b.tags) && b.tags.some((t) => t.toLowerCase() === tag),
      );
    }

    const limit = CONFIG.sizing[widgetSize].maxItems;

    return {
      bookmarks: bookmarks.slice(0, limit).map((b) => ({
        title: FormatUtils.truncate(b.title || b.url, 45),
        description: FormatUtils.truncate(b.description || "", 60),
        tags: b.tags || [],
        url: b.url,
        domain: b.url
          ? b.url
              .replace(/^https?:\/\//, "")
              .replace(/^www\./, "")
              .split("/")[0]
          : "",
        dateAdded: b.date_added,
      })),
    };
  }

  renderWidget(widget, data, widgetSize) {
    const sizes = CONFIG.sizing[widgetSize];

    const headerOptions =
      this.category && widgetSize !== "small" ? { subtitle: this.category } : {};
    this.addHeader(widget, "Bookmarks", sizes, headerOptions);
    widget.addSpacer(sizes.spacing);

    const contentStack = widget.addStack();
    contentStack.layoutVertically();

    this.renderItemList(contentStack, data.bookmarks, sizes, widgetSize);
  }

  // Title (primary) + domain (tertiary).
  rowHeight(sizes) {
    return (sizes.fontSize.primary + sizes.fontSize.tertiary) * 1.2;
  }

  renderItem(stack, item, sizes, widgetSize) {
    const itemStack = stack.addStack();
    itemStack.layoutHorizontally();
    itemStack.centerAlignContent();

    if (item.url) itemStack.url = item.url;

    if (this.category && item.tags.length > 0) {
      this.addBadge(itemStack, {
        text: item.tags[0],
        color: CONFIG.colors.accent,
        sizes,
      });
      itemStack.addSpacer(sizes.spacing);
    }

    const textStack = itemStack.addStack();
    textStack.layoutVertically();

    const titleText = textStack.addText(item.title);
    titleText.font = Font.semiboldSystemFont(sizes.fontSize.primary);
    titleText.textColor = CONFIG.colors.label;
    titleText.lineLimit = 1;

    const urlText = textStack.addText(item.domain);
    urlText.font = Font.systemFont(sizes.fontSize.tertiary);
    urlText.textColor = CONFIG.colors.tertiaryLabel;
    urlText.lineLimit = 1;
  }
}

module.exports = { BookmarksDataSource };
