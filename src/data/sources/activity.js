const { CONFIG } = require("../../config.js");
const { FormatUtils } = require("../../core/format-utils.js");
const { DataSource } = require("../data-source.js");
const { GitHubDataSource } = require("./github.js");
const { WikipediaDataSource } = require("./wikipedia.js");

class ActivityDataSource extends DataSource {
  static sourceIcons = {
    github: "chevron.left.forwardslash.chevron.right",
    wikipedia: "book.fill",
  };

  static sourceColors = {
    github: new Color("#6e5494"),
    wikipedia: new Color("#636466"),
  };

  isEmpty(data) {
    return !data.items || data.items.length === 0;
  }

  async fetchData(widgetSize) {
    const limit = CONFIG.sizing[widgetSize].maxItems;
    const githubConfig = CONFIG.sources.github;
    const wikiConfig = CONFIG.sources.wikipedia;

    const fetches = [];

    if (githubConfig) {
      const githubSource = new GitHubDataSource(githubConfig, this.api);
      fetches.push(
        githubSource
          .fetchReleases(widgetSize)
          .then((releases) =>
            releases.map((r) => ({
              source: "github",
              key: `${r.repo}:${r.tagName}`,
              title: `${r.repo} ${r.tagName}${r.isPrerelease ? " (pre)" : ""}`,
              detail: `${r.author} • ${r.timeAgo}`,
              url: r.url || "",
            })),
          )
          .catch(() => []),
      );
    }

    if (wikiConfig) {
      const wikiSource = new WikipediaDataSource(wikiConfig, this.api);
      fetches.push(
        wikiSource
          .fetchData(widgetSize)
          .then((data) =>
            (data.edits || []).map((e) => ({
              source: "wikipedia",
              key: `${e.language}:${e.title}`,
              title: e.title,
              detail:
                e.comment && e.comment !== "N/A"
                  ? e.comment
                  : `${e.user} • ${e.timeAgo}`,
              url: e.url || "",
            })),
          )
          .catch(() => []),
      );
    }

    const results = await Promise.all(fetches);
    return { items: results.flat().slice(0, limit) };
  }

  renderWidget(widget, data, widgetSize) {
    const sizes = CONFIG.sizing[widgetSize];

    this.addHeader(widget, "Activity", sizes);
    widget.addSpacer(sizes.spacing);

    const contentStack = widget.addStack();
    contentStack.layoutVertically();

    this.renderItemList(contentStack, data.items, sizes, widgetSize);
  }

  // Title (primary) + detail line (tertiary).
  rowHeight(sizes) {
    return (sizes.fontSize.primary + sizes.fontSize.tertiary) * 1.2;
  }

  renderItem(stack, item, sizes, widgetSize) {
    const itemStack = stack.addStack();
    itemStack.layoutHorizontally();
    itemStack.centerAlignContent();

    if (item.url) itemStack.url = item.url;

    this.addSourceBadge(itemStack, item, sizes);
    itemStack.addSpacer(sizes.spacing);

    const textStack = itemStack.addStack();
    textStack.layoutVertically();

    const titleText = textStack.addText(FormatUtils.truncate(item.title, 45));
    titleText.font = Font.semiboldSystemFont(sizes.fontSize.primary);
    titleText.textColor = CONFIG.colors.label;
    titleText.lineLimit = 1;

    const metaText = textStack.addText(item.detail);
    metaText.font = Font.systemFont(sizes.fontSize.tertiary);
    metaText.textColor = CONFIG.colors.tertiaryLabel;
    metaText.lineLimit = 1;
  }
}

module.exports = { ActivityDataSource };
