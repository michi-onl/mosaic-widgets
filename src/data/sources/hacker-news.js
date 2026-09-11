const { CONFIG } = require("../../config.js");
const { FormatUtils } = require("../../core/format-utils.js");
const { DataSource } = require("../data-source.js");

class HackerNewsDataSource extends DataSource {
  isEmpty(data) {
    return !data.stories || data.stories.length === 0;
  }

  async fetchData(widgetSize) {
    const response = await this.api.fetch(this.config.endpoint);

    const limit = CONFIG.sizing[widgetSize].maxItems;

    // API returns stories array with different field names
    return {
      stories: response.stories.slice(0, limit).map((story) => ({
        title: story.title,
        points: story.points,
        comments: story.numComments,
        author: story.author,
        timeAgo: story.timePosted,
        url: story.url,
        domain: story.domain || "",
        hnUrl: story.hnUrl || "",
      })),
    };
  }

  renderWidget(widget, data, widgetSize) {
    const sizes = CONFIG.sizing[widgetSize];

    this.addHeader(widget, "Hacker News", sizes);
    widget.addSpacer(sizes.spacing);

    const contentStack = widget.addStack();
    contentStack.layoutVertically();
    this.renderItemList(contentStack, data.stories, sizes, widgetSize);
  }

  // Title (primary) + points/comments line (tertiary).
  rowHeight(sizes) {
    return (sizes.fontSize.primary + sizes.fontSize.tertiary) * 1.2;
  }

  renderItem(stack, story, sizes, widgetSize) {
    const itemStack = stack.addStack();
    itemStack.layoutHorizontally();
    itemStack.centerAlignContent();

    if (story.hnUrl) itemStack.url = story.hnUrl;

    const textStack = itemStack.addStack();
    textStack.layoutVertically();

    const titleText = textStack.addText(FormatUtils.truncate(story.title, 60));
    titleText.font = Font.semiboldSystemFont(sizes.fontSize.primary);
    titleText.textColor = CONFIG.colors.label;
    titleText.lineLimit = 1;

    const metaText = textStack.addText(
      `${story.points}pts · ${story.comments}cmt`,
    );
    metaText.font = Font.systemFont(sizes.fontSize.tertiary);
    metaText.textColor = CONFIG.colors.tertiaryLabel;
    metaText.lineLimit = 1;

    itemStack.addSpacer();
  }
}

module.exports = { HackerNewsDataSource };
