// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-blue; icon-glyph: chart-line;

/**
 * Mosaic
 * Author: Michael Wagner, michi.onl
 *
 * A comprehensive Scriptable widget displaying data from multiple sources
 * Supported sources: billboard, imdb, steam, hackernews, github, wikipedia, timeline, books, bookmarks, dhbw-timetable
 *
 * Configuration: Set widget parameter to source name (e.g., "billboard")
 * Timeline supports category filters: "timeline:contributions", "timeline:media"
 * Books supports ISBN parameter: "books" or "books:9780099518471"
 * Bookmarks supports tag filter: "bookmarks" or "bookmarks:dev"
 * or leave empty to use defaultSource from CONFIG
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  // Default settings
  defaultSource: "billboard",
  apiBaseUrl: "https://api.michi.onl/api",
  apiToken: "", // Set via in-app "API Token" setup UI; stored in Keychain

  // Widget sizing configuration
  sizing: {
    small: {
      maxItems: 4,
      fontSize: { primary: 12, secondary: 10, tertiary: 9, caption: 8 },
      iconSize: 14,
      spacing: 5,
      padding: 14,
    },
    medium: {
      maxItems: 4,
      fontSize: { primary: 14, secondary: 12, tertiary: 10, caption: 9 },
      iconSize: 16,
      spacing: 8,
      padding: 16,
    },
    large: {
      maxItems: 12,
      fontSize: { primary: 16, secondary: 13, tertiary: 11, caption: 10 },
      iconSize: 18,
      spacing: 10,
      padding: 18,
    },
  },

  // Standardized image sizes per layout template
  images: {
    grid: {
      small: { width: 32, height: 32, cornerRadius: 4 },
      medium: { width: 40, height: 40, cornerRadius: 4 },
      large: { width: 48, height: 48, cornerRadius: 6 },
    },
    gridTall: {
      small: { width: 28, height: 42, cornerRadius: 4 },
      medium: { width: 36, height: 54, cornerRadius: 4 },
      large: { width: 44, height: 66, cornerRadius: 6 },
    },
    card: {
      small: { width: 40, height: 60, cornerRadius: 6 },
      medium: { width: 60, height: 90, cornerRadius: 6 },
      large: { width: 80, height: 120, cornerRadius: 8 },
    },
  },

  // Color scheme following iOS system design
  colors: {
    // Dynamic colors that adapt to light/dark mode
    primary: Color.dynamic(new Color("#000000"), new Color("#FFFFFF")),
    secondary: Color.dynamic(new Color("#8E8E93"), new Color("#8E8E93")),
    secondaryBright: Color.dynamic(new Color("#8E8E93"), new Color("#AEAEB2")),
    tertiary: Color.dynamic(new Color("#C7C7CC"), new Color("#636366")),

    // Semantic colors
    accent: new Color("#007AFF"),
    warning: new Color("#FF9500"),

    // Status indicators
    new: new Color("#FF9500"),
    up: new Color("#34C759"),
    down: new Color("#FF3B30"),
    unchanged: Color.dynamic(new Color("#8E8E93"), new Color("#636366")),

    sunset: new Color("#FF6B35"),
    golden: new Color("#FFD700"),
    white: Color.white(),

    // Steam status indicators (moved from SteamDataSource.statusColors)
    steamStatus: {
      online: new Color("#34C759"),
      "in-game": new Color("#34C759"),
      offline: new Color("#8E8E93"),
      private: new Color("#FF9500"),
    },

    dhbwTypes: {
      Vorlesung: new Color("#007AFF"),
      Übung: new Color("#34C759"),
      Labor: new Color("#FF9500"),
      Praktikum: new Color("#FF9500"),
      Seminar: new Color("#AF52DE"),
      Tutorium: new Color("#5856D6"),
      Klausur: new Color("#FF3B30"),
      Prüfung: new Color("#FF3B30"),
    },
  },

  // Shared design tokens for badges, radii, and spacing
  designTokens: {
    cornerRadius: { badge: 4, icon: 3, cover: 6 },
    badge: { paddingV: 2, paddingH: 4 },
    compactSpacing: 4,
  },

  messages: {
    offline: "Offline",
    tapRetry: "Tap to try again",
  },

  // Source-specific configuration
  sources: {
    billboard: {
      name: "Billboard 200",
      endpoint: "/billboard-200",
      icon: "chart.bar.fill",
      refreshHours: 24,
      urlScheme: "https://www.billboard.com/charts/billboard-200/",
    },
    imdb: {
      name: "IMDb Popular",
      endpoint: "/imdb",
      icon: "tv.fill",
      refreshHours: 12,
      urlScheme: "imdb://",
    },
    steam: {
      name: "Steam Games",
      endpoint: "/steam-profiles",
      icon: "gamecontroller.fill",
      refreshHours: 6,
      urlScheme: "steam://",
      profiles: [], // Set via widget-config.json
    },
    hackernews: {
      name: "Hacker News",
      endpoint: "/hackernews",
      icon: "newspaper.fill",
      refreshHours: 1,
      urlScheme: "https://news.ycombinator.com/",
    },
    github: {
      name: "GitHub Releases",
      endpoint: "/github-releases",
      icon: "arrow.down.circle",
      refreshHours: 6,
      urlScheme: "https://github.com/",
      repos: [], // Set via widget-config.json
    },
    wikipedia: {
      name: "Wikipedia Edits",
      endpoint: "/wikipedia-watchlist",
      icon: "book.fill",
      refreshHours: 2,
      urlScheme: "https://wikipedia.org/",
      limit: 10,
      hours: 72,
    },
    timeline: {
      name: "Timeline",
      endpoint: "/timeline",
      icon: "clock.arrow.circlepath",
      refreshHours: 1,
      urlScheme: "https://www.michi.onl/",
    },
    bookmarks: {
      name: "Bookmarks",
      endpoint: "/bookmarks",
      icon: "bookmark.fill",
      refreshHours: 1,
      urlScheme: "https://linkding.michi.onl/",
    },
    "dhbw-timetable": {
      name: "DHBW Timetable",
      endpoint: "/dhbw-timetable",
      icon: "calendar.badge.clock",
      refreshHours: 1,
    },
    astronomy: {
      name: "Astronomy",
      icon: "moon.stars.fill",
      refreshHours: 1,
      urlScheme: "weather://",
    },
    bluesky: {
      name: "Bluesky",
      icon: "bubble.left.fill",
      refreshHours: 1,
      urlScheme: "https://bsky.app/",
    },
    activity: {
      name: "Activity",
      endpoint: "",
      icon: "bolt.fill",
      refreshHours: 1,
      urlScheme: "",
    },
    statusboard: {
      name: "Status Board",
      icon: "square.grid.2x2.fill",
      refreshHours: 1,
      urlScheme: "",
    },
    books: {
      name: "Currently Reading",
      icon: "book.fill",
      refreshHours: 24,
      urlScheme: "goodreads://",
      apiUrl: "https://www.googleapis.com/books/v1/volumes?q=isbn:",
      goodreadsIconUrl:
        "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/42/d8/cd/42d8cdbf-48df-d1b6-ade9-d972bac7f371/PolarisAppIcon-0-0-1x_U007epad-0-1-0-85-220.png/1024x1024bb.jpg",
    },
  },

  // Language display mapping for books
  languageMap: {
    es: "Spanish 🇪🇸",
    en: "English 🇺🇸",
    de: "German 🇩🇪",
    fr: "French 🇫🇷",
    it: "Italian 🇮🇹",
    pt: "Portuguese 🇧🇷",
    ja: "Japanese 🇯🇵",
  },

  maturityMap: {
    NOT_MATURE: "4+",
    MATURE: "18+",
  },
};

// ============================================================================
// UTILITY CLASSES
// ============================================================================

class APIClient {
  constructor(baseUrl, token = "") {
    this.baseUrl = baseUrl;
    this.token = token;
    this.timeout = 10; // 10 seconds, matching API timeout
  }

  async fetch(endpoint, params = {}) {
    if (this.token) params.token = this.token;
    const url = this.buildUrl(endpoint, params);
    console.log(`Fetching: ${endpoint}`);

    const request = new Request(url);
    request.timeoutInterval = this.timeout;

    try {
      const response = await request.loadJSON();
      console.log(`Success: ${endpoint}`);
      return response;
    } catch (error) {
      console.error(`API Error for ${endpoint}: ${error.message}`);
      console.error(`URL was: ${endpoint}`);
      throw new Error(`Failed to fetch from ${endpoint}: ${error.message}`);
    }
  }

  async post(endpoint, body = {}) {
    const params = this.token ? { token: this.token } : {};
    const url = this.buildUrl(endpoint, params);
    console.log(`POST: ${endpoint}`);

    const request = new Request(url);
    request.method = "POST";
    request.timeoutInterval = this.timeout;
    request.headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };

    request.body = this.encodeParams(body);

    try {
      const response = await request.loadJSON();
      console.log(`Success: ${endpoint}`);
      return response;
    } catch (error) {
      console.error(`API Error for ${endpoint}: ${error.message}`);
      throw new Error(`Failed to POST to ${endpoint}: ${error.message}`);
    }
  }

  encodeParams(params) {
    return Object.entries(params)
      .filter(([, value]) => value !== null && value !== undefined)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
      )
      .join("&");
  }

  buildUrl(endpoint, params) {
    let url = this.baseUrl + endpoint;
    // Filter out empty values to avoid appending ?token= to external APIs
    const filtered = Object.fromEntries(
      Object.entries(params).filter(
        ([, v]) => v !== "" && v !== null && v !== undefined,
      ),
    );
    if (Object.keys(filtered).length === 0) return url;
    const separator = url.includes("?") ? "&" : "?";
    return url + separator + this.encodeParams(filtered);
  }
}

class ImageCache {
  static cache = {};
  static timeout = 5; // 5 seconds for image loading

  static async load(url) {
    if (!url) return null;

    if (this.cache[url]) {
      return this.cache[url];
    }

    try {
      const request = new Request(url);
      request.timeoutInterval = this.timeout;
      const image = await request.loadImage();
      this.cache[url] = image;
      return image;
    } catch (error) {
      console.error(`Failed to load image: ${url}`);
      return null;
    }
  }
}

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

class ConfigManager {
  static configFile = "widget-config.json";
  static keychainTokenKey = "mosaic_api_token";
  static _loaded = false;

  static getConfigPath() {
    const fm = CacheManager.getFileManager();
    return { fm, path: fm.joinPath(fm.documentsDirectory(), this.configFile) };
  }

  static async load() {
    if (this._loaded) return;
    this._loaded = true;

    // API token lives in Keychain, not the iCloud-synced JSON file
    try {
      if (Keychain.contains(this.keychainTokenKey)) {
        CONFIG.apiToken = Keychain.get(this.keychainTokenKey);
      }
    } catch (error) {
      console.error(
        `Failed to load API token from Keychain: ${error.message}`,
      );
    }

    try {
      const { fm, path } = this.getConfigPath();
      if (!fm.fileExists(path)) return;

      if (fm.isFileStoredIniCloud && fm.isFileStoredIniCloud(path)) {
        await fm.downloadFileFromiCloud(path);
      }

      const content = fm.readString(path);
      const saved = JSON.parse(content);

      if (!saved) return;

      // Migrate a legacy plaintext apiToken out of the synced JSON into Keychain
      if (saved.apiToken) {
        if (!CONFIG.apiToken) this.setApiToken(saved.apiToken);
        delete saved.apiToken;
        fm.writeString(path, JSON.stringify(saved, null, 2));
      }

      if (!saved.sources) return;

      // Deep merge saved config into CONFIG.sources
      for (const [sourceName, sourceConfig] of Object.entries(saved.sources)) {
        if (CONFIG.sources[sourceName]) {
          Object.assign(CONFIG.sources[sourceName], sourceConfig);
        }
      }

      console.log("iCloud config loaded and merged");
    } catch (error) {
      console.error(`Failed to load iCloud config: ${error.message}`);
    }
  }

  static save(sourceOverrides) {
    try {
      const { fm, path } = this.getConfigPath();
      let existing = { version: 1, lastModified: 0, sources: {} };

      if (fm.fileExists(path)) {
        try {
          existing = JSON.parse(fm.readString(path));
        } catch {
          /* start fresh */
        }
      }

      // Merge new overrides into existing saved config
      for (const [sourceName, sourceConfig] of Object.entries(
        sourceOverrides,
      )) {
        existing.sources[sourceName] = {
          ...(existing.sources[sourceName] || {}),
          ...sourceConfig,
        };
      }

      existing.version = 1;
      existing.lastModified = Date.now();

      fm.writeString(path, JSON.stringify(existing, null, 2));
      console.log("iCloud config saved");
    } catch (error) {
      console.error(`Failed to save iCloud config: ${error.message}`);
    }
  }

  static setApiToken(token) {
    try {
      if (token) {
        Keychain.set(this.keychainTokenKey, token);
      } else if (Keychain.contains(this.keychainTokenKey)) {
        Keychain.remove(this.keychainTokenKey);
      }
      CONFIG.apiToken = token || "";
    } catch (error) {
      console.error(`Failed to save API token to Keychain: ${error.message}`);
    }
  }

  static async showApiTokenSetupUI() {
    const alert = new Alert();
    alert.title = "API Token";
    alert.message =
      "Used to authenticate with api.michi.onl. Stored in Keychain, not synced via iCloud.";
    alert.addTextField("API Token", CONFIG.apiToken || "");
    alert.addAction("Save");
    alert.addCancelAction("Cancel");

    const result = await alert.presentAlert();
    if (result === -1) return false;

    this.setApiToken(alert.textFieldValue(0).trim());
    return true;
  }

  static async showSetupUI(sourceName) {
    const config = CONFIG.sources[sourceName];
    if (!config) return false;

    const alert = new Alert();
    alert.title = `Configure ${config.name}`;

    const editableFields = this.getEditableFields(sourceName);
    if (editableFields.length === 0) {
      alert.message = "No configurable settings for this source.";
      alert.addAction("OK");
      await alert.presentAlert();
      return false;
    }

    alert.message =
      "Edit settings below. Changes sync across devices via iCloud.";
    for (const field of editableFields) {
      const currentValue = config[field.key];
      const displayValue = Array.isArray(currentValue)
        ? currentValue.join(", ")
        : currentValue || "";
      alert.addTextField(field.label, displayValue);
    }

    alert.addAction("Save");
    alert.addCancelAction("Cancel");

    const result = await alert.presentAlert();
    if (result === -1) return false;

    const overrides = {};
    editableFields.forEach((field, index) => {
      const value = alert.textFieldValue(index);
      if (field.isArray) {
        overrides[field.key] = value
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      } else {
        overrides[field.key] = value;
      }
    });

    this.save({ [sourceName]: overrides });

    // Apply immediately to current CONFIG
    Object.assign(CONFIG.sources[sourceName], overrides);
    return true;
  }

  static getEditableFields(sourceName) {
    const fieldMap = {
      steam: [
        {
          key: "profiles",
          label: "Steam profiles (comma-separated)",
          isArray: true,
        },
      ],
      github: [
        {
          key: "repos",
          label: "Repos: owner/repo (comma-separated)",
          isArray: true,
        },
      ],
      bluesky: [{ key: "handle", label: "Bluesky handle" }],
      astronomy: [
        { key: "latitude", label: "Latitude" },
        { key: "longitude", label: "Longitude" },
      ],
      statusboard: [
        {
          key: "boardSources",
          label: "Sources (comma-separated)",
          isArray: true,
        },
      ],
      books: [{ key: "defaultIsbn", label: "Default ISBN" }],
      wikipedia: [
        { key: "usernames", label: "Username" },
        { key: "tokens", label: "Watchlist token" },
        { key: "languages", label: "Languages (e.g. en,de)" },
      ],
    };
    return fieldMap[sourceName] || [];
  }
}

