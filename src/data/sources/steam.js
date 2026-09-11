const { CONFIG } = require("../../config.js");
const { FormatUtils } = require("../../core/format-utils.js");
const { DataSource } = require("../data-source.js");

class SteamDataSource extends DataSource {
  isEmpty(data) {
    return !data.games || data.games.length === 0;
  }

  async fetchData(widgetSize) {
    if (!this.config.profiles || this.config.profiles.length === 0) {
      throw new Error("Set steam profiles in CONFIG");
    }
    const profiles = this.config.profiles.join(",");
    const response = await this.api.fetch(this.config.endpoint, { profiles });

    const limit = CONFIG.sizing[widgetSize].maxItems;
    const allGames = [];

    for (const userData of Object.values(response)) {
      if (userData.recentGames) {
        userData.recentGames.forEach((game) => {
          allGames.push({
            name: game.name,
            hoursPlayed: game.hoursPlayedNumeric || 0,
            lastPlayedShort: game.lastPlayedShort,
            iconUrl: game.iconUrl || null,
            storeUrl: game.storeUrl || "",
          });
        });
      }
    }

    allGames.sort((a, b) => b.hoursPlayed - a.hoursPlayed);

    const games = allGames.slice(0, limit);
    await DataSource.preloadImages(games, "iconUrl", "icon");

    return {
      games: games,
    };
  }

  renderWidget(widget, data, widgetSize) {
    const sizes = CONFIG.sizing[widgetSize];

    this.addHeader(widget, "Recently Played", sizes);
    widget.addSpacer(sizes.spacing);

    const contentStack = widget.addStack();
    contentStack.layoutVertically();
    this.renderItemList(contentStack, data.games, sizes, widgetSize);
  }

  renderItem(stack, game, sizes, widgetSize = "medium") {
    const itemStack = stack.addStack();
    itemStack.layoutHorizontally();
    itemStack.centerAlignContent();

    if (game.storeUrl) {
      itemStack.url = game.storeUrl;
    }

    if (game.icon) {
      const imgSize = CONFIG.images.grid[widgetSize];
      const iconImg = itemStack.addImage(game.icon);
      iconImg.imageSize = new Size(imgSize.width, imgSize.height);
      iconImg.cornerRadius = imgSize.cornerRadius;
    } else {
      const imgSize = CONFIG.images.grid[widgetSize];
      const icon = itemStack.addImage(
        SFSymbol.named("gamecontroller.fill").image,
      );
      icon.imageSize = new Size(imgSize.width, imgSize.height);
      icon.tintColor = CONFIG.colors.secondaryLabel;
    }

    itemStack.addSpacer(sizes.spacing);

    const textStack = itemStack.addStack();
    textStack.layoutVertically();

    const titleText = textStack.addText(FormatUtils.truncate(game.name, 35));
    titleText.font = Font.semiboldSystemFont(sizes.fontSize.primary);
    titleText.textColor = CONFIG.colors.label;
    titleText.lineLimit = 1;

    const metaText = textStack.addText(
      `${FormatUtils.formatDuration(game.hoursPlayed)} • ${
        game.lastPlayedShort
      }`,
    );
    metaText.font = Font.systemFont(sizes.fontSize.secondary);
    metaText.textColor = CONFIG.colors.secondaryLabel;

    itemStack.addSpacer();
  }
}

module.exports = { SteamDataSource };
