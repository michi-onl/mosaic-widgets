const { CONFIG } = require("../../config.js");
const { APIClient } = require("../../core/api-client.js");
const { ImageCache } = require("../../core/image-cache.js");
const { FormatUtils } = require("../../core/format-utils.js");
const { DataSource } = require("../data-source.js");

class BooksDataSource extends DataSource {
  isEmpty(data) {
    return !data.title;
  }

  async fetchData(widgetSize) {
    const isbn = this.isbn || this.config.defaultIsbn;
    if (!isbn) {
      throw new Error("Set defaultIsbn in CONFIG or use books:<isbn>");
    }
    const booksApi = new APIClient(this.config.apiUrl);
    const response = await booksApi.fetch(isbn);

    if (!response || response.totalItems === 0) {
      return {};
    }

    const book = response.items[0].volumeInfo;
    const thumbnailUrl = book.imageLinks ? book.imageLinks.thumbnail : null;

    const data = {
      title: book.title || "Unknown Title",
      authors: book.authors ? book.authors.join(", ") : "Unknown Author",
      publisher: book.publisher || "Unknown Publisher",
      publishedDate: book.publishedDate || "Unknown Date",
      pageCount: book.pageCount || "Unknown",
      categories: book.categories
        ? book.categories.join(", ")
        : "Uncategorized",
      maturityRating:
        CONFIG.maturityMap[book.maturityRating] || book.maturityRating,
      language: CONFIG.languageMap[book.language] || book.language,
    };

    // Pre-load images in parallel; skip goodreadsIcon on small widget where it isn't shown
    const [coverImage, goodreadsIcon] = await Promise.all([
      thumbnailUrl ? ImageCache.load(thumbnailUrl) : Promise.resolve(null),
      widgetSize !== "small"
        ? ImageCache.load(this.config.goodreadsIconUrl)
        : Promise.resolve(null),
    ]);
    data.coverImage = coverImage;
    data.goodreadsIcon = goodreadsIcon;

    return data;
  }

  renderWidget(widget, data, widgetSize) {
    const sizes = CONFIG.sizing[widgetSize];

    this.addHeader(widget, "Currently Reading", sizes);
    widget.addSpacer(sizes.spacing);

    const bodyStack = widget.addStack();
    bodyStack.layoutHorizontally();

    // Book cover (left-aligned on every size; the small widget's cover is just smaller)
    if (data.coverImage) {
      const coverStack = bodyStack.addStack();
      coverStack.layoutVertically();
      coverStack.centerAlignContent();

      const cover = coverStack.addImage(data.coverImage);
      cover.cornerRadius = CONFIG.designTokens.cornerRadius.cover;
      cover.centerAlignImage();

      const imgSize = CONFIG.images.card[widgetSize];
      cover.imageSize = new Size(imgSize.width, imgSize.height);

      bodyStack.addSpacer(sizes.spacing * 2);
    }

    // Book info
    const infoStack = bodyStack.addStack();
    infoStack.layoutVertically();
    infoStack.addSpacer();

    const titleText = infoStack.addText(FormatUtils.truncate(data.title, 40));
    titleText.font = Font.semiboldSystemFont(sizes.fontSize.primary);
    titleText.textColor = CONFIG.colors.label;
    titleText.lineLimit =
      widgetSize === "large" || widgetSize === "extraLarge" ? 2 : 1;

    const authorsText = infoStack.addText(data.authors);
    authorsText.font = Font.mediumSystemFont(sizes.fontSize.secondary);
    authorsText.textColor = CONFIG.colors.secondaryLabel;
    authorsText.lineLimit = 1;

    if (widgetSize !== "small") {
      infoStack.addSpacer(sizes.spacing);

      const detailText = infoStack.addText(
        `${data.pageCount} pages · ${data.publisher}, ${data.publishedDate}`,
      );
      detailText.font = Font.systemFont(sizes.fontSize.tertiary);
      detailText.textColor = CONFIG.colors.tertiaryLabel;
      detailText.lineLimit = 1;

      const metaText = infoStack.addText(
        `${data.categories} · ${data.language}`,
      );
      metaText.font = Font.systemFont(sizes.fontSize.tertiary);
      metaText.textColor = CONFIG.colors.tertiaryLabel;
      metaText.lineLimit = 1;
    }

    infoStack.addSpacer();
    bodyStack.addSpacer();

    // Goodreads icon (medium and large)
    if (widgetSize !== "small" && data.goodreadsIcon) {
      const iconStack = bodyStack.addStack();
      iconStack.layoutVertically();
      iconStack.centerAlignContent();

      const icon = iconStack.addImage(data.goodreadsIcon);
      icon.cornerRadius = CONFIG.designTokens.cornerRadius.cover;
      icon.centerAlignImage();
      icon.imageSize = new Size(25, 25);
      icon.url = "goodreads://";
    }
  }
}

module.exports = { BooksDataSource };
