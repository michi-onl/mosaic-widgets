const { CONFIG } = require("../config.js");
const { CacheManager } = require("./cache-manager.js");

class RefreshManager {
  static statsFile = "refresh_stats.json";

  static getStatsPath() {
    const fm = CacheManager.getFileManager();
    const cacheDir = fm.joinPath(fm.documentsDirectory(), "widget-cache");
    if (!fm.fileExists(cacheDir)) fm.createDirectory(cacheDir);
    return { fm, path: fm.joinPath(cacheDir, this.statsFile) };
  }

  static loadStats() {
    try {
      const { fm, path } = this.getStatsPath();
      if (!fm.fileExists(path)) return {};
      return JSON.parse(fm.readString(path));
    } catch {
      return {};
    }
  }

  static saveStats(stats) {
    try {
      const { fm, path } = this.getStatsPath();
      fm.writeString(path, JSON.stringify(stats));
    } catch {
      /* ignore */
    }
  }

  static recordSuccess(source) {
    const stats = this.loadStats();
    stats[source] = {
      lastFetchTime: Date.now(),
      consecutiveErrors: 0,
    };
    this.saveStats(stats);
  }

  static recordError(source) {
    const stats = this.loadStats();
    const prev = stats[source] || {};
    stats[source] = {
      lastFetchTime: prev.lastFetchTime || null,
      consecutiveErrors: (prev.consecutiveErrors || 0) + 1,
    };
    this.saveStats(stats);
  }

  static getRefreshInterval(source) {
    const baseHours = CONFIG.sources[source]?.refreshHours || 1;
    const baseMs = baseHours * 60 * 60 * 1000;
    const stats = this.loadStats();
    const sourceStats = stats[source];

    if (!sourceStats || !sourceStats.consecutiveErrors) {
      return baseMs;
    }

    // Exponential backoff: 2^errors, capped at 8x
    const multiplier = Math.min(Math.pow(2, sourceStats.consecutiveErrors), 8);
    const maxMs = 48 * 60 * 60 * 1000;
    return Math.min(baseMs * multiplier, maxMs);
  }
}

module.exports = { RefreshManager };
