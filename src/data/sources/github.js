const { CONFIG } = require("../../config.js");
const { FormatUtils } = require("../../core/format-utils.js");
const { DataSource } = require("../data-source.js");

class GitHubDataSource extends DataSource {
  isEmpty(data) {
    return !data.releases || data.releases.length === 0;
  }

  async fetchData(widgetSize) {
    const releases = await this.fetchReleases(widgetSize);
    await DataSource.preloadImages(releases, "authorAvatarUrl", "authorAvatar");
    return { releases };
  }

  async fetchReleases(widgetSize) {
    if (!this.config.repos || this.config.repos.length === 0) {
      throw new Error("Set github repos in CONFIG");
    }
    const repos = this.config.repos.join(",");
    const response = await this.api.fetch(this.config.endpoint, { repos });
    const limit = CONFIG.sizing[widgetSize].maxItems;

    if (!response || !Array.isArray(response.releases)) return [];

    return response.releases.slice(0, limit).map((release) => ({
      repo: this.extractRepoName(release.repo),
      releaseName: release.name || "",
      tagName: release.tagName,
      timeAgo: release.timeAgo,
      author: release.author,
      authorAvatarUrl: release.authorAvatarUrl || null,
      isPrerelease: release.isPrerelease,
      url: release.url || "",
      authorAvatar: null,
    }));
  }

  extractRepoName(repoString) {
    if (repoString.includes("/")) {
      return repoString.split("/").pop();
    }
    return repoString;
  }

  renderWidget(widget, data, widgetSize) {
    const sizes = CONFIG.sizing[widgetSize];
    this.addHeader(widget, "Recent Releases", sizes);
    widget.addSpacer(sizes.spacing);

    const contentStack = widget.addStack();
    contentStack.layoutVertically();

    this.renderItemList(contentStack, data.releases, sizes, true, widgetSize);
  }

  renderItem(stack, item, sizes, widgetSize) {
    const itemStack = stack.addStack();
    itemStack.layoutHorizontally();
    itemStack.centerAlignContent();

    if (item.url) itemStack.url = item.url;

    if (item.authorAvatar) {
      this.addCircularImage(itemStack, item.authorAvatar, sizes.iconSize);
      itemStack.addSpacer(sizes.spacing);
    }

    const textStack = itemStack.addStack();
    textStack.layoutVertically();

    const titleRow = textStack.addStack();
    titleRow.layoutHorizontally();
    titleRow.centerAlignContent();

    const titleText = titleRow.addText(FormatUtils.truncate(item.tagName, 40));
    titleText.font = Font.boldSystemFont(sizes.fontSize.primary);
    titleText.textColor = CONFIG.colors.primary;
    titleText.lineLimit = 1;

    if (item.isPrerelease) {
      titleRow.addSpacer(4);
      const preText = titleRow.addText("pre-release");
      preText.font = Font.systemFont(sizes.fontSize.tertiary);
      preText.textColor = CONFIG.colors.warning;
    }

    const repoText = textStack.addText(item.repo);
    repoText.font = Font.mediumSystemFont(sizes.fontSize.secondary);
    repoText.textColor = CONFIG.colors.secondary;
    repoText.lineLimit = 1;

    const metaText = textStack.addText(`${item.author} · ${item.timeAgo}`);
    metaText.font = Font.systemFont(sizes.fontSize.tertiary);
    metaText.textColor = CONFIG.colors.tertiary;
    metaText.lineLimit = 1;
  }
}

module.exports = { GitHubDataSource };
