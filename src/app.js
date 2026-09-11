const { CONFIG } = require("./config.js");
const { APIClient } = require("./core/api-client.js");
const { CacheManager } = require("./core/cache-manager.js");
const { RefreshManager } = require("./core/refresh-manager.js");
const { ConfigManager } = require("./core/config-manager.js");
const { DataSourceFactory } = require("./data/data-source-factory.js");

class Mosaic {
  constructor() {
    this.sourceName = args.widgetParameter || CONFIG.defaultSource;
  }

  async run() {
    const widgetSize = config.widgetFamily || "medium";
    try {
      // Load iCloud config before creating API client and data source
      await ConfigManager.load();

      if (!config.runsInWidget) {
        const picked = await this.showSourcePicker();
        if (picked === null) {
          Script.complete();
          return;
        }
        this.sourceName = picked;
      }

      // Created after the picker so an API token entered via the setup UI is used immediately
      this.apiClient = new APIClient(CONFIG.apiBaseUrl, CONFIG.apiToken);

      this.dataSource = DataSourceFactory.create(
        this.sourceName,
        this.apiClient,
      );

      const widget = await this.createWidget(widgetSize);

      if (config.runsInWidget) {
        Script.setWidget(widget);
      } else {
        await this.presentWidget(widget, widgetSize);
      }

      Script.complete();
    } catch (error) {
      console.error("Widget error:", error);
      const errorWidget = this.createErrorWidget(error.message, widgetSize);
      Script.setWidget(errorWidget);
      Script.complete();
    }
  }

  async showSourcePicker() {
    const sourceNames = Object.keys(CONFIG.sources);
    const alert = new Alert();
    alert.title = "Mosaic";
    alert.message = "Choose a source to preview or configure.";

    alert.addAction("API Token ⚙️");
    for (const name of sourceNames) {
      const src = CONFIG.sources[name];
      const hasFields = ConfigManager.getEditableFields(name).length > 0;
      alert.addAction(`${src.name}${hasFields ? " ⚙️" : ""}`);
    }
    alert.addCancelAction("Cancel");

    const choice = await alert.presentAlert();
    if (choice === -1) return null;

    if (choice === 0) {
      await ConfigManager.showApiTokenSetupUI();
      return this.showSourcePicker();
    }

    const chosen = sourceNames[choice - 1];

    const editableFields = ConfigManager.getEditableFields(chosen);
    if (editableFields.length > 0) {
      const actionAlert = new Alert();
      actionAlert.title = CONFIG.sources[chosen].name;
      actionAlert.addAction("Show Widget");
      actionAlert.addAction("Configure");
      actionAlert.addCancelAction("Cancel");

      const action = await actionAlert.presentAlert();
      if (action === -1) return null;
      if (action === 1) {
        await ConfigManager.showSetupUI(chosen);
      }
    }

    return chosen;
  }

  async createWidget(widgetSize) {
    const widget = new ListWidget();
    const sizes = CONFIG.sizing[widgetSize];

    // Configure widget appearance
    widget.setPadding(
      sizes.padding,
      sizes.padding,
      sizes.padding,
      sizes.padding,
    );

    // Set refresh interval using smart scheduling (backoff on errors)
    const refreshMs = RefreshManager.getRefreshInterval(this.sourceName);
    const refreshDate = new Date(Date.now() + refreshMs);
    widget.refreshAfterDate = refreshDate;

    // Set URL scheme if available
    if (this.dataSource.config.urlScheme) {
      widget.url = this.dataSource.config.urlScheme;
    }

    let data = null;
    let usingCache = false;

    try {
      data = await this.dataSource.fetchData(widgetSize);
      RefreshManager.recordSuccess(this.sourceName);

      if (data) {
        await CacheManager.save(this.sourceName, data);
      }
    } catch (error) {
      console.error("Data fetch error:", error);
      RefreshManager.recordError(this.sourceName);

      // Try to load from cache on failure
      const cached = await CacheManager.load(this.sourceName);
      if (cached) {
        data = cached.data;
        usingCache = true;
        console.log(`Using cached data (${cached.ageHours.toFixed(1)}h old)`);
      } else {
        return this.createErrorWidget(error.message, widgetSize);
      }
    }

    if (!data || this.dataSource.isEmpty(data)) {
      return this.createErrorWidget("No data available", widgetSize);
    }

    this.dataSource.renderWidget(widget, data, widgetSize);

    this.addFooter(widget, sizes, usingCache, widgetSize);

    return widget;
  }