class FormatUtils {
  static truncate(text, maxLength) {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 1) + "…";
  }

  static formatNumber(num) {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  }

  static formatTimeAgo(dateString) {
    if (!dateString) return "Unknown";

    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) return "Unknown";

    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 0) return "Just now";

    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval}${unit.charAt(0)} ago`;
      }
    }

    return "Just now";
  }

  static formatDuration(hours) {
    if (hours < 1) {
      return `${Math.round(hours * 60)}m`;
    }
    return `${hours.toFixed(1)}h`;
  }

  static pluralize(count, singular, plural) {
    return count === 1
      ? `${count} ${singular}`
      : `${count} ${plural || singular + "s"}`;
  }

  static formatTime(value) {
    if (!value) return "";
    if (value instanceof Date) {
      return `${value.getHours().toString().padStart(2, "0")}:${value.getMinutes().toString().padStart(2, "0")}`;
    }
    if (typeof value === "string") {
      if (value.includes("T")) {
        const time = value.split("T")[1] || value;
        if (time.length >= 5) return time.slice(0, 5);
      }
      if (value.length >= 5) return value.slice(0, 5);
    }
    return String(value);
  }

  static formatDateLabel(dateStr, today, tomorrow) {
    const d = new Date(dateStr + "T00:00:00");
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dMid = new Date(d);
    dMid.setHours(0, 0, 0, 0);
    if (today && dMid.getTime() === today.getTime()) return "Today";
    if (tomorrow && dMid.getTime() === tomorrow.getTime()) return "Tomorrow";
    return `${dayNames[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}`;
  }

  static cleanTitle(title) {
    if (!title) return "";
    return title
      .replace(/\[feat\. .*?\]/gi, "")
      .replace(/\(.*?\)/gi, "")
      .trim();
  }

  static stripHtml(html) {
    if (!html) return "";
    return html
      .replace(/<[^>]*>/g, "")
      .replace(/&[^;]+;/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }
}

// ============================================================================
// DATA SOURCE IMPLEMENTATIONS
// ============================================================================

class DataSource {
  constructor(config, apiClient) {
    this.config = config;
    this.api = apiClient;
  }

  async fetchData(widgetSize) {
    throw new Error("fetchData must be implemented by subclass");
  }

  isEmpty(data) {
    throw new Error("isEmpty must be implemented by subclass");
  }

  renderWidget(widget, data, widgetSize) {
    throw new Error("renderWidget must be implemented by subclass");
  }

  addHeader(widget, title, sizes, options = {}) {
    const headerStack = widget.addStack();
    headerStack.layoutHorizontally();
    headerStack.centerAlignContent();

    const icon = headerStack.addImage(SFSymbol.named(this.config.icon).image);
    icon.imageSize = new Size(sizes.iconSize, sizes.iconSize);
    icon.tintColor = CONFIG.colors.accent;

    headerStack.addSpacer(sizes.spacing);

    const titleText = headerStack.addText(title);
    titleText.font = Font.boldSystemFont(sizes.fontSize.primary);
    titleText.textColor = CONFIG.colors.primary;

    if (options.subtitle) {
      headerStack.addSpacer(sizes.spacing);
      const sub = headerStack.addText(options.subtitle);
      sub.font = Font.systemFont(sizes.fontSize.tertiary);
      sub.textColor = CONFIG.colors.secondary;
    }
  }

  addBadge(parentStack, { text, icon, color, sizes }) {
    const badge = parentStack.addStack();
    badge.backgroundColor = color || CONFIG.colors.accent;
    badge.cornerRadius = CONFIG.designTokens.cornerRadius.badge;
    badge.setPadding(
      CONFIG.designTokens.badge.paddingV,
      CONFIG.designTokens.badge.paddingH,
      CONFIG.designTokens.badge.paddingV,
      CONFIG.designTokens.badge.paddingH,
    );

    if (icon) {
      const img = badge.addImage(SFSymbol.named(icon).image);
      img.imageSize = new Size(
        sizes.fontSize.tertiary,
        sizes.fontSize.tertiary,
      );
      img.tintColor = CONFIG.colors.white;
    } else {
      const label = badge.addText(text);
      label.font = Font.mediumSystemFont(sizes.fontSize.tertiary);
      label.textColor = CONFIG.colors.white;
    }

    return badge;
  }

  addSourceBadge(stack, item, sizes) {
    const icons = this.constructor.sourceIcons || {};
    const colors = this.constructor.sourceColors || {};
    this.addBadge(stack, {
      icon: icons[item.source] || "questionmark.circle",
      color: colors[item.source] || CONFIG.colors.accent,
      sizes,
    });
  }

  static async preloadImages(items, urlKey, cacheKey) {
    await Promise.all(
      items.map(async (item) => {
        if (item[urlKey]) {
          item[cacheKey] = await ImageCache.load(item[urlKey]);
        }
      }),
    );
  }

  addCircularImage(stack, image, size) {
    const img = stack.addImage(image);
    img.imageSize = new Size(size, size);
    img.cornerRadius = size / 2;
  }

  renderItemList(
    stack,
    items,
    sizes,
    useSeparators = false,
    widgetSize = "medium",
  ) {
    items.forEach((item, index) => {
      this.renderItem(stack, item, sizes, widgetSize);
      if (index < items.length - 1) {
        stack.addSpacer(sizes.spacing);
        if (useSeparators) {
          const sep = stack.addStack();
          sep.addSpacer();
          const line = sep.addStack();
          line.size = new Size(0, 0.5);
          line.backgroundColor = CONFIG.colors.tertiary;
          sep.addSpacer();
          stack.addSpacer(sizes.spacing);
        }
      }
    });
  }

  renderGrid(stack, items, sizes, widgetSize) {
    if (widgetSize === "small") {
      const listStack = stack.addStack();
      listStack.layoutVertically();
      items.forEach((item, index) => {
        this.renderItem(listStack, item, sizes, widgetSize);
        if (index < items.length - 1) listStack.addSpacer(sizes.spacing);
      });
      return;
    }

    const columns = 2;
    const itemsPerColumn = Math.ceil(items.length / columns);

    const gridStack = stack.addStack();
    gridStack.layoutHorizontally();

    for (let col = 0; col < columns; col++) {
      if (col > 0) gridStack.addSpacer(sizes.spacing * 2);

      const columnStack = gridStack.addStack();
      columnStack.layoutVertically();

      const start = col * itemsPerColumn;
      const end = Math.min(start + itemsPerColumn, items.length);

      for (let i = start; i < end; i++) {
        this.renderItem(columnStack, items[i], sizes, widgetSize);
        if (i < end - 1) columnStack.addSpacer(sizes.spacing);
      }
    }
  }
}

class BillboardDataSource extends DataSource {
  isEmpty(data) {
    return !data.items || data.items.length === 0;
  }

  async fetchData(widgetSize) {
    const response = await this.api.fetch(this.config.endpoint);

    if (!response.music?.data) {
      throw new Error("Invalid Billboard data structure");
    }

    const limit = CONFIG.sizing[widgetSize].maxItems;
    const items = response.music.data.slice(0, limit).map((item) => ({
      position: item.position,
      title: FormatUtils.cleanTitle(item.title),
      subtitle: item.artist,
      coverUrl: item.cover || null,
      metadata: {
        last_week: item.last_week,
        peak: item.peak,
        weeks: item.weeks,
      },
    }));

    await DataSource.preloadImages(items, "coverUrl", "cover");

    return {
      title: response.music.data_title || "Billboard 200",
      subtitle: response.music.data_desc || "",
      items,
    };
  }

  static getTrend(current, lastWeek) {
    if (lastWeek === 0) return { char: "★", color: CONFIG.colors.new };
    if (current < lastWeek) return { char: "↑", color: CONFIG.colors.up };
    if (current > lastWeek) return { char: "↓", color: CONFIG.colors.down };
    return { char: "−", color: CONFIG.colors.unchanged };
  }

  renderWidget(widget, data, widgetSize) {
    const sizes = CONFIG.sizing[widgetSize];

    this.addHeader(widget, data.title, sizes);
    widget.addSpacer(sizes.spacing);

    const contentStack = widget.addStack();
    this.renderGrid(contentStack, data.items, sizes, widgetSize);
  }

  renderItem(stack, item, sizes, widgetSize = "medium") {
    const itemStack = stack.addStack();
    itemStack.layoutHorizontally();
    itemStack.centerAlignContent();

    // Cover image
    if (item.cover) {
      const imgSize = CONFIG.images.gridTall[widgetSize];
      const coverImg = itemStack.addImage(item.cover);
      coverImg.imageSize = new Size(imgSize.width, imgSize.height);
      coverImg.cornerRadius = imgSize.cornerRadius;
      itemStack.addSpacer(sizes.spacing);
    }

    // Text content
    const textStack = itemStack.addStack();
    textStack.layoutVertically();

    const titleRow = textStack.addStack();
    titleRow.layoutHorizontally();
    titleRow.centerAlignContent();

    const titleText = titleRow.addText(FormatUtils.truncate(item.title, 28));
    titleText.font = Font.boldSystemFont(sizes.fontSize.primary);
    titleText.textColor = CONFIG.colors.primary;
    titleText.lineLimit = 1;

    titleRow.addSpacer(sizes.spacing);
    const { char, color } = BillboardDataSource.getTrend(
      item.position,
      item.metadata.last_week,
    );
    const indicatorText = titleRow.addText(char);
    indicatorText.font = Font.systemFont(sizes.fontSize.secondary);
    indicatorText.textColor = color;

    const subtitleText = textStack.addText(
      FormatUtils.truncate(item.subtitle, 30),
    );
    subtitleText.font = Font.systemFont(sizes.fontSize.secondary);
    subtitleText.textColor = CONFIG.colors.secondary;
    subtitleText.lineLimit = 1;

    if (item.metadata.weeks) {
      const metaText = textStack.addText(
        FormatUtils.pluralize(item.metadata.weeks, "week"),
      );
      metaText.font = Font.systemFont(sizes.fontSize.tertiary);
      metaText.textColor = CONFIG.colors.tertiary;
    }

    itemStack.addSpacer();
  }
}

class IMDbDataSource extends DataSource {
  isEmpty(data) {
    return (
      (!data.movies || data.movies.length === 0) &&
      (!data.tvShows || data.tvShows.length === 0)
    );
  }

  async fetchData(widgetSize) {
    const response = await this.api.fetch(this.config.endpoint);

    const limit = CONFIG.sizing[widgetSize].maxItems;
    const half = Math.ceil(limit / 2);

    const movies =
      response.movies?.data && Array.isArray(response.movies.data)
        ? response.movies.data
            .slice(0, half)
            .map((m) => this.formatItem(m, "movie"))
        : [];
    const tvShows =
      widgetSize !== "small" &&
      response.tv_shows?.data &&
      Array.isArray(response.tv_shows.data)
        ? response.tv_shows.data
            .slice(0, half)
            .map((t) => this.formatItem(t, "tv"))
        : [];

    await DataSource.preloadImages(
      [...movies, ...tvShows],
      "imageUrl",
      "poster",
    );

    return {
      movies: movies,
      tvShows: tvShows,
    };
  }

  formatItem(item, type) {
    const subtitleParts = [];
    if (item.year) subtitleParts.push(item.year);
    if (item.length) subtitleParts.push(item.length);
    return {
      title: FormatUtils.truncate(item.title, 30),
      subtitle: subtitleParts.join(" • "),
      rating: item.rating,
      genre: item.genre || "",
      url: item.href || "",
      type: type,
      imageUrl: item.image || null,
      poster: null,
    };
  }

  renderWidget(widget, data, widgetSize) {
    const sizes = CONFIG.sizing[widgetSize];

    this.addHeader(widget, "Popular on IMDb", sizes, {
      subtitle: "Movies · TV",
    });
    widget.addSpacer(sizes.spacing);

    const allItems = [
      ...data.movies.map((m) => ({ ...m, type: "movie" })),
      ...data.tvShows.map((t) => ({ ...t, type: "tv" })),
    ].slice(0, sizes.maxItems);

    const contentStack = widget.addStack();
    this.renderGrid(contentStack, allItems, sizes, widgetSize);
  }

  renderItem(stack, item, sizes, widgetSize = "medium") {
    const itemStack = stack.addStack();
    itemStack.layoutHorizontally();
    itemStack.centerAlignContent();

    if (item.url) itemStack.url = item.url;

    if (item.poster) {
      const imgSize = CONFIG.images.gridTall[widgetSize];
      const coverImg = itemStack.addImage(item.poster);
      coverImg.imageSize = new Size(imgSize.width, imgSize.height);
      coverImg.cornerRadius = imgSize.cornerRadius;
      itemStack.addSpacer(sizes.spacing);
    }

    const textStack = itemStack.addStack();
    textStack.layoutVertically();

    const titleText = textStack.addText(FormatUtils.truncate(item.title, 30));
    titleText.font = Font.boldSystemFont(sizes.fontSize.primary);
    titleText.textColor = CONFIG.colors.primary;
    titleText.lineLimit = 1;

    const metaText = textStack.addText(item.subtitle);
    metaText.font = Font.systemFont(sizes.fontSize.secondary);
    metaText.textColor = CONFIG.colors.secondary;
    metaText.lineLimit = 1;

    const badgeStack = textStack.addStack();
    badgeStack.addSpacer(2);
    this.addBadge(badgeStack, {
      text: item.rating === "" ? "NEW" : String(item.rating ?? ""),
      sizes,
    });
  }
}

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
    this.renderItemList(contentStack, data.games, sizes, false, widgetSize);
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
      icon.tintColor = CONFIG.colors.secondary;
    }

    itemStack.addSpacer(sizes.spacing);

    const textStack = itemStack.addStack();
    textStack.layoutVertically();

    const titleText = textStack.addText(FormatUtils.truncate(game.name, 35));
    titleText.font = Font.boldSystemFont(sizes.fontSize.primary);
    titleText.textColor = CONFIG.colors.primary;
    titleText.lineLimit = 1;

    const metaText = textStack.addText(
      `${FormatUtils.formatDuration(game.hoursPlayed)} • ${
        game.lastPlayedShort
      }`,
    );
    metaText.font = Font.systemFont(sizes.fontSize.secondary);
    metaText.textColor = CONFIG.colors.secondary;

    itemStack.addSpacer();
  }
}

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
    this.renderItemList(contentStack, data.stories, sizes, false, widgetSize);
  }

  renderItem(stack, story, sizes, widgetSize) {
    const itemStack = stack.addStack();
    itemStack.layoutHorizontally();
    itemStack.centerAlignContent();

    if (story.hnUrl) itemStack.url = story.hnUrl;

    const textStack = itemStack.addStack();
    textStack.layoutVertically();

    const titleText = textStack.addText(FormatUtils.truncate(story.title, 60));
    titleText.font = Font.boldSystemFont(sizes.fontSize.primary);
    titleText.textColor = CONFIG.colors.primary;
    titleText.lineLimit = 1;

    const metaText = textStack.addText(
      `${story.points}pts · ${story.comments}cmt`,
    );
    metaText.font = Font.systemFont(sizes.fontSize.tertiary);
    metaText.textColor = CONFIG.colors.tertiary;
    metaText.lineLimit = 1;

    itemStack.addSpacer();
  }
}

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
    titleText.font = Font.boldSystemFont(sizes.fontSize.primary);
    titleText.textColor = CONFIG.colors.primary;
    titleText.lineLimit = 1;

    if (edit.comment && edit.comment !== "N/A") {
      const commentText = textStack.addText(edit.comment);
      commentText.font = Font.systemFont(sizes.fontSize.secondary);
      commentText.textColor = CONFIG.colors.secondary;
      commentText.lineLimit = 1;
    }

    const userText = textStack.addText(edit.user);
    userText.font = Font.mediumSystemFont(sizes.fontSize.secondary);
    userText.textColor = CONFIG.colors.secondary;
    userText.lineLimit = 1;

    const timeText = textStack.addText(edit.timeAgo);
    timeText.font = Font.systemFont(sizes.fontSize.tertiary);
    timeText.textColor = CONFIG.colors.tertiary;
    timeText.lineLimit = 1;
  }
}

class TimelineDataSource extends DataSource {
  static sourceIcons = {
    github: "chevron.left.forwardslash.chevron.right",
    wikipedia: "book.fill",
    blog: "doc.text.fill",
    gallery: "photo.fill",
    imdb: "film.fill",
  };

  static sourceColors = {
    github: new Color("#6e5494"),
    wikipedia: new Color("#636466"),
    blog: new Color("#007AFF"),
    gallery: new Color("#34C759"),
    imdb: new Color("#F5C518"),
  };

  isEmpty(data) {
    return !data.events || data.events.length === 0;
  }

  async fetchData(widgetSize) {
    const params = this.category ? { category: this.category } : {};
    const response = await this.api.fetch(this.config.endpoint, params);

    const timelineLimits = { small: 4, medium: 4, large: 8 };
    const limit =
      timelineLimits[widgetSize] ?? CONFIG.sizing[widgetSize].maxItems;

    if (!response || !Array.isArray(response)) {
      return { events: [] };
    }

    return {
      events: response.slice(0, limit).map((item) => ({
        title: item.title,
        source: item.source,
        date: item.date,
        url: item.url,
      })),
    };
  }

  renderWidget(widget, data, widgetSize) {
    const sizes = CONFIG.sizing[widgetSize];

    const headerOptions = this.category ? { subtitle: this.category } : {};
    this.addHeader(widget, "Timeline", sizes, headerOptions);
    widget.addSpacer(sizes.spacing);

    const contentStack = widget.addStack();
    contentStack.layoutVertically();

    this.renderItemList(contentStack, data.events, sizes, true, widgetSize);
  }

  renderItem(stack, event, sizes, widgetSize) {
    const itemStack = stack.addStack();
    itemStack.layoutHorizontally();
    itemStack.centerAlignContent();

    if (event.url) {
      itemStack.url = event.url;
    }

    this.addSourceBadge(itemStack, event, sizes);
    itemStack.addSpacer(sizes.spacing);

    const textStack = itemStack.addStack();
    textStack.layoutVertically();

    const titleText = textStack.addText(event.title);
    titleText.font = Font.boldSystemFont(sizes.fontSize.primary);
    titleText.textColor = CONFIG.colors.primary;
    titleText.lineLimit = 2;

    const timeText = textStack.addText(FormatUtils.formatTimeAgo(event.date));
    timeText.font = Font.systemFont(sizes.fontSize.tertiary);
    timeText.textColor = CONFIG.colors.secondary;

    itemStack.addSpacer();
  }
}

class BookmarksDataSource extends DataSource {
  isEmpty(data) {
    return !data.bookmarks || data.bookmarks.length === 0;
  }

  async fetchData(widgetSize) {
    const response = await this.api.fetch(this.config.endpoint);

    if (!response || !Array.isArray(response.bookmarks)) {
      return { bookmarks: [] };
    }

    let bookmarks = response.bookmarks;
    if (this.category) {
      const tag = this.category.toLowerCase();
      bookmarks = bookmarks.filter(
        (b) =>
          Array.isArray(b.tags) && b.tags.some((t) => t.toLowerCase() === tag),
      );
    }

    const limit = CONFIG.sizing[widgetSize].maxItems;

    return {
      bookmarks: bookmarks.slice(0, limit).map((b) => ({
        title: FormatUtils.truncate(b.title || b.url, 45),
        description: FormatUtils.truncate(b.description || "", 60),
        tags: b.tags || [],
        url: b.url,
        domain: b.url
          ? b.url
              .replace(/^https?:\/\//, "")
              .replace(/^www\./, "")
              .split("/")[0]
          : "",
        dateAdded: b.date_added,
      })),
    };
  }

  renderWidget(widget, data, widgetSize) {
    const sizes = CONFIG.sizing[widgetSize];

    const headerOptions = this.category ? { subtitle: this.category } : {};
    this.addHeader(widget, "Bookmarks", sizes, headerOptions);
    widget.addSpacer(sizes.spacing);

    const contentStack = widget.addStack();
    contentStack.layoutVertically();

    this.renderItemList(contentStack, data.bookmarks, sizes, true, widgetSize);
  }

  renderItem(stack, item, sizes, widgetSize) {
    const itemStack = stack.addStack();
    itemStack.layoutHorizontally();
    itemStack.centerAlignContent();

    if (item.url) itemStack.url = item.url;

    if (this.category && item.tags.length > 0) {
      this.addBadge(itemStack, {
        text: item.tags[0],
        color: CONFIG.colors.accent,
        sizes,
      });
      itemStack.addSpacer(sizes.spacing);
    }

    const textStack = itemStack.addStack();
    textStack.layoutVertically();

    const titleText = textStack.addText(item.title);
    titleText.font = Font.boldSystemFont(sizes.fontSize.primary);
    titleText.textColor = CONFIG.colors.primary;
    titleText.lineLimit = 1;

    const urlText = textStack.addText(item.domain);
    urlText.font = Font.systemFont(sizes.fontSize.tertiary);
    urlText.textColor = CONFIG.colors.tertiary;
    urlText.lineLimit = 1;
  }
}

class BooksDataSource extends DataSource {
  isEmpty(data) {
    return !data.title;
  }

  async fetchData(widgetSize) {
    const isbn = this.isbn || this.config.defaultIsbn;
    if (!isbn) {
      throw new Error("Set defaultIsbn in CONFIG or use books:<isbn>");
    }
    const booksApi = new APIClient(this.config.apiUrl);
    const response = await booksApi.fetch(isbn);

    if (!response || response.totalItems === 0) {
      return {};
    }

    const book = response.items[0].volumeInfo;
    const thumbnailUrl = book.imageLinks ? book.imageLinks.thumbnail : null;

    const data = {
      title: book.title || "Unknown Title",
      authors: book.authors ? book.authors.join(", ") : "Unknown Author",
      publisher: book.publisher || "Unknown Publisher",
      publishedDate: book.publishedDate || "Unknown Date",
      pageCount: book.pageCount || "Unknown",
      categories: book.categories
        ? book.categories.join(", ")
        : "Uncategorized",
      maturityRating:
        CONFIG.maturityMap[book.maturityRating] || book.maturityRating,
      language: CONFIG.languageMap[book.language] || book.language,
    };

    // Pre-load images in parallel; skip goodreadsIcon on small widget where it isn't shown
    const [coverImage, goodreadsIcon] = await Promise.all([
      thumbnailUrl ? ImageCache.load(thumbnailUrl) : Promise.resolve(null),
      widgetSize !== "small"
        ? ImageCache.load(this.config.goodreadsIconUrl)
        : Promise.resolve(null),
    ]);
    data.coverImage = coverImage;
    data.goodreadsIcon = goodreadsIcon;

    return data;
  }

  renderWidget(widget, data, widgetSize) {
    const sizes = CONFIG.sizing[widgetSize];

    this.addHeader(widget, "Currently Reading", sizes);
    widget.addSpacer(sizes.spacing);

    const bodyStack = widget.addStack();
    bodyStack.layoutHorizontally();

    // Book cover (not on small widget unless no room for info)
    if (widgetSize !== "small" && data.coverImage) {
      const coverStack = bodyStack.addStack();
      coverStack.layoutVertically();
      coverStack.centerAlignContent();

      const cover = coverStack.addImage(data.coverImage);
      cover.cornerRadius = CONFIG.designTokens.cornerRadius.cover;
      cover.centerAlignImage();

      const imgSize = CONFIG.images.card[widgetSize];
      cover.imageSize = new Size(imgSize.width, imgSize.height);

      bodyStack.addSpacer(sizes.spacing * 2);
    }

    // Book info
    const infoStack = bodyStack.addStack();
    infoStack.layoutVertically();

    const titleText = infoStack.addText(FormatUtils.truncate(data.title, 40));
    titleText.font = Font.boldSystemFont(sizes.fontSize.primary);
    titleText.textColor = CONFIG.colors.primary;
    titleText.lineLimit = 2;

    const authorsText = infoStack.addText(data.authors);
    authorsText.font = Font.mediumSystemFont(sizes.fontSize.secondary);
    authorsText.textColor = CONFIG.colors.secondary;
    authorsText.lineLimit = 1;

    if (widgetSize !== "small") {
      infoStack.addSpacer(sizes.spacing);

      const detailText = infoStack.addText(
        `${data.pageCount} pages · ${data.publisher}, ${data.publishedDate}`,
      );
      detailText.font = Font.systemFont(sizes.fontSize.tertiary);
      detailText.textColor = CONFIG.colors.tertiary;
      detailText.lineLimit = 1;

      const metaText = infoStack.addText(
        `${data.categories} · ${data.language}`,
      );
      metaText.font = Font.systemFont(sizes.fontSize.tertiary);
      metaText.textColor = CONFIG.colors.tertiary;
    }

    // Small widget: show cover below text
    if (widgetSize === "small" && data.coverImage) {
      infoStack.addSpacer(sizes.spacing);

      const coverStack = infoStack.addStack();
      coverStack.centerAlignContent();

      const cover = coverStack.addImage(data.coverImage);
      cover.cornerRadius = CONFIG.designTokens.cornerRadius.cover;
      cover.centerAlignImage();
      const smallImgSize = CONFIG.images.card.small;
      cover.imageSize = new Size(smallImgSize.width, smallImgSize.height);
    }

    bodyStack.addSpacer();

    // Goodreads icon (medium and large)
    if (widgetSize !== "small" && data.goodreadsIcon) {
      const iconStack = bodyStack.addStack();
      iconStack.layoutVertically();
      iconStack.centerAlignContent();

      const icon = iconStack.addImage(data.goodreadsIcon);
      icon.cornerRadius = CONFIG.designTokens.cornerRadius.cover;
      icon.centerAlignImage();
      icon.imageSize = new Size(25, 25);
      icon.url = "goodreads://";
    }
  }
}

class AstronomyDataSource extends DataSource {
  static moonPhases = [
    { name: "New Moon", icon: "moonphase.new.moon" },
    { name: "Waxing Crescent", icon: "moonphase.waxing.crescent" },
    { name: "First Quarter", icon: "moonphase.first.quarter" },
    { name: "Waxing Gibbous", icon: "moonphase.waxing.gibbous" },
    { name: "Full Moon", icon: "moonphase.full.moon" },
    { name: "Waning Gibbous", icon: "moonphase.waning.gibbous" },
    { name: "Last Quarter", icon: "moonphase.last.quarter" },
    { name: "Waning Crescent", icon: "moonphase.waning.crescent" },
  ];

  async getLocation() {
    // Try configured coordinates first
    if (this.config.latitude && this.config.longitude) {
      return {
        latitude: parseFloat(this.config.latitude),
        longitude: parseFloat(this.config.longitude),
      };
    }

    // Try cached location
    const cached = await CacheManager.load("_location");
    if (cached && cached.data) {
      return cached.data;
    }

    // Request device location
    const location = await Location.current();
    const coords = {
      latitude: location.latitude,
      longitude: location.longitude,
    };
    CacheManager.save("_location", coords);
    return coords;
  }

  async fetchData(widgetSize) {
    const loc = await this.getLocation();
    const lat = loc.latitude;
    const lon = loc.longitude;

    const weatherApi = new APIClient(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=sunrise,sunset,uv_index_max&current=temperature_2m,weather_code&timezone=auto`,
    );
    const weather = await weatherApi.fetch("");

    if (!weather || !weather.daily) {
      return {};
    }

    const daily = weather.daily;
    const sunrise = daily.sunrise[0];
    const sunset = daily.sunset[0];

    // Calculate golden hours (30min window around sunrise/sunset)
    const sunriseDate = new Date(sunrise);
    const sunsetDate = new Date(sunset);
    const goldenMorningStart = new Date(sunriseDate.getTime() - 30 * 60000);
    const goldenMorningEnd = new Date(sunriseDate.getTime() + 30 * 60000);
    const goldenEveningStart = new Date(sunsetDate.getTime() - 30 * 60000);
    const goldenEveningEnd = new Date(sunsetDate.getTime() + 30 * 60000);

    // Moon phase: calculate from date (0-1 scale, synodic month)
    const moonPhase = this.calculateMoonPhase(new Date());

    return {
      sunrise,
      sunset,
      uvIndex: daily.uv_index_max[0],
      temperature: weather.current?.temperature_2m,
      weatherCode: weather.current?.weather_code,
      moonPhase,
      goldenMorning: { start: goldenMorningStart, end: goldenMorningEnd },
      goldenEvening: { start: goldenEveningStart, end: goldenEveningEnd },
    };
  }

  calculateMoonPhase(date) {
    // Simplified moon phase calculation based on known new moon reference
    const knownNewMoon = new Date("2024-01-11T11:57:00Z");
    const synodicMonth = 29.53058770576;
    const daysSince = (date - knownNewMoon) / (1000 * 60 * 60 * 24);
    const phase = ((daysSince % synodicMonth) + synodicMonth) % synodicMonth;
    return phase / synodicMonth; // 0-1 scale
  }

  getMoonPhaseInfo(phase) {
    const index = Math.round(phase * 8) % 8;
    return AstronomyDataSource.moonPhases[index];
  }

  isEmpty(data) {
    return !data || !data.sunrise;
  }

  renderWidget(widget, data, widgetSize) {
    const sizes = CONFIG.sizing[widgetSize];

    this.addHeader(widget, "Astronomy", sizes);
    widget.addSpacer(sizes.spacing);

    const contentStack = widget.addStack();
    contentStack.layoutVertically();

    // Sun row
    this.renderSunRow(contentStack, data, sizes);
    contentStack.addSpacer(sizes.spacing);

    // Moon row
    this.renderMoonRow(contentStack, data, sizes);

    if (widgetSize !== "small") {
      contentStack.addSpacer(sizes.spacing);
      // UV index row
      this.renderUvRow(contentStack, data, sizes);
      contentStack.addSpacer(sizes.spacing);
      // Golden hour row
      this.renderGoldenHourRow(contentStack, data, sizes);
    }

    if (widgetSize === "large") {
      contentStack.addSpacer(sizes.spacing);
      this.renderTemperatureRow(contentStack, data, sizes);
    }
  }

  renderSunRow(stack, data, sizes) {
    const row = stack.addStack();
    row.layoutHorizontally();
    row.centerAlignContent();

    const sunriseIcon = row.addImage(SFSymbol.named("sunrise.fill").image);
    sunriseIcon.imageSize = new Size(sizes.iconSize, sizes.iconSize);
    sunriseIcon.tintColor = CONFIG.colors.warning;
    row.addSpacer(CONFIG.designTokens.compactSpacing);

    const sunriseText = row.addText(FormatUtils.formatTime(data.sunrise));
    sunriseText.font = Font.mediumSystemFont(sizes.fontSize.primary);
    sunriseText.textColor = CONFIG.colors.primary;

    row.addSpacer(sizes.spacing * 2);

    const sunsetIcon = row.addImage(SFSymbol.named("sunset.fill").image);
    sunsetIcon.imageSize = new Size(sizes.iconSize, sizes.iconSize);
    sunsetIcon.tintColor = CONFIG.colors.sunset;
    row.addSpacer(CONFIG.designTokens.compactSpacing);

    const sunsetText = row.addText(FormatUtils.formatTime(data.sunset));
    sunsetText.font = Font.mediumSystemFont(sizes.fontSize.primary);
    sunsetText.textColor = CONFIG.colors.primary;
  }

  renderMoonRow(stack, data, sizes) {
    const row = stack.addStack();
    row.layoutHorizontally();
    row.centerAlignContent();

    const moonInfo = this.getMoonPhaseInfo(data.moonPhase);
    const moonIcon = row.addImage(SFSymbol.named(moonInfo.icon).image);
    moonIcon.imageSize = new Size(sizes.iconSize, sizes.iconSize);
    moonIcon.tintColor = CONFIG.colors.primary;
    row.addSpacer(CONFIG.designTokens.compactSpacing);

    const moonText = row.addText(moonInfo.name);
    moonText.font = Font.mediumSystemFont(sizes.fontSize.primary);
    moonText.textColor = CONFIG.colors.primary;

    row.addSpacer(sizes.spacing);

    const pctText = row.addText(`${Math.round(data.moonPhase * 100)}%`);
    pctText.font = Font.systemFont(sizes.fontSize.tertiary);
    pctText.textColor = CONFIG.colors.secondary;
  }

  renderUvRow(stack, data, sizes) {
    const row = stack.addStack();
    row.layoutHorizontally();
    row.centerAlignContent();

    const uvIcon = row.addImage(SFSymbol.named("sun.max.fill").image);
    uvIcon.imageSize = new Size(sizes.iconSize, sizes.iconSize);
    uvIcon.tintColor = CONFIG.colors.warning;
    row.addSpacer(CONFIG.designTokens.compactSpacing);

    const label = row.addText("UV Index");
    label.font = Font.systemFont(sizes.fontSize.secondary);
    label.textColor = CONFIG.colors.secondary;
    row.addSpacer(sizes.spacing);

    const uvValue = Math.round(data.uvIndex);
    const uvColor =
      uvValue >= 6
        ? CONFIG.colors.down
        : uvValue >= 3
          ? CONFIG.colors.warning
          : CONFIG.colors.up;
    const uvText = row.addText(`${uvValue}`);
    uvText.font = Font.mediumSystemFont(sizes.fontSize.primary);
    uvText.textColor = uvColor;
  }

  renderGoldenHourRow(stack, data, sizes) {
    const row = stack.addStack();
    row.layoutHorizontally();
    row.centerAlignContent();

    const ghIcon = row.addImage(SFSymbol.named("camera.filters").image);
    ghIcon.imageSize = new Size(sizes.iconSize, sizes.iconSize);
    ghIcon.tintColor = CONFIG.colors.golden;
    row.addSpacer(CONFIG.designTokens.compactSpacing);

    const morningText = `${FormatUtils.formatTime(data.goldenMorning.start)}–${FormatUtils.formatTime(data.goldenMorning.end)}`;
    const eveningText = `${FormatUtils.formatTime(data.goldenEvening.start)}–${FormatUtils.formatTime(data.goldenEvening.end)}`;

    const text = row.addText(`↑ ${morningText}  ↓ ${eveningText}`);
    text.font = Font.systemFont(sizes.fontSize.secondary);
    text.textColor = CONFIG.colors.primary;
  }

  renderTemperatureRow(stack, data, sizes) {
    if (data.temperature === undefined) return;

    const row = stack.addStack();
    row.layoutHorizontally();
    row.centerAlignContent();

    const tempIcon = row.addImage(SFSymbol.named("thermometer.medium").image);
    tempIcon.imageSize = new Size(sizes.iconSize, sizes.iconSize);
    tempIcon.tintColor = CONFIG.colors.accent;
    row.addSpacer(CONFIG.designTokens.compactSpacing);

    const tempText = row.addText(`${Math.round(data.temperature)}°C`);
    tempText.font = Font.mediumSystemFont(sizes.fontSize.primary);
    tempText.textColor = CONFIG.colors.primary;
  }
}

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
        createdAt: post.record?.createdAt || post.indexedAt,
        likes: post.likeCount || 0,
        reposts: post.repostCount || 0,
        replies: post.replyCount || 0,
        url: `https://bsky.app/profile/${post.author?.handle}/post/${post.uri?.split("/").pop()}`,
        isRepost: !!item.reason,
      };
    });

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

    this.renderItemList(contentStack, data.posts, sizes, true, widgetSize);
  }

  renderItem(stack, item, sizes, widgetSize) {
    const itemStack = stack.addStack();
    itemStack.layoutHorizontally();
    itemStack.centerAlignContent();

    if (item.url) itemStack.url = item.url;

    const textStack = itemStack.addStack();
    textStack.layoutVertically();

    const titleText = textStack.addText(FormatUtils.truncate(item.text, 60));
    titleText.font = Font.boldSystemFont(sizes.fontSize.primary);
    titleText.textColor = CONFIG.colors.primary;
    titleText.lineLimit = 2;

    const authorText = textStack.addText(item.author);
    authorText.font = Font.mediumSystemFont(sizes.fontSize.secondary);
    authorText.textColor = CONFIG.colors.secondary;
    authorText.lineLimit = 1;

    const metaText = textStack.addText(
      `${item.likes} likes · ${item.replies} replies`,
    );
    metaText.font = Font.systemFont(sizes.fontSize.tertiary);
    metaText.textColor = CONFIG.colors.tertiary;
    metaText.lineLimit = 1;
  }
}

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

    this.renderItemList(contentStack, data.items, sizes, true, widgetSize);
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
    titleText.font = Font.boldSystemFont(sizes.fontSize.primary);
    titleText.textColor = CONFIG.colors.primary;
    titleText.lineLimit = 1;

    const metaText = textStack.addText(item.detail);
    metaText.font = Font.systemFont(sizes.fontSize.tertiary);
    metaText.textColor = CONFIG.colors.tertiary;
    metaText.lineLimit = 1;
  }
}

