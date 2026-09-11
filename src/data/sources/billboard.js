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
    if (lastWeek === 0) return { char: "★", color: CONFIG.colors.new };
    if (current < lastWeek) return { char: "↑", color: CONFIG.colors.up };
    if (current > lastWeek) return { char: "↓", color: CONFIG.colors.down };
    return { char: "−", color: CONFIG.colors.unchanged };
  }

  renderWidget(widget, data, widgetSize) {
    const sizes = CONFIG.sizing[widgetSize];

    this.addHeader(widget, data.title, sizes);
    widget.addSpacer(sizes.spacing);

    const contentStack = widget.addStack();
    this.renderGrid(contentStack, data.items, sizes, widgetSize);
  }

  renderItem(stack, item, sizes, widgetSize = "medium") {
    const itemStack = stack.addStack();
    itemStack.layoutHorizontally();
    itemStack.centerAlignContent();

    // Cover image
    if (item.cover) {
      const imgSize = CONFIG.images.gridTall[widgetSize];
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
    titleText.font = Font.boldSystemFont(sizes.fontSize.primary);
    titleText.textColor = CONFIG.colors.primary;
    titleText.lineLimit = 1;

    titleRow.addSpacer(sizes.spacing);
    const { char, color } = BillboardDataSource.getTrend(
      item.position,
      item.metadata.last_week,
    );
    const indicatorText = titleRow.addText(char);
    indicatorText.font = Font.systemFont(sizes.fontSize.secondary);
    indicatorText.textColor = color;

    const subtitleText = textStack.addText(
      FormatUtils.truncate(item.subtitle, 30),
    );
    subtitleText.font = Font.systemFont(sizes.fontSize.secondary);
    subtitleText.textColor = CONFIG.colors.secondary;
    subtitleText.lineLimit = 1;

    if (item.metadata.weeks) {
      const metaText = textStack.addText(
        FormatUtils.pluralize(item.metadata.weeks, "week"),
      );
      metaText.font = Font.systemFont(sizes.fontSize.tertiary);
      metaText.textColor = CONFIG.colors.tertiary;
    }

    itemStack.addSpacer();
  }
}

module.exports = { BillboardDataSource };
