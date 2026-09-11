const { CONFIG } = require("../config.js");
const { ImageCache } = require("../core/image-cache.js");
const { addTag, typography } = require("../design-system.js");

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
    titleText.lineLimit = 1;

    if (options.subtitle) {
      headerStack.addSpacer(sizes.spacing);
      const sub = headerStack.addText(options.subtitle);
      sub.font = Font.systemFont(sizes.fontSize.tertiary);
      sub.textColor = CONFIG.colors.secondaryLabel;
      sub.lineLimit = 1;
    }

    // Push the refresh time to the trailing edge of the header line.
    headerStack.addSpacer();
    this.addRefreshTime(headerStack, sizes);
  }

  // Last-refresh timestamp (and an offline glyph when serving from cache),
  // right-aligned in the header so it costs no extra vertical space.
  addRefreshTime(stack, sizes) {
    if (this.usingCache) {
      const offlineIcon = stack.addImage(SFSymbol.named("icloud.slash").image);
      offlineIcon.imageSize = new Size(
        sizes.fontSize.caption,
        sizes.fontSize.caption,
      );
      offlineIcon.tintColor = CONFIG.colors.warning;
      stack.addSpacer(CONFIG.designTokens.compactSpacing);
    }

    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");

    const timeText = stack.addText(`${hours}:${minutes}`);
    timeText.font = typography.caption(sizes);
    timeText.textColor = CONFIG.colors.tertiaryLabel;
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

  // --- Space budgeting ----------------------------------------------------
  // A ListWidget clips/ellipsizes once its intrinsic height exceeds the
  // family's drawable canvas, so each source only renders as many rows as fit.
  // Sources with taller rows (multi-line titles, avatar/poster rows) override
  // `rowHeight` to declare that.

  headerHeight(sizes) {
    const titleLine = sizes.fontSize.title * 1.2;
    return Math.max(sizes.iconSize, titleLine) + this.headerSpacing(sizes);
  }

  // Gap between the header and the item area (grid sources tighten it).
  headerSpacing(sizes) {
    return sizes.spacing;
  }

  // Gap between item rows (grid sources tighten it).
  rowSpacing(sizes) {
    return sizes.spacing;
  }

  // Leading thumbnail for a row. Portrait by default; sources whose art is a
  // different aspect (e.g. square album covers) return their own size.
  coverImageSize(widgetSize) {
    return CONFIG.images.gridTall[widgetSize];
  }

  // Vertical room left for the item area after widget padding and header.
  bodyHeight(sizes, widgetSize) {
    const canvas = CONFIG.widgetCanvas[widgetSize] || CONFIG.widgetCanvas.medium;
    return canvas.height - 2 * sizes.padding - this.headerHeight(sizes);
  }

  // Intrinsic minimum height of one row, in points.
  rowHeight(sizes) {
    return (sizes.fontSize.primary + sizes.fontSize.secondary) * 1.2;
  }

  maxItemsThatFit(sizes, widgetSize) {
    const body = this.bodyHeight(sizes, widgetSize);
    const row = this.rowHeight(sizes, widgetSize) + this.rowSpacing(sizes);
    return Math.max(1, Math.floor((body + this.rowSpacing(sizes)) / row));
  }

  renderItemList(stack, items, sizes, widgetSize = "medium") {
    const visible = items.slice(0, this.maxItemsThatFit(sizes, widgetSize));
    const gap = this.rowSpacing(sizes);

    visible.forEach((item, index) => {
      this.renderItem(stack, item, sizes, widgetSize);
      if (index < visible.length - 1) {
        stack.addSpacer(gap);
      }
    });
  }

  renderGrid(stack, items, sizes, widgetSize) {
    const columns =
      widgetSize === "small" ? 1 : widgetSize === "extraLarge" ? 3 : 2;
    const gap = this.rowSpacing(sizes);
    const visible = items.slice(
      0,
      this.maxItemsThatFit(sizes, widgetSize) * columns,
    );

    if (columns === 1) {
      const listStack = stack.addStack();
      listStack.layoutVertically();
      visible.forEach((item, index) => {
        this.renderItem(listStack, item, sizes, widgetSize);
        if (index < visible.length - 1) listStack.addSpacer(gap);
      });
      return;
    }

    const gridStack = stack.addStack();
    gridStack.layoutHorizontally();

    // Round-robin (row-major) column assignment instead of a contiguous split:
    // keeps both columns within one item of each other in height, and for
    // ranked lists (Billboard) reads top-to-bottom/left-to-right in rank order.
    for (let col = 0; col < columns; col++) {
      if (col > 0) gridStack.addSpacer(sizes.spacing * 2);

      const columnStack = gridStack.addStack();
      columnStack.layoutVertically();

      const colItems = visible.filter((_, i) => i % columns === col);
      colItems.forEach((item, i) => {
        this.renderItem(columnStack, item, sizes, widgetSize);
        if (i < colItems.length - 1) columnStack.addSpacer(gap);
      });
    }
  }
}

module.exports = { DataSource };