class StatusBoardDataSource extends DataSource {
  async fetchData(widgetSize) {
    const boardSources = this.config.boardSources || [];
    const sizes = CONFIG.sizing[widgetSize];
    const maxSources =
      widgetSize === "small" ? 2 : widgetSize === "medium" ? 3 : 5;
    const sourcesToFetch = boardSources.slice(0, maxSources);

    const results = await Promise.allSettled(
      sourcesToFetch.map(async (sourceName) => {
        try {
          const source = DataSourceFactory.create(sourceName, this.api);
          const data = await source.fetchData(widgetSize);

          if (source.isEmpty(data)) {
            return {
              name: sourceName,
              config: CONFIG.sources[sourceName],
              topItem: null,
              error: null,
            };
          }

          const topItem = this.extractTopItem(sourceName, data);
          return {
            name: sourceName,
            config: CONFIG.sources[sourceName],
            topItem,
            error: null,
          };
        } catch (error) {
          // Try cache fallback
          const cached = await CacheManager.load(sourceName);
          if (cached) {
            const topItem = this.extractTopItem(sourceName, cached.data);
            return {
              name: sourceName,
              config: CONFIG.sources[sourceName],
              topItem,
              error: null,
            };
          }
          return {
            name: sourceName,
            config: CONFIG.sources[sourceName],
            topItem: null,
            error: error.message,
          };
        }
      }),
    );

    const sources = results.map((r) =>
      r.status === "fulfilled"
        ? r.value
        : { name: "unknown", topItem: null, error: r.reason },
    );
    return { sources };
  }

