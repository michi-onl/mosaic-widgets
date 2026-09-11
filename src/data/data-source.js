const { CONFIG } = require("../config.js");
const { ImageCache } = require("../core/image-cache.js");
const { addSeparator, addTag, typography } = require("../design-system.js");

class DataSource {
  constructor(config, apiClient) {
    this.config = config;
    this.api = apiClient;
  }

  async fetchData(widgetSize) {
    throw new Error("fetchData must be implemented by subclass");
  }

  isEmpty(data) {
    throw new Error("isEmpty must be implemented by subclass");
  }

  renderWidget(widget, data, widgetSize) {
    throw new Error("renderWidget must be implemented by subclass");
  }

  addHeader(widget, title, sizes, options = {}) {
    const headerStack = widget.addStack();
    headerStack.layoutHorizontally();
    headerStack.centerAlignContent();

    const icon = headerStack.addImage(SFSymbol.named(this.config.icon).image);
    icon.imageSize = new Size(sizes.iconSize, sizes.iconSize);
    icon.tintColor = this.config.color || CONFIG.colors.accent;

    headerStack.addSpacer(sizes.spacing);

    const titleText = headerStack.addText(title);
    titleText.font = typography.title(sizes);
    titleText.textColor = CONFIG.colors.label;

    if (options.subtitle) {
      headerStack.addSpacer(sizes.spacing);
      const sub = headerStack.addText(options.subtitle);
      sub.font = Font.systemFont(sizes.fontSize.tertiary);
      sub.textColor = CONFIG.colors.secondaryLabel;
    }
  }

  addBadge(parentStack, { text, icon, color, sizes }) {
    return addTag(parentStack, { text, icon, color, sizes });
  }

  addSourceBadge(stack, item, sizes) {
    const icons = this.constructor.sourceIcons || {};
    const colors = this.constructor.sourceColors || {};
    this.addBadge(stack, {
      icon: icons[item.source] || "questionmark.circle",
      color: colors[item.source] || CONFIG.colors.accent,
      sizes,
    });
  }

  static async preloadImages(items, urlKey, cacheKey) {
    await Promise.all(
      items.map(async (item) => {
        if (item[urlKey]) {
          item[cacheKey] = await ImageCache.load(item[urlKey]);
        }
      }),
    );
  }

  addCircularImage(stack, image, size) {
    const img = stack.addImage(image);
    img.imageSize = new Size(size, size);
    img.cornerRadius = size / 2;
  }

  renderItemList(
    stack,
    items,
    sizes,
    useSeparators = false,
    widgetSize = "medium",
  ) {
    items.forEach((item, index) => {
      this.renderItem(stack, item, sizes, widgetSize);
      if (index < items.length - 1) {
        stack.addSpacer(sizes.spacing);
        if (useSeparators) {
          addSeparator(stack);
          stack.addSpacer(sizes.spacing);
        }
      }
    });
  }

  renderGrid(stack, items, sizes, widgetSize) {
    if (widgetSize === "small") {
      const listStack = stack.addStack();
      listStack.layoutVertically();
      items.forEach((item, index) => {
        this.renderItem(listStack, item, sizes, widgetSize);
        if (index < items.length - 1) listStack.addSpacer(sizes.spacing);
      });
      return;
    }

    const columns = 2;

    const gridStack = stack.addStack();
    gridStack.layoutHorizontally();

    // Round-robin (row-major) column assignment instead of a contiguous split:
    // keeps both columns within one item of each other in height, and for
    // ranked lists (Billboard) reads top-to-bottom/left-to-right in rank order.
    for (let col = 0; col < columns; col++) {
      if (col > 0) gridStack.addSpacer(sizes.spacing * 2);

      const columnStack = gridStack.addStack();
      columnStack.layoutVertically();

      const colItems = items.filter((_, i) => i % columns === col);
      colItems.forEach((item, i) => {
        this.renderItem(columnStack, item, sizes, widgetSize);
        if (i < colItems.length - 1) columnStack.addSpacer(sizes.spacing);
      });
    }
  }
}

module.exports = { DataSource };
