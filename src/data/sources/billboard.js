const { CONFIG } = require("../../config.js");
const { FormatUtils } = require("../../core/format-utils.js");
const { DataSource } = require("../data-source.js");

class BillboardDataSource extends DataSource {
  isEmpty(data) {
    return !data.items || data.items.length === 0;
  }

  async fetchData(widgetSize) {
    const response = await this.api.fetch(this.config.endpoint);

    if (!response.music?.data) {
      throw new Error("Invalid Billboard data structure");
    }

    const limit = CONFIG.sizing[widgetSize].maxItems;
    const items = response.music.data.slice(0, limit).map((item) => ({
      position: item.position,
      title: FormatUtils.cleanTitle(item.title),
      subtitle: item.artist,
      coverUrl: item.cover || null,
      metadata: {
        last_week: item.last_week,
        peak: item.peak,
        weeks: item.weeks,
      },
    }));

    await DataSource.preloadImages(items, "coverUrl", "cover");

    return {
      title: response.music.data_title || "Billboard 200",
      subtitle: response.music.data_desc || "",
      items,
    };
  }

  static getTrend(current, lastWeek) {
    if (lastWeek === 0) return { symbol: "star.fill", color: CONFIG.colors.new };
    if (current < lastWeek) return { symbol: "arrow.up", color: CONFIG.colors.up };
    if (current > lastWeek)
      return { symbol: "arrow.down", color: CONFIG.colors.down };
    return { symbol: "minus", color: CONFIG.colors.unchanged };
  }

  renderWidget(widget, data, widgetSize) {
    const sizes = CONFIG.sizing[widgetSize];

    this.addHeader(widget, data.title, sizes);
    widget.addSpacer(this.headerSpacing(sizes));

    const contentStack = widget.addStack();
    this.renderGrid(contentStack, data.items, sizes, widgetSize);
  }

  // Album covers are square, so use the square art token (same height, more
  // width than the default portrait thumbnail).
  coverImageSize(widgetSize) {
    return CONFIG.images.gridSquare[widgetSize];
  }

  // Grid sources pack rows with the tighter spacing token.
  headerSpacing() {
    return CONFIG.designTokens.compactSpacing;
  }

  rowSpacing() {
    return CONFIG.designTokens.compactSpacing;
  }

  // Square cover vs title (primary) + artist (secondary).
  rowHeight(sizes, widgetSize) {
    const cover = this.coverImageSize(widgetSize).height;
    return Math.max(
      cover,
      (sizes.fontSize.primary + sizes.fontSize.secondary) * 1.2,
    );
  }

  renderItem(stack, item, sizes, widgetSize = "medium") {
    const itemStack = stack.addStack();
    itemStack.layoutHorizontally();
    itemStack.centerAlignContent();

    // Cover image
    if (item.cover) {
      const imgSize = this.coverImageSize(widgetSize);
      const coverImg = itemStack.addImage(item.cover);
      coverImg.imageSize = new Size(imgSize.width, imgSize.height);
      coverImg.cornerRadius = imgSize.cornerRadius;
      itemStack.addSpacer(sizes.spacing);
    }

    // Text content
    const textStack = itemStack.addStack();
    textStack.layoutVertically();

    const titleRow = textStack.addStack();
    titleRow.layoutHorizontally();
    titleRow.centerAlignContent();

    const titleText = titleRow.addText(FormatUtils.truncate(item.title, 28));
    titleText.font = Font.semiboldSystemFont(sizes.fontSize.primary);
    titleText.textColor = CONFIG.colors.label;
    titleText.lineLimit = 1;

    titleRow.addSpacer(sizes.spacing);
    const { symbol, color } = BillboardDataSource.getTrend(
      item.position,
      item.metadata.last_week,
    );
    const indicator = titleRow.addImage(SFSymbol.named(symbol).image);
    indicator.imageSize = new Size(
      sizes.fontSize.tertiary,
      sizes.fontSize.tertiary,
    );
    indicator.tintColor = color;

    const subtitleParts = [item.subtitle];
    if (item.metadata.weeks) subtitleParts.push(`${item.metadata.weeks}w`);

    const subtitleText = textStack.addText(
      FormatUtils.truncate(subtitleParts.join(" · "), 32),
    );
    subtitleText.font = Font.systemFont(sizes.fontSize.secondary);
    subtitleText.textColor = CONFIG.colors.secondaryLabel;
    subtitleText.lineLimit = 1;

    itemStack.addSpacer();
  }
}

module.exports = { BillboardDataSource };