  // Every entry in CONFIG.sources (other than statusboard itself) needs an extractor
  // here, or its Status Board row silently shows "no data" even with a successful fetch.
  static topItemExtractors = {
    billboard: (data) =>
      data.items?.[0] && `${data.items[0].title} — ${data.items[0].subtitle}`,
    imdb: (data) =>
      data.movies?.[0] && `${data.movies[0].title} (${data.movies[0].year})`,
    steam: (data) => {
      const allGames = data.games || [];
      return allGames[0] && allGames[0].name;
    },
    hackernews: (data) => data.stories?.[0]?.title,
    github: (data) =>
      data.releases?.[0] &&
      `${data.releases[0].repo} ${data.releases[0].tagName}`,
    wikipedia: (data) => data.edits?.[0]?.title,
    timeline: (data) => data.events?.[0]?.title,
    bookmarks: (data) => data.bookmarks?.[0]?.title,
    bluesky: (data) =>
      data.posts?.[0] && FormatUtils.truncate(data.posts[0].text, 60),
    astronomy: () => "Astronomy data",
    "dhbw-timetable": (data) => data.events?.[0]?.name,
    books: (data) => data.title,
    activity: (data) => data.items?.[0]?.title,
  };

  extractTopItem(sourceName, data) {
    if (!data) return null;
    const extractor = StatusBoardDataSource.topItemExtractors[sourceName];
    return extractor ? extractor(data) || null : null;
  }

