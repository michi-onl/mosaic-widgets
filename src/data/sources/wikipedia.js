const { CONFIG } = require("../../config.js");
const { FormatUtils } = require("../../core/format-utils.js");
const { DataSource } = require("../data-source.js");

class WikipediaDataSource extends DataSource {
  isEmpty(data) {
    return !data.edits || data.edits.length === 0;
  }

  async fetchData(widgetSize) {
    const body = {
      usernames: this.config.usernames,
      tokens: this.config.tokens,
      languages: this.config.languages,
      hours: this.config.hours || 72,
      limit: Math.min(
        this.config.limit || Infinity,
        CONFIG.sizing[widgetSize].maxItems,
      ),
    };

    // Use POST method as required by the API
    const response = await this.api.post(this.config.endpoint, body);

    // Safely handle response
    if (!response || !Array.isArray(response.edits)) {
      return { edits: [], errors: null };
    }

    return {
      edits: response.edits.map((edit) => ({
        title: FormatUtils.truncate(edit.title, 40),
        language: edit.language,
        user: edit.creator,
        timeAgo: edit.timeAgo,
        comment: FormatUtils.truncate(
          FormatUtils.stripHtml(edit.description || ""),
          60,
        ),
        url: edit.link,
      })),
      errors: response.errors || null,
    };
  }

  renderWidget(widget, data, widgetSize) {
    const sizes = CONFIG.sizing[widgetSize];

    this.addHeader(widget, "Recent Edits", sizes);

    // Show error indicator if some languages failed
    if (data.errors && data.errors.length > 0) {
      const errorStack = widget.addStack();
      errorStack.layoutHorizontally();
      errorStack.centerAlignContent();

      const warnIcon = errorStack.addImage(
        SFSymbol.named("exclamationmark.triangle.fill").image,
      );
      warnIcon.imageSize = new Size(
        sizes.fontSize.tertiary,
        sizes.fontSize.tertiary,
      );
      warnIcon.tintColor = CONFIG.colors.warning;

      errorStack.addSpacer(3);

      const errLangs = data.errors.map((e) => e.language).join(", ");
      const errText = errorStack.addText(`Failed: ${errLangs}`);
      errText.font = Font.systemFont(sizes.fontSize.tertiary);
      errText.textColor = CONFIG.colors.warning;
    }

    widget.addSpacer(sizes.spacing);

    const contentStack = widget.addStack();
    contentStack.layoutVertically();

    this.renderItemList(contentStack, data.edits, sizes, true, widgetSize);
  }

  renderItem(stack, edit, sizes, widgetSize) {
    const itemStack = stack.addStack();
    itemStack.layoutHorizontally();
    itemStack.centerAlignContent();

    if (edit.url) itemStack.url = edit.url;

    this.addBadge(itemStack, { text: edit.language, sizes });
    itemStack.addSpacer(sizes.spacing);

    const textStack = itemStack.addStack();
    textStack.layoutVertically();

    const titleText = textStack.addText(FormatUtils.truncate(edit.title, 40));
    titleText.font = Font.semiboldSystemFont(sizes.fontSize.primary);
    titleText.textColor = CONFIG.colors.label;
    titleText.lineLimit = 1;

    if (edit.comment && edit.comment !== "N/A") {
      const commentText = textStack.addText(edit.comment);
      commentText.font = Font.systemFont(sizes.fontSize.secondary);
      commentText.textColor = CONFIG.colors.secondaryLabel;
      commentText.lineLimit = 1;
    }

    const userText = textStack.addText(edit.user);
    userText.font = Font.mediumSystemFont(sizes.fontSize.secondary);
    userText.textColor = CONFIG.colors.secondaryLabel;
    userText.lineLimit = 1;

    const timeText = textStack.addText(edit.timeAgo);
    timeText.font = Font.systemFont(sizes.fontSize.tertiary);
    timeText.textColor = CONFIG.colors.tertiaryLabel;
    timeText.lineLimit = 1;
  }
}

module.exports = { WikipediaDataSource };
