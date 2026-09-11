const { CONFIG } = require("../config.js");

class CacheManager {
  static maxAgeHours = 48; // Maximum cache age for offline fallback
  static _fm = null;

  static getFileManager() {
    if (!this._fm) {
      try {
        this._fm = FileManager.iCloud();
      } catch {
        this._fm = FileManager.local();
      }
    }
    return this._fm;
  }

  static getCachePath(source) {
    const fm = this.getFileManager();
    const cacheDir = fm.joinPath(fm.documentsDirectory(), "widget-cache");
    if (!fm.fileExists(cacheDir)) {
      fm.createDirectory(cacheDir);
    }
    return { fm, path: fm.joinPath(cacheDir, `cache_${source}.json`) };
  }

  static save(source, data) {
    try {
      const { fm, path: cachePath } = this.getCachePath(source);

      const cacheData = {
        timestamp: Date.now(),
        data: data,
      };

      fm.writeString(cachePath, JSON.stringify(cacheData));
      console.log(`Cache saved for ${source}`);
    } catch (error) {
      console.error(`Failed to save cache for ${source}: ${error.message}`);
    }
  }

  static async load(source) {
    try {
      const { fm, path: cachePath } = this.getCachePath(source);

      if (!fm.fileExists(cachePath)) {
        return null;
      }

      // Ensure iCloud file is downloaded
      if (fm.isFileStoredIniCloud && fm.isFileStoredIniCloud(cachePath)) {
        await fm.downloadFileFromiCloud(cachePath);
      }

      const cacheContent = fm.readString(cachePath);
      const cacheData = JSON.parse(cacheContent);

      // Check if cache is within max age
      const ageHours = (Date.now() - cacheData.timestamp) / (1000 * 60 * 60);
      if (ageHours > this.maxAgeHours) {
        console.log(
          `Cache for ${source} expired (${ageHours.toFixed(1)}h old)`,
        );
        return null;
      }

      console.log(`Cache loaded for ${source} (${ageHours.toFixed(1)}h old)`);
      return {
        data: cacheData.data,
        isStale: ageHours > (CONFIG.sources[source]?.refreshHours || 1),
        ageHours: ageHours,
      };
    } catch (error) {
      console.error(`Failed to load cache for ${source}: ${error.message}`);
      return null;
    }
  }
}

module.exports = { CacheManager };