  isEmpty(data) {
    return !data || !data.sources || data.sources.length === 0;
  }

  renderWidget(widget, data, widgetSize) {
    const sizes = CONFIG.sizing[widgetSize];

    this.addHeader(widget, "Status Board", sizes);
    widget.addSpacer(sizes.spacing);

    const contentStack = widget.addStack();
    contentStack.layoutVertically();

    data.sources.forEach((source, index) => {
      this.renderSourceRow(contentStack, source, sizes, widgetSize);
      if (index < data.sources.length - 1) {
        contentStack.addSpacer(sizes.spacing);
      }
    });
  }

  renderSourceRow(stack, source, sizes, widgetSize) {
    const row = stack.addStack();
    row.layoutHorizontally();
    row.centerAlignContent();

    if (source.config?.urlScheme) {
      row.url = source.config.urlScheme;
    }

    // Source icon
    const iconName = source.config?.icon || "questionmark.circle";
    const icon = row.addImage(SFSymbol.named(iconName).image);
    icon.imageSize = new Size(sizes.iconSize, sizes.iconSize);
    icon.tintColor = CONFIG.colors.accent;
    row.addSpacer(sizes.spacing);

    if (source.error) {
      const errorText = row.addText(source.config?.name || source.name);
      errorText.font = Font.systemFont(sizes.fontSize.secondary);
      errorText.textColor = CONFIG.colors.tertiary;
    } else if (source.topItem) {
      const textStack = row.addStack();
      textStack.layoutVertically();

      const itemText = textStack.addText(
        FormatUtils.truncate(source.topItem, widgetSize === "small" ? 30 : 60),
      );
      itemText.font = Font.boldSystemFont(sizes.fontSize.primary);
      itemText.textColor = CONFIG.colors.primary;
      itemText.lineLimit = 1;
    } else {
      const emptyText = row.addText(
        `${source.config?.name || source.name} — no data`,
      );
      emptyText.font = Font.systemFont(sizes.fontSize.secondary);
      emptyText.textColor = CONFIG.colors.tertiary;
    }
  }
}

