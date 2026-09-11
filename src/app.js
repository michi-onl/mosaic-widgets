const { CONFIG } = require("./config.js");
const { APIClient } = require("./core/api-client.js");
const { CacheManager } = require("./core/cache-manager.js");
const { RefreshManager } = require("./core/refresh-manager.js");
const { ConfigManager } = require("./core/config-manager.js");
const { DataSourceFactory } = require("./data/data-source-factory.js");
const { pickSource } = require("./ui/source-picker.js");
const {
  createErrorWidget,
  presentWidget,
} = require("./ui/widget-chrome.js");

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
        const picked = await pickSource();
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
        await presentWidget(widget, widgetSize);
      }

      Script.complete();
    } catch (error) {
      console.error("Widget error:", error);
      Script.setWidget(
        createErrorWidget(error.message, widgetSize, this.sourceName),
      );
      Script.complete();
    }
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
        return createErrorWidget(error.message, widgetSize, this.sourceName);
      }
    }

    if (!data || this.dataSource.isEmpty(data)) {
      return createErrorWidget("No data available", widgetSize, this.sourceName);
    }

    this.dataSource.usingCache = usingCache;
    this.dataSource.renderWidget(widget, data, widgetSize);

    return widget;
  }
}

module.exports = { Mosaic };
