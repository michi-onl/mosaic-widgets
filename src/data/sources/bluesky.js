const { CONFIG } = require("../../config.js");
const { APIClient } = require("../../core/api-client.js");
const { FormatUtils } = require("../../core/format-utils.js");
const { DataSource } = require("../data-source.js");

class BlueskyDataSource extends DataSource {
  async fetchData(widgetSize) {
    const handle = this.config.handle;
    if (!handle) {
      throw new Error("Set bluesky handle in CONFIG");
    }

    const sizes = CONFIG.sizing[widgetSize];
    const limit = sizes.maxItems;

    const bskyApi = new APIClient(
      `https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=${encodeURIComponent(handle)}&limit=${limit}&filter=posts_no_replies`,
    );
    const response = await bskyApi.fetch("");

    if (!response || !response.feed) {
      return { posts: [] };
    }

    const posts = response.feed.map((item) => {
      const post = item.post;
      return {
        text: post.record?.text || "",
        author: post.author?.displayName || post.author?.handle || "",
        handle: post.author?.handle || "",
        avatarUrl: post.author?.avatar || null,
        avatar: null,
        createdAt: post.record?.createdAt || post.indexedAt,
        likes: post.likeCount || 0,
        reposts: post.repostCount || 0,
        replies: post.replyCount || 0,
        url: `https://bsky.app/profile/${post.author?.handle}/post/${post.uri?.split("/").pop()}`,
        isRepost: !!item.reason,
      };
    });

    await DataSource.preloadImages(posts, "avatarUrl", "avatar");

    return { posts };
  }

  isEmpty(data) {
    return !data || !data.posts || data.posts.length === 0;
  }

  renderWidget(widget, data, widgetSize) {
    const sizes = CONFIG.sizing[widgetSize];

    this.addHeader(widget, "Bluesky", sizes);
    widget.addSpacer(sizes.spacing);

    const contentStack = widget.addStack();
    contentStack.layoutVertically();

    this.renderItemList(contentStack, data.posts, sizes, widgetSize);
  }

  // Up to two lines of post text (lineLimit 2) + author + meta lines.
  rowHeight(sizes) {
    return (
      (2 * sizes.fontSize.primary +
        sizes.fontSize.secondary +
        sizes.fontSize.tertiary) *
      1.2
    );
  }

  renderItem(stack, item, sizes, widgetSize) {
    const itemStack = stack.addStack();
    itemStack.layoutHorizontally();
    itemStack.centerAlignContent();

    if (item.url) itemStack.url = item.url;

    if (item.avatar) {
      this.addCircularImage(itemStack, item.avatar, sizes.iconSize);
      itemStack.addSpacer(sizes.spacing);
    }

    const textStack = itemStack.addStack();
    textStack.layoutVertically();

    const titleText = textStack.addText(FormatUtils.truncate(item.text, 60));
    titleText.font = Font.semiboldSystemFont(sizes.fontSize.primary);
    titleText.textColor = CONFIG.colors.label;
    titleText.lineLimit = 2;

    const authorText = textStack.addText(item.author);
    authorText.font = Font.mediumSystemFont(sizes.fontSize.secondary);
    authorText.textColor = CONFIG.colors.secondaryLabel;
    authorText.lineLimit = 1;

    const metaText = textStack.addText(
      `${item.likes} likes · ${item.replies} replies`,
    );
    metaText.font = Font.systemFont(sizes.fontSize.tertiary);
    metaText.textColor = CONFIG.colors.tertiaryLabel;
    metaText.lineLimit = 1;
  }
}

module.exports = { BlueskyDataSource };