class DHBWTimetableDataSource extends DataSource {
  isEmpty(data) {
    return !data.events || data.events.length === 0;
  }

  async fetchData(widgetSize) {
    const response = await this.api.fetch(this.config.endpoint);

    if (!response || !Array.isArray(response.events)) {
      return { events: [], courseName: "", courseCode: "" };
    }

    const now = new Date();
    // Local date, not UTC — toISOString() would roll to tomorrow late evening.
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    let events = response.events
      .filter((e) => e.date >= todayStr)
      .map((e) => ({
        id: e.id,
        name: e.name,
        type: e.type || "",
        date: e.date,
        startTime: e.startTime,
        endTime: e.endTime,
        lecturer: e.lecturer || "",
        rooms: e.rooms || [],
        course: e.course || "",
      }))
      .sort((a, b) => {
        const dateCmp = a.date.localeCompare(b.date);
        if (dateCmp !== 0) return dateCmp;
        return a.startTime.localeCompare(b.startTime);
      });

    const limit = CONFIG.sizing[widgetSize].maxItems;

    return {
      events: events.slice(0, limit),
      courseName: response.course?.name || "",
      courseCode: response.courseCode || "",
    };
  }

  renderWidget(widget, data, widgetSize) {
    const sizes = CONFIG.sizing[widgetSize];

    const title = data.courseName || "DHBW Timetable";
    this.addHeader(widget, title, sizes);
    widget.addSpacer(sizes.spacing);

    if (data.events.length === 0) {
      const emptyText = widget.addText("No upcoming events");
      emptyText.font = Font.systemFont(sizes.fontSize.secondary);
      emptyText.textColor = CONFIG.colors.secondary;
      emptyText.centerAlignText();
      return;
    }

    const contentStack = widget.addStack();
    contentStack.layoutVertically();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let lastDate = null;
    data.events.forEach((event, index) => {
      if (event.date !== lastDate) {
        if (lastDate !== null) {
          contentStack.addSpacer(sizes.spacing);
        }
        const dateLabel = contentStack.addText(
          FormatUtils.formatDateLabel(event.date, today, tomorrow),
        );
        dateLabel.font = Font.boldSystemFont(sizes.fontSize.secondary);
        dateLabel.textColor = CONFIG.colors.accent;
        contentStack.addSpacer(CONFIG.designTokens.compactSpacing);
        lastDate = event.date;
      }

      this.renderItem(contentStack, event, sizes);

      if (index < data.events.length - 1) {
        const nextEvent = data.events[index + 1];
        if (nextEvent.date === event.date) {
          contentStack.addSpacer(CONFIG.designTokens.compactSpacing);
        }
      }
    });
  }