  createErrorWidget(message, widgetSize = "medium") {
    const widget = new ListWidget();
    const sizes = CONFIG.sizing[widgetSize];
    const iconSizes = { small: 24, medium: 32, large: 40 };

    widget.setPadding(
      sizes.padding,
      sizes.padding,
      sizes.padding,
      sizes.padding,
    );

    widget.url = "scriptable://run?name=" + encodeURIComponent(Script.name());

    const stack = widget.addStack();
    stack.layoutVertically();
    stack.centerAlignContent();

    const icon = stack.addImage(
      SFSymbol.named("exclamationmark.triangle").image,
    );
    const iconSize = iconSizes[widgetSize] || 32;
    icon.imageSize = new Size(iconSize, iconSize);
    icon.tintColor = CONFIG.colors.warning;

    stack.addSpacer(sizes.spacing);

    const sourceName = this.sourceName || "Widget";
    const msg = message.toLowerCase();
    let errorType = "Error";
    if (msg.includes("timeout") || msg.includes("timed out"))
      errorType = "Timeout";
    else if (msg.includes("401") || msg.includes("403"))
      errorType = "Auth Error";
    else if (msg.includes("429")) errorType = "Rate Limited";
    else if (msg.includes("network") || msg.includes("connect"))
      errorType = "Network Error";
    const errorText = stack.addText(`${sourceName} ${errorType}`);
    errorText.font = Font.boldSystemFont(sizes.fontSize.primary);
    errorText.textColor = CONFIG.colors.primary;
    errorText.centerAlignText();

    if (widgetSize !== "small") {
      stack.addSpacer(CONFIG.designTokens.compactSpacing);

      const messageText = stack.addText(message);
      messageText.font = Font.systemFont(sizes.fontSize.tertiary);
      messageText.textColor = CONFIG.colors.secondary;
      messageText.centerAlignText();
    }

    stack.addSpacer(
      widgetSize === "small"
        ? CONFIG.designTokens.compactSpacing
        : sizes.spacing,
    );

    const hintText = stack.addText(CONFIG.messages.tapRetry);
    hintText.font = Font.systemFont(sizes.fontSize.tertiary);
    hintText.textColor = CONFIG.colors.tertiary;
    hintText.centerAlignText();

    return widget;
  }

  addFooter(widget, sizes, usingCache = false, widgetSize = "large") {
    widget.addSpacer();

    // Hairline separator
    const sep = widget.addStack();
    sep.size = new Size(0, 0.5);
    sep.backgroundColor = CONFIG.colors.tertiary;
    widget.addSpacer(CONFIG.designTokens.compactSpacing);

    const footer = widget.addStack();
    footer.layoutHorizontally();
    footer.centerAlignContent();

    const updateTime = new Date();
    const hours = updateTime.getHours().toString().padStart(2, "0");
    const minutes = updateTime.getMinutes().toString().padStart(2, "0");
    const prefix = widgetSize === "large" ? "Updated " : "";
    const timeString = `${prefix}${hours}:${minutes}`;

    const timeText = footer.addText(timeString);
    timeText.font = Font.systemFont(sizes.fontSize.caption);
    timeText.textColor = CONFIG.colors.tertiary;

    if (usingCache && widgetSize !== "small") {
      footer.addSpacer();

      const offlineIcon = footer.addImage(SFSymbol.named("icloud.slash").image);
      offlineIcon.imageSize = new Size(
        sizes.fontSize.caption,
        sizes.fontSize.caption,
      );
      offlineIcon.tintColor = CONFIG.colors.warning;

      if (widgetSize === "large") {
        footer.addSpacer(CONFIG.designTokens.compactSpacing);
        const offlineText = footer.addText(CONFIG.messages.offline);
        offlineText.font = Font.systemFont(sizes.fontSize.caption);
        offlineText.textColor = CONFIG.colors.warning;
      }
    }
  }

  async presentWidget(widget, widgetSize) {
    const presentMap = {
      small: () => widget.presentSmall(),
      medium: () => widget.presentMedium(),
      large: () => widget.presentLarge(),
    };

    const presentFunc = presentMap[widgetSize];
    if (presentFunc) {
      await presentFunc();
    }
  }
}

module.exports = { Mosaic };