  renderItem(stack, event, sizes, widgetSize) {
    const itemStack = stack.addStack();
    itemStack.layoutHorizontally();

    const timeColumn = itemStack.addStack();
    timeColumn.layoutVertically();
    timeColumn.setPadding(0, 0, 0, 0);
    timeColumn.size = new Size(sizes.iconSize * 3, 0);

    const startText = timeColumn.addText(
      FormatUtils.formatTime(event.startTime),
    );
    startText.font = Font.mediumSystemFont(sizes.fontSize.secondary);
    startText.textColor = CONFIG.colors.primary;
    startText.rightAlignText();

    const endText = timeColumn.addText(FormatUtils.formatTime(event.endTime));
    endText.font = Font.systemFont(sizes.fontSize.tertiary);
    endText.textColor = CONFIG.colors.secondary;
    endText.rightAlignText();

    const divider = itemStack.addStack();
    divider.layoutVertically();
    divider.centerAlignContent();
    divider.setPadding(
      0,
      CONFIG.designTokens.compactSpacing,
      0,
      CONFIG.designTokens.compactSpacing,
    );

    const dot = divider.addStack();
    dot.size = new Size(sizes.fontSize.tertiary, sizes.fontSize.tertiary);
    dot.cornerRadius = sizes.fontSize.tertiary / 2;
    dot.backgroundColor =
      CONFIG.colors.dhbwTypes[event.type] || CONFIG.colors.accent;

    itemStack.addSpacer(CONFIG.designTokens.compactSpacing);

    const textStack = itemStack.addStack();
    textStack.layoutVertically();

    const titleRow = textStack.addStack();
    titleRow.layoutHorizontally();
    titleRow.centerAlignContent();

    const nameText = titleRow.addText(FormatUtils.truncate(event.name, 30));
    nameText.font = Font.boldSystemFont(sizes.fontSize.primary);
    nameText.textColor = CONFIG.colors.primary;
    nameText.lineLimit = 1;

    if (event.type) {
      titleRow.addSpacer(CONFIG.designTokens.compactSpacing);
      this.addBadge(titleRow, {
        text: event.type,
        color: CONFIG.colors.dhbwTypes[event.type] || CONFIG.colors.accent,
        sizes,
      });
    }

    const detailParts = [];
    if (event.rooms && event.rooms.length > 0) {
      detailParts.push(event.rooms.join(", "));
    }
    if (event.lecturer) {
      detailParts.push(event.lecturer);
    }
    if (detailParts.length > 0) {
      const detailText = textStack.addText(detailParts.join(" · "));
      detailText.font = Font.systemFont(sizes.fontSize.tertiary);
      detailText.textColor = CONFIG.colors.secondary;
      detailText.lineLimit = 1;
    }

    itemStack.addSpacer();
  }
}

// ============================================================================
// DATA SOURCE FACTORY
// ============================================================================

class DataSourceFactory {
  static sourceMap = {
    billboard: BillboardDataSource,
    imdb: IMDbDataSource,
    steam: SteamDataSource,
    hackernews: HackerNewsDataSource,
    github: GitHubDataSource,
    wikipedia: WikipediaDataSource,
    timeline: TimelineDataSource,
    bookmarks: BookmarksDataSource,
    books: BooksDataSource,
    astronomy: AstronomyDataSource,
    bluesky: BlueskyDataSource,
    activity: ActivityDataSource,
    statusboard: StatusBoardDataSource,
    "dhbw-timetable": DHBWTimetableDataSource,
  };

  static create(sourceName, apiClient) {
    let baseName = sourceName;
    let extra = null;

    if (sourceName.includes(":")) {
      [baseName, extra] = sourceName.split(":", 2);
    }

    const config = CONFIG.sources[baseName];
    const SourceClass = this.sourceMap[baseName];

    if (!config || !SourceClass) {
      throw new Error(`Unknown source: ${sourceName}`);
    }

    const instance = new SourceClass(config, apiClient);
    if (extra) {
      if (baseName === "books") {
        instance.isbn = extra;
      } else {
        instance.category = extra;
      }
    }
    return instance;
  }
}

// ============================================================================
// MAIN WIDGET CLASS
// ============================================================================

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

// ============================================================================
// EXECUTION
// ============================================================================

// Guarded (and wrapped in an IIFE rather than top-level await, which CommonJS can't
// parse) so this file can be `require`'d from Node for testing — see test/. Scriptable
// always defines `Script`, Node never does.
if (typeof Script !== "undefined") {
  (async () => {
    const widget = new Mosaic();
    await widget.run();
  })();
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    CONFIG,
    FormatUtils,
    APIClient,
    CacheManager,
    RefreshManager,
    ConfigManager,
    DataSourceFactory,
    BillboardDataSource,
    IMDbDataSource,
    SteamDataSource,
    HackerNewsDataSource,
    GitHubDataSource,
    WikipediaDataSource,
    TimelineDataSource,
    BookmarksDataSource,
    BooksDataSource,
    AstronomyDataSource,
    BlueskyDataSource,
    ActivityDataSource,
    StatusBoardDataSource,
    DHBWTimetableDataSource,
    Mosaic,
  };
}
