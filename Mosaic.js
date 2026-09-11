// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-blue; icon-glyph: chart-line;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// src/config.js
var require_config = __commonJS({
  "src/config.js"(exports2, module2) {
    var label = Color.dynamic(new Color("#000000"), new Color("#FFFFFF"));
    var secondaryLabel = Color.dynamic(
      new Color("#3C3C43", 0.6),
      new Color("#EBEBF5", 0.6)
    );
    var tertiaryLabel = Color.dynamic(
      new Color("#3C3C43", 0.3),
      new Color("#EBEBF5", 0.3)
    );
    var quaternaryLabel = Color.dynamic(
      new Color("#3C3C43", 0.18),
      new Color("#EBEBF5", 0.18)
    );
    var COLORS = {
      // Semantic label hierarchy
      label,
      secondaryLabel,
      tertiaryLabel,
      quaternaryLabel,
      separator: Color.dynamic(
        new Color("#3C3C43", 0.29),
        new Color("#545458", 0.65)
      ),
      fill: Color.dynamic(new Color("#787880", 0.12), new Color("#787880", 0.24)),
      // Accent and status (system colors)
      accent: Color.dynamic(new Color("#007AFF"), new Color("#0A84FF")),
      warning: Color.dynamic(new Color("#FF9500"), new Color("#FF9F0A")),
      new: Color.dynamic(new Color("#007AFF"), new Color("#0A84FF")),
      up: Color.dynamic(new Color("#34C759"), new Color("#30D158")),
      down: Color.dynamic(new Color("#FF3B30"), new Color("#FF453A")),
      unchanged: tertiaryLabel,
      sunset: Color.dynamic(new Color("#FF9500"), new Color("#FF9F0A")),
      golden: Color.dynamic(new Color("#FFCC00"), new Color("#FFD60A")),
      white: Color.white(),
      // Steam status indicators
      steamStatus: {
        online: Color.dynamic(new Color("#34C759"), new Color("#30D158")),
        "in-game": Color.dynamic(new Color("#34C759"), new Color("#30D158")),
        offline: Color.dynamic(new Color("#8E8E93"), new Color("#8E8E93")),
        private: Color.dynamic(new Color("#FF9500"), new Color("#FF9F0A"))
      },
      dhbwTypes: {
        Vorlesung: Color.dynamic(new Color("#007AFF"), new Color("#0A84FF")),
        \u00DCbung: Color.dynamic(new Color("#34C759"), new Color("#30D158")),
        Labor: Color.dynamic(new Color("#FF9500"), new Color("#FF9F0A")),
        Praktikum: Color.dynamic(new Color("#FF9500"), new Color("#FF9F0A")),
        Seminar: Color.dynamic(new Color("#AF52DE"), new Color("#BF5AF2")),
        Tutorium: Color.dynamic(new Color("#5856D6"), new Color("#5E5CE6")),
        Klausur: Color.dynamic(new Color("#FF3B30"), new Color("#FF453A")),
        Pr\u00FCfung: Color.dynamic(new Color("#FF3B30"), new Color("#FF453A"))
      }
    };
    var CONFIG2 = {
      // Default settings
      defaultSource: "billboard",
      apiBaseUrl: "https://api.michi.onl/api",
      apiToken: "",
      // Set via in-app "API Token" setup UI; stored in Keychain
      // Widget sizing. Type scale follows SF text styles, compacted for widgets.
      sizing: {
        small: {
          maxItems: 4,
          fontSize: { title: 13, primary: 13, secondary: 11, tertiary: 10, caption: 9 },
          iconSize: 14,
          spacing: 6,
          padding: 14
        },
        medium: {
          maxItems: 4,
          fontSize: { title: 15, primary: 15, secondary: 13, tertiary: 11, caption: 10 },
          iconSize: 16,
          spacing: 8,
          padding: 16
        },
        large: {
          maxItems: 12,
          fontSize: { title: 17, primary: 17, secondary: 15, tertiary: 13, caption: 11 },
          iconSize: 18,
          spacing: 10,
          padding: 18
        }
      },
      // Standardized image sizes per layout template
      images: {
        grid: {
          small: { width: 32, height: 32, cornerRadius: 4 },
          medium: { width: 40, height: 40, cornerRadius: 4 },
          large: { width: 48, height: 48, cornerRadius: 6 }
        },
        gridTall: {
          small: { width: 28, height: 42, cornerRadius: 4 },
          medium: { width: 36, height: 54, cornerRadius: 4 },
          large: { width: 44, height: 66, cornerRadius: 6 }
        },
        card: {
          small: { width: 40, height: 60, cornerRadius: 6 },
          medium: { width: 60, height: 90, cornerRadius: 6 },
          large: { width: 80, height: 120, cornerRadius: 8 }
        }
      },
      colors: COLORS,
      // Concentric radius system + shared spacing
      designTokens: {
        cornerRadius: { badge: 6, control: 10, card: 12, icon: 4, cover: 8 },
        badge: { paddingV: 3, paddingH: 8 },
        compactSpacing: 4
      },
      messages: {
        offline: "Offline",
        tapRetry: "Tap to try again"
      },
      // Source-specific configuration
      sources: {
        billboard: {
          name: "Billboard 200",
          endpoint: "/billboard-200",
          icon: "chart.bar.fill",
          color: new Color("#FF2D55"),
          refreshHours: 24,
          urlScheme: "https://www.billboard.com/charts/billboard-200/"
        },
        imdb: {
          name: "IMDb Popular",
          endpoint: "/imdb",
          icon: "tv.fill",
          color: new Color("#F5C518"),
          // IMDb's own brand yellow
          refreshHours: 12,
          urlScheme: "imdb://"
        },
        steam: {
          name: "Steam Games",
          endpoint: "/steam-profiles",
          icon: "gamecontroller.fill",
          color: new Color("#66C0F4"),
          // Steam's own brand blue
          refreshHours: 6,
          urlScheme: "steam://",
          profiles: []
          // Set via widget-config.json
        },
        hackernews: {
          name: "Hacker News",
          endpoint: "/hackernews",
          icon: "newspaper.fill",
          color: new Color("#FF6600"),
          // Hacker News' own brand orange
          refreshHours: 1,
          urlScheme: "https://news.ycombinator.com/"
        },
        github: {
          name: "GitHub Releases",
          endpoint: "/github-releases",
          icon: "arrow.down.circle",
          color: new Color("#6e5494"),
          // matches TimelineDataSource/ActivityDataSource github badge color
          refreshHours: 6,
          urlScheme: "https://github.com/",
          repos: []
          // Set via widget-config.json
        },
        wikipedia: {
          name: "Wikipedia Edits",
          endpoint: "/wikipedia-watchlist",
          icon: "book.fill",
          color: new Color("#636466"),
          // matches TimelineDataSource/ActivityDataSource wikipedia badge color
          refreshHours: 2,
          urlScheme: "https://wikipedia.org/",
          limit: 10,
          hours: 72
        },
        timeline: {
          name: "Timeline",
          endpoint: "/timeline",
          icon: "clock.arrow.circlepath",
          // no color override: aggregates other sources, whose rows already carry their own color
          refreshHours: 1,
          urlScheme: "https://www.michi.onl/"
        },
        bookmarks: {
          name: "Bookmarks",
          endpoint: "/bookmarks",
          icon: "bookmark.fill",
          color: new Color("#30B0C7"),
          refreshHours: 1,
          urlScheme: "https://linkding.michi.onl/"
        },
        "dhbw-timetable": {
          name: "DHBW Timetable",
          endpoint: "/dhbw-timetable",
          icon: "calendar.badge.clock",
          // no color override: each event row is already color-coded by CONFIG.colors.dhbwTypes
          refreshHours: 1
        },
        astronomy: {
          name: "Astronomy",
          icon: "moon.stars.fill",
          color: new Color("#FFD700"),
          // matches CONFIG.colors.golden, ties into the golden-hour row
          refreshHours: 1,
          urlScheme: "weather://"
        },
        bluesky: {
          name: "Bluesky",
          icon: "bubble.left.fill",
          color: new Color("#0285FF"),
          // Bluesky's own brand blue
          refreshHours: 1,
          urlScheme: "https://bsky.app/"
        },
        activity: {
          name: "Activity",
          endpoint: "",
          icon: "bolt.fill",
          // no color override: aggregates other sources, whose rows already carry their own color
          refreshHours: 1,
          urlScheme: ""
        },
        statusboard: {
          name: "Status Board",
          icon: "square.grid.2x2.fill",
          // no color override: every row already carries its own source's color
          refreshHours: 1,
          urlScheme: ""
        },
        books: {
          name: "Currently Reading",
          icon: "book.fill",
          color: new Color("#A0522D"),
          refreshHours: 24,
          urlScheme: "goodreads://",
          apiUrl: "https://www.googleapis.com/books/v1/volumes?q=isbn:",
          goodreadsIconUrl: "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/42/d8/cd/42d8cdbf-48df-d1b6-ade9-d972bac7f371/PolarisAppIcon-0-0-1x_U007epad-0-1-0-85-220.png/1024x1024bb.jpg"
        }
      },
      // Language display mapping for books
      languageMap: {
        es: "Spanish \u{1F1EA}\u{1F1F8}",
        en: "English \u{1F1FA}\u{1F1F8}",
        de: "German \u{1F1E9}\u{1F1EA}",
        fr: "French \u{1F1EB}\u{1F1F7}",
        it: "Italian \u{1F1EE}\u{1F1F9}",
        pt: "Portuguese \u{1F1E7}\u{1F1F7}",
        ja: "Japanese \u{1F1EF}\u{1F1F5}"
      },
      maturityMap: {
        NOT_MATURE: "4+",
        MATURE: "18+"
      }
    };
    module2.exports = { CONFIG: CONFIG2 };
  }
});

// src/core/format-utils.js
var require_format_utils = __commonJS({
  "src/core/format-utils.js"(exports2, module2) {
    var FormatUtils2 = class {
      static truncate(text, maxLength) {
        if (!text) return "";
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength - 1) + "\u2026";
      }
      static formatNumber(num) {
        if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
        if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
        return num.toString();
      }
      static formatTimeAgo(dateString) {
        if (!dateString) return "Unknown";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "Unknown";
        const now = /* @__PURE__ */ new Date();
        const seconds = Math.floor((now - date) / 1e3);
        if (seconds < 0) return "Just now";
        const intervals = {
          year: 31536e3,
          month: 2592e3,
          week: 604800,
          day: 86400,
          hour: 3600,
          minute: 60
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
        return count === 1 ? `${count} ${singular}` : `${count} ${plural || singular + "s"}`;
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
        const d = /* @__PURE__ */ new Date(dateStr + "T00:00:00");
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const dMid = new Date(d);
        dMid.setHours(0, 0, 0, 0);
        if (today && dMid.getTime() === today.getTime()) return "Today";
        if (tomorrow && dMid.getTime() === tomorrow.getTime()) return "Tomorrow";
        return `${dayNames[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}`;
      }
      static cleanTitle(title) {
        if (!title) return "";
        return title.replace(/\[feat\. .*?\]/gi, "").replace(/\(.*?\)/gi, "").trim();
      }
      static stripHtml(html) {
        if (!html) return "";
        return html.replace(/<[^>]*>/g, "").replace(/&[^;]+;/g, " ").replace(/\s+/g, " ").trim();
      }
    };
    module2.exports = { FormatUtils: FormatUtils2 };
  }
});

// src/core/api-client.js
var require_api_client = __commonJS({
  "src/core/api-client.js"(exports2, module2) {
    var APIClient2 = class {
      constructor(baseUrl, token = "") {
        this.baseUrl = baseUrl;
        this.token = token;
        this.timeout = 10;
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
          "Content-Type": "application/x-www-form-urlencoded"
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
        return Object.entries(params).filter(([, value]) => value !== null && value !== void 0).map(
          ([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        ).join("&");
      }
      buildUrl(endpoint, params) {
        let url = this.baseUrl + endpoint;
        const filtered = Object.fromEntries(
          Object.entries(params).filter(
            ([, v]) => v !== "" && v !== null && v !== void 0
          )
        );
        if (Object.keys(filtered).length === 0) return url;
        const separator = url.includes("?") ? "&" : "?";
        return url + separator + this.encodeParams(filtered);
      }
    };
    module2.exports = { APIClient: APIClient2 };
  }
});

// src/core/image-cache.js
var require_image_cache = __commonJS({
  "src/core/image-cache.js"(exports2, module2) {
    var ImageCache2 = class {
      // 5 seconds for image loading
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
    };
    __publicField(ImageCache2, "cache", {});
    __publicField(ImageCache2, "timeout", 5);
    module2.exports = { ImageCache: ImageCache2 };
  }
});

// src/core/cache-manager.js
var require_cache_manager = __commonJS({
  "src/core/cache-manager.js"(exports2, module2) {
    var { CONFIG: CONFIG2 } = require_config();
    var CacheManager2 = class {
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
            data
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
          if (fm.isFileStoredIniCloud && fm.isFileStoredIniCloud(cachePath)) {
            await fm.downloadFileFromiCloud(cachePath);
          }
          const cacheContent = fm.readString(cachePath);
          const cacheData = JSON.parse(cacheContent);
          const ageHours = (Date.now() - cacheData.timestamp) / (1e3 * 60 * 60);
          if (ageHours > this.maxAgeHours) {
            console.log(
              `Cache for ${source} expired (${ageHours.toFixed(1)}h old)`
            );
            return null;
          }
          console.log(`Cache loaded for ${source} (${ageHours.toFixed(1)}h old)`);
          return {
            data: cacheData.data,
            isStale: ageHours > (CONFIG2.sources[source]?.refreshHours || 1),
            ageHours
          };
        } catch (error) {
          console.error(`Failed to load cache for ${source}: ${error.message}`);
          return null;
        }
      }
    };
    __publicField(CacheManager2, "maxAgeHours", 48);
    // Maximum cache age for offline fallback
    __publicField(CacheManager2, "_fm", null);
    module2.exports = { CacheManager: CacheManager2 };
  }
});

// src/core/refresh-manager.js
var require_refresh_manager = __commonJS({
  "src/core/refresh-manager.js"(exports2, module2) {
    var { CONFIG: CONFIG2 } = require_config();
    var { CacheManager: CacheManager2 } = require_cache_manager();
    var RefreshManager2 = class {
      static getStatsPath() {
        const fm = CacheManager2.getFileManager();
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
        }
      }
      static recordSuccess(source) {
        const stats = this.loadStats();
        stats[source] = {
          lastFetchTime: Date.now(),
          consecutiveErrors: 0
        };
        this.saveStats(stats);
      }
      static recordError(source) {
        const stats = this.loadStats();
        const prev = stats[source] || {};
        stats[source] = {
          lastFetchTime: prev.lastFetchTime || null,
          consecutiveErrors: (prev.consecutiveErrors || 0) + 1
        };
        this.saveStats(stats);
      }
      static getRefreshInterval(source) {
        const baseHours = CONFIG2.sources[source]?.refreshHours || 1;
        const baseMs = baseHours * 60 * 60 * 1e3;
        const stats = this.loadStats();
        const sourceStats = stats[source];
        if (!sourceStats || !sourceStats.consecutiveErrors) {
          return baseMs;
        }
        const multiplier = Math.min(Math.pow(2, sourceStats.consecutiveErrors), 8);
        const maxMs = 48 * 60 * 60 * 1e3;
        return Math.min(baseMs * multiplier, maxMs);
      }
    };
    __publicField(RefreshManager2, "statsFile", "refresh_stats.json");
    module2.exports = { RefreshManager: RefreshManager2 };
  }
});

// src/core/config-manager.js
var require_config_manager = __commonJS({
  "src/core/config-manager.js"(exports2, module2) {
    var { CONFIG: CONFIG2 } = require_config();
    var { CacheManager: CacheManager2 } = require_cache_manager();
    var ConfigManager2 = class {
      static getConfigPath() {
        const fm = CacheManager2.getFileManager();
        return { fm, path: fm.joinPath(fm.documentsDirectory(), this.configFile) };
      }
      static async load() {
        if (this._loaded) return;
        this._loaded = true;
        try {
          if (Keychain.contains(this.keychainTokenKey)) {
            CONFIG2.apiToken = Keychain.get(this.keychainTokenKey);
          }
        } catch (error) {
          console.error(
            `Failed to load API token from Keychain: ${error.message}`
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
          if (saved.apiToken) {
            if (!CONFIG2.apiToken) this.setApiToken(saved.apiToken);
            delete saved.apiToken;
            fm.writeString(path, JSON.stringify(saved, null, 2));
          }
          if (!saved.sources) return;
          for (const [sourceName, sourceConfig] of Object.entries(saved.sources)) {
            if (CONFIG2.sources[sourceName]) {
              Object.assign(CONFIG2.sources[sourceName], sourceConfig);
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
            }
          }
          for (const [sourceName, sourceConfig] of Object.entries(
            sourceOverrides
          )) {
            existing.sources[sourceName] = {
              ...existing.sources[sourceName] || {},
              ...sourceConfig
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
          CONFIG2.apiToken = token || "";
        } catch (error) {
          console.error(`Failed to save API token to Keychain: ${error.message}`);
        }
      }
      static getEditableFields(sourceName) {
        const fieldMap = {
          steam: [
            {
              key: "profiles",
              label: "Steam profiles (comma-separated)",
              isArray: true
            }
          ],
          github: [
            {
              key: "repos",
              label: "Repos: owner/repo (comma-separated)",
              isArray: true
            }
          ],
          bluesky: [{ key: "handle", label: "Bluesky handle" }],
          astronomy: [
            { key: "latitude", label: "Latitude" },
            { key: "longitude", label: "Longitude" }
          ],
          statusboard: [
            {
              key: "boardSources",
              label: "Sources (comma-separated)",
              isArray: true
            }
          ],
          books: [{ key: "defaultIsbn", label: "Default ISBN" }],
          wikipedia: [
            { key: "usernames", label: "Username" },
            { key: "tokens", label: "Watchlist token" },
            { key: "languages", label: "Languages (e.g. en,de)" }
          ]
        };
        return fieldMap[sourceName] || [];
      }
    };
    __publicField(ConfigManager2, "configFile", "widget-config.json");
    __publicField(ConfigManager2, "keychainTokenKey", "mosaic_api_token");
    __publicField(ConfigManager2, "_loaded", false);
    module2.exports = { ConfigManager: ConfigManager2 };
  }
});

// src/design-system.js
var require_design_system = __commonJS({
  "src/design-system.js"(exports2, module2) {
    var { CONFIG: CONFIG2 } = require_config();
    var typography = {
      title: (sizes) => Font.semiboldSystemFont(sizes.fontSize.title || sizes.fontSize.primary),
      body: (sizes) => Font.regularSystemFont(sizes.fontSize.secondary),
      footnote: (sizes) => Font.regularSystemFont(sizes.fontSize.tertiary),
      caption: (sizes) => Font.regularSystemFont(sizes.fontSize.caption)
    };
    function addSeparator(stack, { inset = 0 } = {}) {
      const row = stack.addStack();
      row.layoutHorizontally();
      if (inset > 0) row.addSpacer(inset);
      const line = row.addStack();
      line.size = new Size(0, 0.5);
      line.backgroundColor = CONFIG2.colors.separator;
      row.addSpacer();
      return row;
    }
    function addTag(parentStack, { text, icon, color, sizes }) {
      const tag = parentStack.addStack();
      tag.backgroundColor = CONFIG2.colors.fill;
      tag.cornerRadius = CONFIG2.designTokens.cornerRadius.badge;
      tag.setPadding(
        CONFIG2.designTokens.badge.paddingV,
        CONFIG2.designTokens.badge.paddingH,
        CONFIG2.designTokens.badge.paddingV,
        CONFIG2.designTokens.badge.paddingH
      );
      const tint = color || CONFIG2.colors.accent;
      if (icon) {
        const img = tag.addImage(SFSymbol.named(icon).image);
        img.imageSize = new Size(sizes.fontSize.caption, sizes.fontSize.caption);
        img.tintColor = tint;
      } else {
        const label = tag.addText(text);
        label.font = Font.mediumSystemFont(sizes.fontSize.caption);
        label.textColor = tint;
      }
      return tag;
    }
    function addGlassSurface(stack) {
      stack.backgroundColor = CONFIG2.colors.fill;
      stack.cornerRadius = CONFIG2.designTokens.cornerRadius.card;
      stack.setPadding(
        CONFIG2.designTokens.compactSpacing,
        CONFIG2.designTokens.compactSpacing,
        CONFIG2.designTokens.compactSpacing,
        CONFIG2.designTokens.compactSpacing
      );
      return stack;
    }
    module2.exports = { typography, addSeparator, addTag, addGlassSurface };
  }
});

// src/data/data-source.js
var require_data_source = __commonJS({
  "src/data/data-source.js"(exports2, module2) {
    var { CONFIG: CONFIG2 } = require_config();
    var { ImageCache: ImageCache2 } = require_image_cache();
    var { addSeparator, addTag, typography } = require_design_system();
    var DataSource2 = class {
      constructor(config2, apiClient) {
        this.config = config2;
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
        icon.tintColor = this.config.color || CONFIG2.colors.accent;
        headerStack.addSpacer(sizes.spacing);
        const titleText = headerStack.addText(title);
        titleText.font = typography.title(sizes);
        titleText.textColor = CONFIG2.colors.label;
        if (options.subtitle) {
          headerStack.addSpacer(sizes.spacing);
          const sub = headerStack.addText(options.subtitle);
          sub.font = Font.systemFont(sizes.fontSize.tertiary);
          sub.textColor = CONFIG2.colors.secondaryLabel;
        }
      }
      addBadge(parentStack, { text, icon, color, sizes }) {
        return addTag(parentStack, { text, icon, color, sizes });
      }
      addSourceBadge(stack, item, sizes) {
        const icons = this.constructor.sourceIcons || {};
        const colors = this.constructor.sourceColors || {};
        this.addBadge(stack, {
          icon: icons[item.source] || "questionmark.circle",
          color: colors[item.source] || CONFIG2.colors.accent,
          sizes
        });
      }
      static async preloadImages(items, urlKey, cacheKey) {
        await Promise.all(
          items.map(async (item) => {
            if (item[urlKey]) {
              item[cacheKey] = await ImageCache2.load(item[urlKey]);
            }
          })
        );
      }
      addCircularImage(stack, image, size) {
        const img = stack.addImage(image);
        img.imageSize = new Size(size, size);
        img.cornerRadius = size / 2;
      }
      renderItemList(stack, items, sizes, useSeparators = false, widgetSize = "medium") {
        items.forEach((item, index) => {
          this.renderItem(stack, item, sizes, widgetSize);
          if (index < items.length - 1) {
            stack.addSpacer(sizes.spacing);
            if (useSeparators) {
              addSeparator(stack);
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
        const gridStack = stack.addStack();
        gridStack.layoutHorizontally();
        for (let col = 0; col < columns; col++) {
          if (col > 0) gridStack.addSpacer(sizes.spacing * 2);
          const columnStack = gridStack.addStack();
          columnStack.layoutVertically();
          const colItems = items.filter((_, i) => i % columns === col);
          colItems.forEach((item, i) => {
            this.renderItem(columnStack, item, sizes, widgetSize);
            if (i < colItems.length - 1) columnStack.addSpacer(sizes.spacing);
          });
        }
      }
    };
    module2.exports = { DataSource: DataSource2 };
  }
});

// src/data/sources/billboard.js
var require_billboard = __commonJS({
  "src/data/sources/billboard.js"(exports2, module2) {
    var { CONFIG: CONFIG2 } = require_config();
    var { FormatUtils: FormatUtils2 } = require_format_utils();
    var { DataSource: DataSource2 } = require_data_source();
    var BillboardDataSource2 = class _BillboardDataSource extends DataSource2 {
      isEmpty(data) {
        return !data.items || data.items.length === 0;
      }
      async fetchData(widgetSize) {
        const response = await this.api.fetch(this.config.endpoint);
        if (!response.music?.data) {
          throw new Error("Invalid Billboard data structure");
        }
        const limit = CONFIG2.sizing[widgetSize].maxItems;
        const items = response.music.data.slice(0, limit).map((item) => ({
          position: item.position,
          title: FormatUtils2.cleanTitle(item.title),
          subtitle: item.artist,
          coverUrl: item.cover || null,
          metadata: {
            last_week: item.last_week,
            peak: item.peak,
            weeks: item.weeks
          }
        }));
        await DataSource2.preloadImages(items, "coverUrl", "cover");
        return {
          title: response.music.data_title || "Billboard 200",
          subtitle: response.music.data_desc || "",
          items
        };
      }
      static getTrend(current, lastWeek) {
        if (lastWeek === 0) return { char: "\u2605", color: CONFIG2.colors.new };
        if (current < lastWeek) return { char: "\u2191", color: CONFIG2.colors.up };
        if (current > lastWeek) return { char: "\u2193", color: CONFIG2.colors.down };
        return { char: "\u2212", color: CONFIG2.colors.unchanged };
      }
      renderWidget(widget, data, widgetSize) {
        const sizes = CONFIG2.sizing[widgetSize];
        this.addHeader(widget, data.title, sizes);
        widget.addSpacer(sizes.spacing);
        const contentStack = widget.addStack();
        this.renderGrid(contentStack, data.items, sizes, widgetSize);
      }
      renderItem(stack, item, sizes, widgetSize = "medium") {
        const itemStack = stack.addStack();
        itemStack.layoutHorizontally();
        itemStack.centerAlignContent();
        if (item.cover) {
          const imgSize = CONFIG2.images.gridTall[widgetSize];
          const coverImg = itemStack.addImage(item.cover);
          coverImg.imageSize = new Size(imgSize.width, imgSize.height);
          coverImg.cornerRadius = imgSize.cornerRadius;
          itemStack.addSpacer(sizes.spacing);
        }
        const textStack = itemStack.addStack();
        textStack.layoutVertically();
        const titleRow = textStack.addStack();
        titleRow.layoutHorizontally();
        titleRow.centerAlignContent();
        const titleText = titleRow.addText(FormatUtils2.truncate(item.title, 28));
        titleText.font = Font.semiboldSystemFont(sizes.fontSize.primary);
        titleText.textColor = CONFIG2.colors.label;
        titleText.lineLimit = 1;
        titleRow.addSpacer(sizes.spacing);
        const { char, color } = _BillboardDataSource.getTrend(
          item.position,
          item.metadata.last_week
        );
        const indicatorText = titleRow.addText(char);
        indicatorText.font = Font.systemFont(sizes.fontSize.secondary);
        indicatorText.textColor = color;
        const subtitleText = textStack.addText(
          FormatUtils2.truncate(item.subtitle, 30)
        );
        subtitleText.font = Font.systemFont(sizes.fontSize.secondary);
        subtitleText.textColor = CONFIG2.colors.secondaryLabel;
        subtitleText.lineLimit = 1;
        if (item.metadata.weeks) {
          const metaText = textStack.addText(
            FormatUtils2.pluralize(item.metadata.weeks, "week")
          );
          metaText.font = Font.systemFont(sizes.fontSize.tertiary);
          metaText.textColor = CONFIG2.colors.tertiaryLabel;
        }
        itemStack.addSpacer();
      }
    };
    module2.exports = { BillboardDataSource: BillboardDataSource2 };
  }
});

// src/data/sources/imdb.js
var require_imdb = __commonJS({
  "src/data/sources/imdb.js"(exports2, module2) {
    var { CONFIG: CONFIG2 } = require_config();
    var { FormatUtils: FormatUtils2 } = require_format_utils();
    var { DataSource: DataSource2 } = require_data_source();
    var IMDbDataSource2 = class _IMDbDataSource extends DataSource2 {
      isEmpty(data) {
        return (!data.movies || data.movies.length === 0) && (!data.tvShows || data.tvShows.length === 0);
      }
      async fetchData(widgetSize) {
        const response = await this.api.fetch(this.config.endpoint);
        const limit = CONFIG2.sizing[widgetSize].maxItems;
        const half = Math.ceil(limit / 2);
        const movies = response.movies?.data && Array.isArray(response.movies.data) ? response.movies.data.slice(0, half).map((m) => this.formatItem(m, "movie")) : [];
        const tvShows = widgetSize !== "small" && response.tv_shows?.data && Array.isArray(response.tv_shows.data) ? response.tv_shows.data.slice(0, half).map((t) => this.formatItem(t, "tv")) : [];
        await DataSource2.preloadImages(
          [...movies, ...tvShows],
          "imageUrl",
          "poster"
        );
        return {
          movies,
          tvShows
        };
      }
      formatItem(item, type) {
        const subtitleParts = [];
        if (item.year) subtitleParts.push(item.year);
        if (item.length) subtitleParts.push(item.length);
        return {
          title: FormatUtils2.truncate(item.title, 30),
          subtitle: subtitleParts.join(" \u2022 "),
          rating: item.rating,
          genre: item.genre || "",
          url: item.href || "",
          type,
          imageUrl: item.image || null,
          poster: null
        };
      }
      static getRatingColor(rating) {
        if (rating === "") return CONFIG2.colors.new;
        const value = parseFloat(rating);
        if (isNaN(value)) return CONFIG2.colors.accent;
        if (value >= 7) return CONFIG2.colors.up;
        if (value >= 5) return CONFIG2.colors.warning;
        return CONFIG2.colors.down;
      }
      renderWidget(widget, data, widgetSize) {
        const sizes = CONFIG2.sizing[widgetSize];
        this.addHeader(widget, "Popular on IMDb", sizes, {
          subtitle: "Movies \xB7 TV"
        });
        widget.addSpacer(sizes.spacing);
        const allItems = [
          ...data.movies.map((m) => ({ ...m, type: "movie" })),
          ...data.tvShows.map((t) => ({ ...t, type: "tv" }))
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
          const imgSize = CONFIG2.images.gridTall[widgetSize];
          const coverImg = itemStack.addImage(item.poster);
          coverImg.imageSize = new Size(imgSize.width, imgSize.height);
          coverImg.cornerRadius = imgSize.cornerRadius;
          itemStack.addSpacer(sizes.spacing);
        }
        const textStack = itemStack.addStack();
        textStack.layoutVertically();
        const titleText = textStack.addText(FormatUtils2.truncate(item.title, 30));
        titleText.font = Font.semiboldSystemFont(sizes.fontSize.primary);
        titleText.textColor = CONFIG2.colors.label;
        titleText.lineLimit = 1;
        const metaText = textStack.addText(item.subtitle);
        metaText.font = Font.systemFont(sizes.fontSize.secondary);
        metaText.textColor = CONFIG2.colors.secondaryLabel;
        metaText.lineLimit = 1;
        const badgeStack = textStack.addStack();
        badgeStack.addSpacer(2);
        this.addBadge(badgeStack, {
          text: item.rating === "" ? "NEW" : String(item.rating ?? ""),
          color: _IMDbDataSource.getRatingColor(item.rating),
          sizes
        });
      }
    };
    module2.exports = { IMDbDataSource: IMDbDataSource2 };
  }
});

// src/data/sources/steam.js
var require_steam = __commonJS({
  "src/data/sources/steam.js"(exports2, module2) {
    var { CONFIG: CONFIG2 } = require_config();
    var { FormatUtils: FormatUtils2 } = require_format_utils();
    var { DataSource: DataSource2 } = require_data_source();
    var SteamDataSource2 = class extends DataSource2 {
      isEmpty(data) {
        return !data.games || data.games.length === 0;
      }
      async fetchData(widgetSize) {
        if (!this.config.profiles || this.config.profiles.length === 0) {
          throw new Error("Set steam profiles in CONFIG");
        }
        const profiles = this.config.profiles.join(",");
        const response = await this.api.fetch(this.config.endpoint, { profiles });
        const limit = CONFIG2.sizing[widgetSize].maxItems;
        const allGames = [];
        for (const userData of Object.values(response)) {
          if (userData.recentGames) {
            userData.recentGames.forEach((game) => {
              allGames.push({
                name: game.name,
                hoursPlayed: game.hoursPlayedNumeric || 0,
                lastPlayedShort: game.lastPlayedShort,
                iconUrl: game.iconUrl || null,
                storeUrl: game.storeUrl || ""
              });
            });
          }
        }
        allGames.sort((a, b) => b.hoursPlayed - a.hoursPlayed);
        const games = allGames.slice(0, limit);
        await DataSource2.preloadImages(games, "iconUrl", "icon");
        return {
          games
        };
      }
      renderWidget(widget, data, widgetSize) {
        const sizes = CONFIG2.sizing[widgetSize];
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
          const imgSize = CONFIG2.images.grid[widgetSize];
          const iconImg = itemStack.addImage(game.icon);
          iconImg.imageSize = new Size(imgSize.width, imgSize.height);
          iconImg.cornerRadius = imgSize.cornerRadius;
        } else {
          const imgSize = CONFIG2.images.grid[widgetSize];
          const icon = itemStack.addImage(
            SFSymbol.named("gamecontroller.fill").image
          );
          icon.imageSize = new Size(imgSize.width, imgSize.height);
          icon.tintColor = CONFIG2.colors.secondaryLabel;
        }
        itemStack.addSpacer(sizes.spacing);
        const textStack = itemStack.addStack();
        textStack.layoutVertically();
        const titleText = textStack.addText(FormatUtils2.truncate(game.name, 35));
        titleText.font = Font.semiboldSystemFont(sizes.fontSize.primary);
        titleText.textColor = CONFIG2.colors.label;
        titleText.lineLimit = 1;
        const metaText = textStack.addText(
          `${FormatUtils2.formatDuration(game.hoursPlayed)} \u2022 ${game.lastPlayedShort}`
        );
        metaText.font = Font.systemFont(sizes.fontSize.secondary);
        metaText.textColor = CONFIG2.colors.secondaryLabel;
        itemStack.addSpacer();
      }
    };
    module2.exports = { SteamDataSource: SteamDataSource2 };
  }
});

// src/data/sources/hacker-news.js
var require_hacker_news = __commonJS({
  "src/data/sources/hacker-news.js"(exports2, module2) {
    var { CONFIG: CONFIG2 } = require_config();
    var { FormatUtils: FormatUtils2 } = require_format_utils();
    var { DataSource: DataSource2 } = require_data_source();
    var HackerNewsDataSource2 = class extends DataSource2 {
      isEmpty(data) {
        return !data.stories || data.stories.length === 0;
      }
      async fetchData(widgetSize) {
        const response = await this.api.fetch(this.config.endpoint);
        const limit = CONFIG2.sizing[widgetSize].maxItems;
        return {
          stories: response.stories.slice(0, limit).map((story) => ({
            title: story.title,
            points: story.points,
            comments: story.numComments,
            author: story.author,
            timeAgo: story.timePosted,
            url: story.url,
            domain: story.domain || "",
            hnUrl: story.hnUrl || ""
          }))
        };
      }
      renderWidget(widget, data, widgetSize) {
        const sizes = CONFIG2.sizing[widgetSize];
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
        const titleText = textStack.addText(FormatUtils2.truncate(story.title, 60));
        titleText.font = Font.semiboldSystemFont(sizes.fontSize.primary);
        titleText.textColor = CONFIG2.colors.label;
        titleText.lineLimit = 1;
        const metaText = textStack.addText(
          `${story.points}pts \xB7 ${story.comments}cmt`
        );
        metaText.font = Font.systemFont(sizes.fontSize.tertiary);
        metaText.textColor = CONFIG2.colors.tertiaryLabel;
        metaText.lineLimit = 1;
        itemStack.addSpacer();
      }
    };
    module2.exports = { HackerNewsDataSource: HackerNewsDataSource2 };
  }
});

// src/data/sources/github.js
var require_github = __commonJS({
  "src/data/sources/github.js"(exports2, module2) {
    var { CONFIG: CONFIG2 } = require_config();
    var { FormatUtils: FormatUtils2 } = require_format_utils();
    var { DataSource: DataSource2 } = require_data_source();
    var GitHubDataSource2 = class extends DataSource2 {
      isEmpty(data) {
        return !data.releases || data.releases.length === 0;
      }
      async fetchData(widgetSize) {
        const releases = await this.fetchReleases(widgetSize);
        await DataSource2.preloadImages(releases, "authorAvatarUrl", "authorAvatar");
        return { releases };
      }
      async fetchReleases(widgetSize) {
        if (!this.config.repos || this.config.repos.length === 0) {
          throw new Error("Set github repos in CONFIG");
        }
        const repos = this.config.repos.join(",");
        const response = await this.api.fetch(this.config.endpoint, { repos });
        const limit = CONFIG2.sizing[widgetSize].maxItems;
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
          authorAvatar: null
        }));
      }
      extractRepoName(repoString) {
        if (repoString.includes("/")) {
          return repoString.split("/").pop();
        }
        return repoString;
      }
      renderWidget(widget, data, widgetSize) {
        const sizes = CONFIG2.sizing[widgetSize];
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
        const titleText = titleRow.addText(FormatUtils2.truncate(item.tagName, 40));
        titleText.font = Font.semiboldSystemFont(sizes.fontSize.primary);
        titleText.textColor = CONFIG2.colors.label;
        titleText.lineLimit = 1;
        if (item.isPrerelease) {
          titleRow.addSpacer(4);
          const preText = titleRow.addText("pre-release");
          preText.font = Font.systemFont(sizes.fontSize.tertiary);
          preText.textColor = CONFIG2.colors.warning;
        }
        const repoText = textStack.addText(item.repo);
        repoText.font = Font.mediumSystemFont(sizes.fontSize.secondary);
        repoText.textColor = CONFIG2.colors.secondaryLabel;
        repoText.lineLimit = 1;
        const metaText = textStack.addText(`${item.author} \xB7 ${item.timeAgo}`);
        metaText.font = Font.systemFont(sizes.fontSize.tertiary);
        metaText.textColor = CONFIG2.colors.tertiaryLabel;
        metaText.lineLimit = 1;
      }
    };
    module2.exports = { GitHubDataSource: GitHubDataSource2 };
  }
});

// src/data/sources/wikipedia.js
var require_wikipedia = __commonJS({
  "src/data/sources/wikipedia.js"(exports2, module2) {
    var { CONFIG: CONFIG2 } = require_config();
    var { FormatUtils: FormatUtils2 } = require_format_utils();
    var { DataSource: DataSource2 } = require_data_source();
    var WikipediaDataSource2 = class extends DataSource2 {
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
            CONFIG2.sizing[widgetSize].maxItems
          )
        };
        const response = await this.api.post(this.config.endpoint, body);
        if (!response || !Array.isArray(response.edits)) {
          return { edits: [], errors: null };
        }
        return {
          edits: response.edits.map((edit) => ({
            title: FormatUtils2.truncate(edit.title, 40),
            language: edit.language,
            user: edit.creator,
            timeAgo: edit.timeAgo,
            comment: FormatUtils2.truncate(
              FormatUtils2.stripHtml(edit.description || ""),
              60
            ),
            url: edit.link
          })),
          errors: response.errors || null
        };
      }
      renderWidget(widget, data, widgetSize) {
        const sizes = CONFIG2.sizing[widgetSize];
        this.addHeader(widget, "Recent Edits", sizes);
        if (data.errors && data.errors.length > 0) {
          const errorStack = widget.addStack();
          errorStack.layoutHorizontally();
          errorStack.centerAlignContent();
          const warnIcon = errorStack.addImage(
            SFSymbol.named("exclamationmark.triangle.fill").image
          );
          warnIcon.imageSize = new Size(
            sizes.fontSize.tertiary,
            sizes.fontSize.tertiary
          );
          warnIcon.tintColor = CONFIG2.colors.warning;
          errorStack.addSpacer(3);
          const errLangs = data.errors.map((e) => e.language).join(", ");
          const errText = errorStack.addText(`Failed: ${errLangs}`);
          errText.font = Font.systemFont(sizes.fontSize.tertiary);
          errText.textColor = CONFIG2.colors.warning;
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
        const titleText = textStack.addText(FormatUtils2.truncate(edit.title, 40));
        titleText.font = Font.semiboldSystemFont(sizes.fontSize.primary);
        titleText.textColor = CONFIG2.colors.label;
        titleText.lineLimit = 1;
        if (edit.comment && edit.comment !== "N/A") {
          const commentText = textStack.addText(edit.comment);
          commentText.font = Font.systemFont(sizes.fontSize.secondary);
          commentText.textColor = CONFIG2.colors.secondaryLabel;
          commentText.lineLimit = 1;
        }
        const userText = textStack.addText(edit.user);
        userText.font = Font.mediumSystemFont(sizes.fontSize.secondary);
        userText.textColor = CONFIG2.colors.secondaryLabel;
        userText.lineLimit = 1;
        const timeText = textStack.addText(edit.timeAgo);
        timeText.font = Font.systemFont(sizes.fontSize.tertiary);
        timeText.textColor = CONFIG2.colors.tertiaryLabel;
        timeText.lineLimit = 1;
      }
    };
    module2.exports = { WikipediaDataSource: WikipediaDataSource2 };
  }
});

// src/data/sources/timeline.js
var require_timeline = __commonJS({
  "src/data/sources/timeline.js"(exports2, module2) {
    var { CONFIG: CONFIG2 } = require_config();
    var { FormatUtils: FormatUtils2 } = require_format_utils();
    var { DataSource: DataSource2 } = require_data_source();
    var TimelineDataSource2 = class extends DataSource2 {
      isEmpty(data) {
        return !data.events || data.events.length === 0;
      }
      async fetchData(widgetSize) {
        const params = this.category ? { category: this.category } : {};
        const response = await this.api.fetch(this.config.endpoint, params);
        const timelineLimits = { small: 4, medium: 4, large: 8 };
        const limit = timelineLimits[widgetSize] ?? CONFIG2.sizing[widgetSize].maxItems;
        if (!response || !Array.isArray(response)) {
          return { events: [] };
        }
        return {
          events: response.slice(0, limit).map((item) => ({
            title: item.title,
            source: item.source,
            date: item.date,
            url: item.url
          }))
        };
      }
      renderWidget(widget, data, widgetSize) {
        const sizes = CONFIG2.sizing[widgetSize];
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
        titleText.font = Font.semiboldSystemFont(sizes.fontSize.primary);
        titleText.textColor = CONFIG2.colors.label;
        titleText.lineLimit = 2;
        const timeText = textStack.addText(FormatUtils2.formatTimeAgo(event.date));
        timeText.font = Font.systemFont(sizes.fontSize.tertiary);
        timeText.textColor = CONFIG2.colors.secondaryLabel;
        itemStack.addSpacer();
      }
    };
    __publicField(TimelineDataSource2, "sourceIcons", {
      github: "chevron.left.forwardslash.chevron.right",
      wikipedia: "book.fill",
      blog: "doc.text.fill",
      gallery: "photo.fill",
      imdb: "film.fill"
    });
    __publicField(TimelineDataSource2, "sourceColors", {
      github: new Color("#6e5494"),
      wikipedia: new Color("#636466"),
      blog: new Color("#007AFF"),
      gallery: new Color("#34C759"),
      imdb: new Color("#F5C518")
    });
    module2.exports = { TimelineDataSource: TimelineDataSource2 };
  }
});

// src/data/sources/bookmarks.js
var require_bookmarks = __commonJS({
  "src/data/sources/bookmarks.js"(exports2, module2) {
    var { CONFIG: CONFIG2 } = require_config();
    var { FormatUtils: FormatUtils2 } = require_format_utils();
    var { DataSource: DataSource2 } = require_data_source();
    var BookmarksDataSource2 = class extends DataSource2 {
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
            (b) => Array.isArray(b.tags) && b.tags.some((t) => t.toLowerCase() === tag)
          );
        }
        const limit = CONFIG2.sizing[widgetSize].maxItems;
        return {
          bookmarks: bookmarks.slice(0, limit).map((b) => ({
            title: FormatUtils2.truncate(b.title || b.url, 45),
            description: FormatUtils2.truncate(b.description || "", 60),
            tags: b.tags || [],
            url: b.url,
            domain: b.url ? b.url.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0] : "",
            dateAdded: b.date_added
          }))
        };
      }
      renderWidget(widget, data, widgetSize) {
        const sizes = CONFIG2.sizing[widgetSize];
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
            color: CONFIG2.colors.accent,
            sizes
          });
          itemStack.addSpacer(sizes.spacing);
        }
        const textStack = itemStack.addStack();
        textStack.layoutVertically();
        const titleText = textStack.addText(item.title);
        titleText.font = Font.semiboldSystemFont(sizes.fontSize.primary);
        titleText.textColor = CONFIG2.colors.label;
        titleText.lineLimit = 1;
        const urlText = textStack.addText(item.domain);
        urlText.font = Font.systemFont(sizes.fontSize.tertiary);
        urlText.textColor = CONFIG2.colors.tertiaryLabel;
        urlText.lineLimit = 1;
      }
    };
    module2.exports = { BookmarksDataSource: BookmarksDataSource2 };
  }
});

// src/data/sources/books.js
var require_books = __commonJS({
  "src/data/sources/books.js"(exports2, module2) {
    var { CONFIG: CONFIG2 } = require_config();
    var { APIClient: APIClient2 } = require_api_client();
    var { ImageCache: ImageCache2 } = require_image_cache();
    var { FormatUtils: FormatUtils2 } = require_format_utils();
    var { DataSource: DataSource2 } = require_data_source();
    var BooksDataSource2 = class extends DataSource2 {
      isEmpty(data) {
        return !data.title;
      }
      async fetchData(widgetSize) {
        const isbn = this.isbn || this.config.defaultIsbn;
        if (!isbn) {
          throw new Error("Set defaultIsbn in CONFIG or use books:<isbn>");
        }
        const booksApi = new APIClient2(this.config.apiUrl);
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
          categories: book.categories ? book.categories.join(", ") : "Uncategorized",
          maturityRating: CONFIG2.maturityMap[book.maturityRating] || book.maturityRating,
          language: CONFIG2.languageMap[book.language] || book.language
        };
        const [coverImage, goodreadsIcon] = await Promise.all([
          thumbnailUrl ? ImageCache2.load(thumbnailUrl) : Promise.resolve(null),
          widgetSize !== "small" ? ImageCache2.load(this.config.goodreadsIconUrl) : Promise.resolve(null)
        ]);
        data.coverImage = coverImage;
        data.goodreadsIcon = goodreadsIcon;
        return data;
      }
      renderWidget(widget, data, widgetSize) {
        const sizes = CONFIG2.sizing[widgetSize];
        this.addHeader(widget, "Currently Reading", sizes);
        widget.addSpacer(sizes.spacing);
        const bodyStack = widget.addStack();
        bodyStack.layoutHorizontally();
        if (widgetSize !== "small" && data.coverImage) {
          const coverStack = bodyStack.addStack();
          coverStack.layoutVertically();
          coverStack.centerAlignContent();
          const cover = coverStack.addImage(data.coverImage);
          cover.cornerRadius = CONFIG2.designTokens.cornerRadius.cover;
          cover.centerAlignImage();
          const imgSize = CONFIG2.images.card[widgetSize];
          cover.imageSize = new Size(imgSize.width, imgSize.height);
          bodyStack.addSpacer(sizes.spacing * 2);
        }
        const infoStack = bodyStack.addStack();
        infoStack.layoutVertically();
        const titleText = infoStack.addText(FormatUtils2.truncate(data.title, 40));
        titleText.font = Font.semiboldSystemFont(sizes.fontSize.primary);
        titleText.textColor = CONFIG2.colors.label;
        titleText.lineLimit = 2;
        const authorsText = infoStack.addText(data.authors);
        authorsText.font = Font.mediumSystemFont(sizes.fontSize.secondary);
        authorsText.textColor = CONFIG2.colors.secondaryLabel;
        authorsText.lineLimit = 1;
        if (widgetSize !== "small") {
          infoStack.addSpacer(sizes.spacing);
          const detailText = infoStack.addText(
            `${data.pageCount} pages \xB7 ${data.publisher}, ${data.publishedDate}`
          );
          detailText.font = Font.systemFont(sizes.fontSize.tertiary);
          detailText.textColor = CONFIG2.colors.tertiaryLabel;
          detailText.lineLimit = 1;
          const metaText = infoStack.addText(
            `${data.categories} \xB7 ${data.language}`
          );
          metaText.font = Font.systemFont(sizes.fontSize.tertiary);
          metaText.textColor = CONFIG2.colors.tertiaryLabel;
        }
        if (widgetSize === "small" && data.coverImage) {
          infoStack.addSpacer(sizes.spacing);
          const coverStack = infoStack.addStack();
          coverStack.centerAlignContent();
          const cover = coverStack.addImage(data.coverImage);
          cover.cornerRadius = CONFIG2.designTokens.cornerRadius.cover;
          cover.centerAlignImage();
          const smallImgSize = CONFIG2.images.card.small;
          cover.imageSize = new Size(smallImgSize.width, smallImgSize.height);
        }
        bodyStack.addSpacer();
        if (widgetSize !== "small" && data.goodreadsIcon) {
          const iconStack = bodyStack.addStack();
          iconStack.layoutVertically();
          iconStack.centerAlignContent();
          const icon = iconStack.addImage(data.goodreadsIcon);
          icon.cornerRadius = CONFIG2.designTokens.cornerRadius.cover;
          icon.centerAlignImage();
          icon.imageSize = new Size(25, 25);
          icon.url = "goodreads://";
        }
      }
    };
    module2.exports = { BooksDataSource: BooksDataSource2 };
  }
});

// src/data/sources/astronomy.js
var require_astronomy = __commonJS({
  "src/data/sources/astronomy.js"(exports2, module2) {
    var { CONFIG: CONFIG2 } = require_config();
    var { APIClient: APIClient2 } = require_api_client();
    var { CacheManager: CacheManager2 } = require_cache_manager();
    var { FormatUtils: FormatUtils2 } = require_format_utils();
    var { DataSource: DataSource2 } = require_data_source();
    var _AstronomyDataSource = class _AstronomyDataSource extends DataSource2 {
      async getLocation() {
        if (this.config.latitude && this.config.longitude) {
          return {
            latitude: parseFloat(this.config.latitude),
            longitude: parseFloat(this.config.longitude)
          };
        }
        const cached = await CacheManager2.load("_location");
        if (cached && cached.data) {
          return cached.data;
        }
        const location = await Location.current();
        const coords = {
          latitude: location.latitude,
          longitude: location.longitude
        };
        CacheManager2.save("_location", coords);
        return coords;
      }
      async fetchData(widgetSize) {
        const loc = await this.getLocation();
        const lat = loc.latitude;
        const lon = loc.longitude;
        const weatherApi = new APIClient2(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=sunrise,sunset,uv_index_max&current=temperature_2m,weather_code&timezone=auto`
        );
        const weather = await weatherApi.fetch("");
        if (!weather || !weather.daily) {
          return {};
        }
        const daily = weather.daily;
        const sunrise = daily.sunrise[0];
        const sunset = daily.sunset[0];
        const sunriseDate = new Date(sunrise);
        const sunsetDate = new Date(sunset);
        const goldenMorningStart = new Date(sunriseDate.getTime() - 30 * 6e4);
        const goldenMorningEnd = new Date(sunriseDate.getTime() + 30 * 6e4);
        const goldenEveningStart = new Date(sunsetDate.getTime() - 30 * 6e4);
        const goldenEveningEnd = new Date(sunsetDate.getTime() + 30 * 6e4);
        const moonPhase = this.calculateMoonPhase(/* @__PURE__ */ new Date());
        return {
          sunrise,
          sunset,
          uvIndex: daily.uv_index_max[0],
          temperature: weather.current?.temperature_2m,
          weatherCode: weather.current?.weather_code,
          moonPhase,
          goldenMorning: { start: goldenMorningStart, end: goldenMorningEnd },
          goldenEvening: { start: goldenEveningStart, end: goldenEveningEnd }
        };
      }
      calculateMoonPhase(date) {
        const knownNewMoon = /* @__PURE__ */ new Date("2024-01-11T11:57:00Z");
        const synodicMonth = 29.53058770576;
        const daysSince = (date - knownNewMoon) / (1e3 * 60 * 60 * 24);
        const phase = (daysSince % synodicMonth + synodicMonth) % synodicMonth;
        return phase / synodicMonth;
      }
      getMoonPhaseInfo(phase) {
        const index = Math.round(phase * 8) % 8;
        return _AstronomyDataSource.moonPhases[index];
      }
      isEmpty(data) {
        return !data || !data.sunrise;
      }
      renderWidget(widget, data, widgetSize) {
        const sizes = CONFIG2.sizing[widgetSize];
        this.addHeader(widget, "Astronomy", sizes);
        widget.addSpacer(sizes.spacing);
        const contentStack = widget.addStack();
        contentStack.layoutVertically();
        this.renderSunRow(contentStack, data, sizes);
        contentStack.addSpacer(sizes.spacing);
        this.renderMoonRow(contentStack, data, sizes);
        if (widgetSize !== "small") {
          contentStack.addSpacer(sizes.spacing);
          this.renderUvRow(contentStack, data, sizes);
          contentStack.addSpacer(sizes.spacing);
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
        sunriseIcon.tintColor = CONFIG2.colors.warning;
        row.addSpacer(CONFIG2.designTokens.compactSpacing);
        const sunriseText = row.addText(FormatUtils2.formatTime(data.sunrise));
        sunriseText.font = Font.mediumSystemFont(sizes.fontSize.primary);
        sunriseText.textColor = CONFIG2.colors.label;
        row.addSpacer(sizes.spacing * 2);
        const sunsetIcon = row.addImage(SFSymbol.named("sunset.fill").image);
        sunsetIcon.imageSize = new Size(sizes.iconSize, sizes.iconSize);
        sunsetIcon.tintColor = CONFIG2.colors.sunset;
        row.addSpacer(CONFIG2.designTokens.compactSpacing);
        const sunsetText = row.addText(FormatUtils2.formatTime(data.sunset));
        sunsetText.font = Font.mediumSystemFont(sizes.fontSize.primary);
        sunsetText.textColor = CONFIG2.colors.label;
      }
      renderMoonRow(stack, data, sizes) {
        const row = stack.addStack();
        row.layoutHorizontally();
        row.centerAlignContent();
        const moonInfo = this.getMoonPhaseInfo(data.moonPhase);
        const moonIcon = row.addImage(SFSymbol.named(moonInfo.icon).image);
        moonIcon.imageSize = new Size(sizes.iconSize, sizes.iconSize);
        moonIcon.tintColor = CONFIG2.colors.label;
        row.addSpacer(CONFIG2.designTokens.compactSpacing);
        const moonText = row.addText(moonInfo.name);
        moonText.font = Font.mediumSystemFont(sizes.fontSize.primary);
        moonText.textColor = CONFIG2.colors.label;
        row.addSpacer(sizes.spacing);
        const pctText = row.addText(`${Math.round(data.moonPhase * 100)}%`);
        pctText.font = Font.systemFont(sizes.fontSize.tertiary);
        pctText.textColor = CONFIG2.colors.secondaryLabel;
      }
      renderUvRow(stack, data, sizes) {
        const row = stack.addStack();
        row.layoutHorizontally();
        row.centerAlignContent();
        const uvIcon = row.addImage(SFSymbol.named("sun.max.fill").image);
        uvIcon.imageSize = new Size(sizes.iconSize, sizes.iconSize);
        uvIcon.tintColor = CONFIG2.colors.warning;
        row.addSpacer(CONFIG2.designTokens.compactSpacing);
        const label = row.addText("UV Index");
        label.font = Font.systemFont(sizes.fontSize.secondary);
        label.textColor = CONFIG2.colors.secondaryLabel;
        row.addSpacer(sizes.spacing);
        const uvValue = Math.round(data.uvIndex);
        const uvColor = uvValue >= 6 ? CONFIG2.colors.down : uvValue >= 3 ? CONFIG2.colors.warning : CONFIG2.colors.up;
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
        ghIcon.tintColor = CONFIG2.colors.golden;
        row.addSpacer(CONFIG2.designTokens.compactSpacing);
        const morningText = `${FormatUtils2.formatTime(data.goldenMorning.start)}\u2013${FormatUtils2.formatTime(data.goldenMorning.end)}`;
        const eveningText = `${FormatUtils2.formatTime(data.goldenEvening.start)}\u2013${FormatUtils2.formatTime(data.goldenEvening.end)}`;
        const text = row.addText(`\u2191 ${morningText}  \u2193 ${eveningText}`);
        text.font = Font.systemFont(sizes.fontSize.secondary);
        text.textColor = CONFIG2.colors.label;
      }
      renderTemperatureRow(stack, data, sizes) {
        if (data.temperature === void 0) return;
        const row = stack.addStack();
        row.layoutHorizontally();
        row.centerAlignContent();
        const tempIcon = row.addImage(SFSymbol.named("thermometer.medium").image);
        tempIcon.imageSize = new Size(sizes.iconSize, sizes.iconSize);
        tempIcon.tintColor = CONFIG2.colors.accent;
        row.addSpacer(CONFIG2.designTokens.compactSpacing);
        const tempText = row.addText(`${Math.round(data.temperature)}\xB0C`);
        tempText.font = Font.mediumSystemFont(sizes.fontSize.primary);
        tempText.textColor = CONFIG2.colors.label;
      }
    };
    __publicField(_AstronomyDataSource, "moonPhases", [
      { name: "New Moon", icon: "moonphase.new.moon" },
      { name: "Waxing Crescent", icon: "moonphase.waxing.crescent" },
      { name: "First Quarter", icon: "moonphase.first.quarter" },
      { name: "Waxing Gibbous", icon: "moonphase.waxing.gibbous" },
      { name: "Full Moon", icon: "moonphase.full.moon" },
      { name: "Waning Gibbous", icon: "moonphase.waning.gibbous" },
      { name: "Last Quarter", icon: "moonphase.last.quarter" },
      { name: "Waning Crescent", icon: "moonphase.waning.crescent" }
    ]);
    var AstronomyDataSource2 = _AstronomyDataSource;
    module2.exports = { AstronomyDataSource: AstronomyDataSource2 };
  }
});

// src/data/sources/bluesky.js
var require_bluesky = __commonJS({
  "src/data/sources/bluesky.js"(exports2, module2) {
    var { CONFIG: CONFIG2 } = require_config();
    var { APIClient: APIClient2 } = require_api_client();
    var { FormatUtils: FormatUtils2 } = require_format_utils();
    var { DataSource: DataSource2 } = require_data_source();
    var BlueskyDataSource2 = class extends DataSource2 {
      async fetchData(widgetSize) {
        const handle = this.config.handle;
        if (!handle) {
          throw new Error("Set bluesky handle in CONFIG");
        }
        const sizes = CONFIG2.sizing[widgetSize];
        const limit = sizes.maxItems;
        const bskyApi = new APIClient2(
          `https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=${encodeURIComponent(handle)}&limit=${limit}&filter=posts_no_replies`
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
            isRepost: !!item.reason
          };
        });
        await DataSource2.preloadImages(posts, "avatarUrl", "avatar");
        return { posts };
      }
      isEmpty(data) {
        return !data || !data.posts || data.posts.length === 0;
      }
      renderWidget(widget, data, widgetSize) {
        const sizes = CONFIG2.sizing[widgetSize];
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
        if (item.avatar) {
          this.addCircularImage(itemStack, item.avatar, sizes.iconSize);
          itemStack.addSpacer(sizes.spacing);
        }
        const textStack = itemStack.addStack();
        textStack.layoutVertically();
        const titleText = textStack.addText(FormatUtils2.truncate(item.text, 60));
        titleText.font = Font.semiboldSystemFont(sizes.fontSize.primary);
        titleText.textColor = CONFIG2.colors.label;
        titleText.lineLimit = 2;
        const authorText = textStack.addText(item.author);
        authorText.font = Font.mediumSystemFont(sizes.fontSize.secondary);
        authorText.textColor = CONFIG2.colors.secondaryLabel;
        authorText.lineLimit = 1;
        const metaText = textStack.addText(
          `${item.likes} likes \xB7 ${item.replies} replies`
        );
        metaText.font = Font.systemFont(sizes.fontSize.tertiary);
        metaText.textColor = CONFIG2.colors.tertiaryLabel;
        metaText.lineLimit = 1;
      }
    };
    module2.exports = { BlueskyDataSource: BlueskyDataSource2 };
  }
});

// src/data/sources/activity.js
var require_activity = __commonJS({
  "src/data/sources/activity.js"(exports2, module2) {
    var { CONFIG: CONFIG2 } = require_config();
    var { FormatUtils: FormatUtils2 } = require_format_utils();
    var { DataSource: DataSource2 } = require_data_source();
    var { GitHubDataSource: GitHubDataSource2 } = require_github();
    var { WikipediaDataSource: WikipediaDataSource2 } = require_wikipedia();
    var ActivityDataSource2 = class extends DataSource2 {
      isEmpty(data) {
        return !data.items || data.items.length === 0;
      }
      async fetchData(widgetSize) {
        const limit = CONFIG2.sizing[widgetSize].maxItems;
        const githubConfig = CONFIG2.sources.github;
        const wikiConfig = CONFIG2.sources.wikipedia;
        const fetches = [];
        if (githubConfig) {
          const githubSource = new GitHubDataSource2(githubConfig, this.api);
          fetches.push(
            githubSource.fetchReleases(widgetSize).then(
              (releases) => releases.map((r) => ({
                source: "github",
                key: `${r.repo}:${r.tagName}`,
                title: `${r.repo} ${r.tagName}${r.isPrerelease ? " (pre)" : ""}`,
                detail: `${r.author} \u2022 ${r.timeAgo}`,
                url: r.url || ""
              }))
            ).catch(() => [])
          );
        }
        if (wikiConfig) {
          const wikiSource = new WikipediaDataSource2(wikiConfig, this.api);
          fetches.push(
            wikiSource.fetchData(widgetSize).then(
              (data) => (data.edits || []).map((e) => ({
                source: "wikipedia",
                key: `${e.language}:${e.title}`,
                title: e.title,
                detail: e.comment && e.comment !== "N/A" ? e.comment : `${e.user} \u2022 ${e.timeAgo}`,
                url: e.url || ""
              }))
            ).catch(() => [])
          );
        }
        const results = await Promise.all(fetches);
        return { items: results.flat().slice(0, limit) };
      }
      renderWidget(widget, data, widgetSize) {
        const sizes = CONFIG2.sizing[widgetSize];
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
        const titleText = textStack.addText(FormatUtils2.truncate(item.title, 45));
        titleText.font = Font.semiboldSystemFont(sizes.fontSize.primary);
        titleText.textColor = CONFIG2.colors.label;
        titleText.lineLimit = 1;
        const metaText = textStack.addText(item.detail);
        metaText.font = Font.systemFont(sizes.fontSize.tertiary);
        metaText.textColor = CONFIG2.colors.tertiaryLabel;
        metaText.lineLimit = 1;
      }
    };
    __publicField(ActivityDataSource2, "sourceIcons", {
      github: "chevron.left.forwardslash.chevron.right",
      wikipedia: "book.fill"
    });
    __publicField(ActivityDataSource2, "sourceColors", {
      github: new Color("#6e5494"),
      wikipedia: new Color("#636466")
    });
    module2.exports = { ActivityDataSource: ActivityDataSource2 };
  }
});

// src/data/sources/status-board.js
var require_status_board = __commonJS({
  "src/data/sources/status-board.js"(exports2, module2) {
    var { CONFIG: CONFIG2 } = require_config();
    var { CacheManager: CacheManager2 } = require_cache_manager();
    var { FormatUtils: FormatUtils2 } = require_format_utils();
    var { DataSource: DataSource2 } = require_data_source();
    var _StatusBoardDataSource = class _StatusBoardDataSource extends DataSource2 {
      async fetchData(widgetSize) {
        const { DataSourceFactory: DataSourceFactory2 } = require_data_source_factory();
        const boardSources = this.config.boardSources || [];
        const sizes = CONFIG2.sizing[widgetSize];
        const maxSources = widgetSize === "small" ? 2 : widgetSize === "medium" ? 3 : 5;
        const sourcesToFetch = boardSources.slice(0, maxSources);
        const results = await Promise.allSettled(
          sourcesToFetch.map(async (sourceName) => {
            try {
              const source = DataSourceFactory2.create(sourceName, this.api);
              const data = await source.fetchData(widgetSize);
              if (source.isEmpty(data)) {
                return {
                  name: sourceName,
                  config: CONFIG2.sources[sourceName],
                  topItem: null,
                  error: null
                };
              }
              const topItem = this.extractTopItem(sourceName, data);
              return {
                name: sourceName,
                config: CONFIG2.sources[sourceName],
                topItem,
                error: null
              };
            } catch (error) {
              const cached = await CacheManager2.load(sourceName);
              if (cached) {
                const topItem = this.extractTopItem(sourceName, cached.data);
                return {
                  name: sourceName,
                  config: CONFIG2.sources[sourceName],
                  topItem,
                  error: null
                };
              }
              return {
                name: sourceName,
                config: CONFIG2.sources[sourceName],
                topItem: null,
                error: error.message
              };
            }
          })
        );
        const sources = results.map(
          (r) => r.status === "fulfilled" ? r.value : { name: "unknown", topItem: null, error: r.reason }
        );
        return { sources };
      }
      extractTopItem(sourceName, data) {
        if (!data) return null;
        const extractor = _StatusBoardDataSource.topItemExtractors[sourceName];
        return extractor ? extractor(data) || null : null;
      }
      isEmpty(data) {
        return !data || !data.sources || data.sources.length === 0;
      }
      renderWidget(widget, data, widgetSize) {
        const sizes = CONFIG2.sizing[widgetSize];
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
        const iconName = source.config?.icon || "questionmark.circle";
        const icon = row.addImage(SFSymbol.named(iconName).image);
        icon.imageSize = new Size(sizes.iconSize, sizes.iconSize);
        icon.tintColor = source.config?.color || CONFIG2.colors.accent;
        row.addSpacer(sizes.spacing);
        if (source.error) {
          const errorText = row.addText(source.config?.name || source.name);
          errorText.font = Font.systemFont(sizes.fontSize.secondary);
          errorText.textColor = CONFIG2.colors.tertiaryLabel;
        } else if (source.topItem) {
          const textStack = row.addStack();
          textStack.layoutVertically();
          const itemText = textStack.addText(
            FormatUtils2.truncate(source.topItem, widgetSize === "small" ? 30 : 60)
          );
          itemText.font = Font.semiboldSystemFont(sizes.fontSize.primary);
          itemText.textColor = CONFIG2.colors.label;
          itemText.lineLimit = 1;
        } else {
          const emptyText = row.addText(
            `${source.config?.name || source.name} \u2014 no data`
          );
          emptyText.font = Font.systemFont(sizes.fontSize.secondary);
          emptyText.textColor = CONFIG2.colors.tertiaryLabel;
        }
      }
    };
    // Every entry in CONFIG.sources (other than statusboard itself) needs an extractor
    // here, or its Status Board row silently shows "no data" even with a successful fetch.
    __publicField(_StatusBoardDataSource, "topItemExtractors", {
      billboard: (data) => data.items?.[0] && `${data.items[0].title} \u2014 ${data.items[0].subtitle}`,
      imdb: (data) => data.movies?.[0] && `${data.movies[0].title} (${data.movies[0].year})`,
      steam: (data) => {
        const allGames = data.games || [];
        return allGames[0] && allGames[0].name;
      },
      hackernews: (data) => data.stories?.[0]?.title,
      github: (data) => data.releases?.[0] && `${data.releases[0].repo} ${data.releases[0].tagName}`,
      wikipedia: (data) => data.edits?.[0]?.title,
      timeline: (data) => data.events?.[0]?.title,
      bookmarks: (data) => data.bookmarks?.[0]?.title,
      bluesky: (data) => data.posts?.[0] && FormatUtils2.truncate(data.posts[0].text, 60),
      astronomy: () => "Astronomy data",
      "dhbw-timetable": (data) => data.events?.[0]?.name,
      books: (data) => data.title,
      activity: (data) => data.items?.[0]?.title
    });
    var StatusBoardDataSource2 = _StatusBoardDataSource;
    module2.exports = { StatusBoardDataSource: StatusBoardDataSource2 };
  }
});

// src/data/sources/dhbw-timetable.js
var require_dhbw_timetable = __commonJS({
  "src/data/sources/dhbw-timetable.js"(exports2, module2) {
    var { CONFIG: CONFIG2 } = require_config();
    var { FormatUtils: FormatUtils2 } = require_format_utils();
    var { DataSource: DataSource2 } = require_data_source();
    var DHBWTimetableDataSource2 = class extends DataSource2 {
      isEmpty(data) {
        return !data.events || data.events.length === 0;
      }
      async fetchData(widgetSize) {
        const response = await this.api.fetch(this.config.endpoint);
        if (!response || !Array.isArray(response.events)) {
          return { events: [], courseName: "", courseCode: "" };
        }
        const now = /* @__PURE__ */ new Date();
        const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
        let events = response.events.filter((e) => e.date >= todayStr).map((e) => ({
          id: e.id,
          name: e.name,
          type: e.type || "",
          date: e.date,
          startTime: e.startTime,
          endTime: e.endTime,
          lecturer: e.lecturer || "",
          rooms: e.rooms || [],
          course: e.course || ""
        })).sort((a, b) => {
          const dateCmp = a.date.localeCompare(b.date);
          if (dateCmp !== 0) return dateCmp;
          return a.startTime.localeCompare(b.startTime);
        });
        const limit = CONFIG2.sizing[widgetSize].maxItems;
        return {
          events: events.slice(0, limit),
          courseName: response.course?.name || "",
          courseCode: response.courseCode || ""
        };
      }
      renderWidget(widget, data, widgetSize) {
        const sizes = CONFIG2.sizing[widgetSize];
        const title = data.courseName || "DHBW Timetable";
        this.addHeader(widget, title, sizes);
        widget.addSpacer(sizes.spacing);
        if (data.events.length === 0) {
          const emptyText = widget.addText("No upcoming events");
          emptyText.font = Font.systemFont(sizes.fontSize.secondary);
          emptyText.textColor = CONFIG2.colors.secondaryLabel;
          emptyText.centerAlignText();
          return;
        }
        const contentStack = widget.addStack();
        contentStack.layoutVertically();
        const today = /* @__PURE__ */ new Date();
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
              FormatUtils2.formatDateLabel(event.date, today, tomorrow)
            );
            dateLabel.font = Font.semiboldSystemFont(sizes.fontSize.secondary);
            dateLabel.textColor = CONFIG2.colors.accent;
            contentStack.addSpacer(CONFIG2.designTokens.compactSpacing);
            lastDate = event.date;
          }
          this.renderItem(contentStack, event, sizes, widgetSize);
          if (index < data.events.length - 1) {
            const nextEvent = data.events[index + 1];
            if (nextEvent.date === event.date) {
              contentStack.addSpacer(CONFIG2.designTokens.compactSpacing);
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
          FormatUtils2.formatTime(event.startTime)
        );
        startText.font = Font.mediumSystemFont(sizes.fontSize.secondary);
        startText.textColor = CONFIG2.colors.label;
        startText.rightAlignText();
        const endText = timeColumn.addText(FormatUtils2.formatTime(event.endTime));
        endText.font = Font.systemFont(sizes.fontSize.tertiary);
        endText.textColor = CONFIG2.colors.secondaryLabel;
        endText.rightAlignText();
        if (widgetSize !== "small") {
          const divider = itemStack.addStack();
          divider.layoutVertically();
          divider.centerAlignContent();
          divider.setPadding(
            0,
            CONFIG2.designTokens.compactSpacing,
            0,
            CONFIG2.designTokens.compactSpacing
          );
          const dot = divider.addStack();
          dot.size = new Size(sizes.fontSize.tertiary, sizes.fontSize.tertiary);
          dot.cornerRadius = sizes.fontSize.tertiary / 2;
          dot.backgroundColor = CONFIG2.colors.dhbwTypes[event.type] || CONFIG2.colors.accent;
        }
        itemStack.addSpacer(CONFIG2.designTokens.compactSpacing);
        const textStack = itemStack.addStack();
        textStack.layoutVertically();
        const titleRow = textStack.addStack();
        titleRow.layoutHorizontally();
        titleRow.centerAlignContent();
        const nameText = titleRow.addText(FormatUtils2.truncate(event.name, 30));
        nameText.font = Font.semiboldSystemFont(sizes.fontSize.primary);
        nameText.textColor = CONFIG2.colors.label;
        nameText.lineLimit = 1;
        if (event.type) {
          titleRow.addSpacer(CONFIG2.designTokens.compactSpacing);
          this.addBadge(titleRow, {
            text: event.type,
            color: CONFIG2.colors.dhbwTypes[event.type] || CONFIG2.colors.accent,
            sizes
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
          const detailText = textStack.addText(detailParts.join(" \xB7 "));
          detailText.font = Font.systemFont(sizes.fontSize.tertiary);
          detailText.textColor = CONFIG2.colors.secondaryLabel;
          detailText.lineLimit = 1;
        }
        itemStack.addSpacer();
      }
    };
    module2.exports = { DHBWTimetableDataSource: DHBWTimetableDataSource2 };
  }
});

// src/data/data-source-factory.js
var require_data_source_factory = __commonJS({
  "src/data/data-source-factory.js"(exports2, module2) {
    var { CONFIG: CONFIG2 } = require_config();
    var { BillboardDataSource: BillboardDataSource2 } = require_billboard();
    var { IMDbDataSource: IMDbDataSource2 } = require_imdb();
    var { SteamDataSource: SteamDataSource2 } = require_steam();
    var { HackerNewsDataSource: HackerNewsDataSource2 } = require_hacker_news();
    var { GitHubDataSource: GitHubDataSource2 } = require_github();
    var { WikipediaDataSource: WikipediaDataSource2 } = require_wikipedia();
    var { TimelineDataSource: TimelineDataSource2 } = require_timeline();
    var { BookmarksDataSource: BookmarksDataSource2 } = require_bookmarks();
    var { BooksDataSource: BooksDataSource2 } = require_books();
    var { AstronomyDataSource: AstronomyDataSource2 } = require_astronomy();
    var { BlueskyDataSource: BlueskyDataSource2 } = require_bluesky();
    var { ActivityDataSource: ActivityDataSource2 } = require_activity();
    var { StatusBoardDataSource: StatusBoardDataSource2 } = require_status_board();
    var { DHBWTimetableDataSource: DHBWTimetableDataSource2 } = require_dhbw_timetable();
    var DataSourceFactory2 = class {
      static create(sourceName, apiClient) {
        let baseName = sourceName;
        let extra = null;
        if (sourceName.includes(":")) {
          [baseName, extra] = sourceName.split(":", 2);
        }
        const config2 = CONFIG2.sources[baseName];
        const SourceClass = this.sourceMap[baseName];
        if (!config2 || !SourceClass) {
          throw new Error(`Unknown source: ${sourceName}`);
        }
        const instance = new SourceClass(config2, apiClient);
        if (extra) {
          if (baseName === "books") {
            instance.isbn = extra;
          } else {
            instance.category = extra;
          }
        }
        return instance;
      }
    };
    __publicField(DataSourceFactory2, "sourceMap", {
      billboard: BillboardDataSource2,
      imdb: IMDbDataSource2,
      steam: SteamDataSource2,
      hackernews: HackerNewsDataSource2,
      github: GitHubDataSource2,
      wikipedia: WikipediaDataSource2,
      timeline: TimelineDataSource2,
      bookmarks: BookmarksDataSource2,
      books: BooksDataSource2,
      astronomy: AstronomyDataSource2,
      bluesky: BlueskyDataSource2,
      activity: ActivityDataSource2,
      statusboard: StatusBoardDataSource2,
      "dhbw-timetable": DHBWTimetableDataSource2
    });
    module2.exports = { DataSourceFactory: DataSourceFactory2 };
  }
});

// src/ui/config-ui.js
var require_config_ui = __commonJS({
  "src/ui/config-ui.js"(exports2, module2) {
    var { CONFIG: CONFIG2 } = require_config();
    var { ConfigManager: ConfigManager2 } = require_config_manager();
    async function showApiTokenSetupUI() {
      const alert = new Alert();
      alert.title = "API Token";
      alert.message = "Used to authenticate with api.michi.onl. Stored in Keychain, not synced via iCloud.";
      alert.addTextField("API Token", CONFIG2.apiToken || "");
      alert.addAction("Save");
      alert.addCancelAction("Cancel");
      const result = await alert.presentAlert();
      if (result === -1) return false;
      ConfigManager2.setApiToken(alert.textFieldValue(0).trim());
      return true;
    }
    async function showSetupUI(sourceName) {
      const config2 = CONFIG2.sources[sourceName];
      if (!config2) return false;
      const alert = new Alert();
      alert.title = `Configure ${config2.name}`;
      const editableFields = ConfigManager2.getEditableFields(sourceName);
      if (editableFields.length === 0) {
        alert.message = "No configurable settings for this source.";
        alert.addAction("OK");
        await alert.presentAlert();
        return false;
      }
      alert.message = "Edit settings below. Changes sync across devices via iCloud.";
      for (const field of editableFields) {
        const currentValue = config2[field.key];
        const displayValue = Array.isArray(currentValue) ? currentValue.join(", ") : currentValue || "";
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
          overrides[field.key] = value.split(",").map((s) => s.trim()).filter(Boolean);
        } else {
          overrides[field.key] = value;
        }
      });
      ConfigManager2.save({ [sourceName]: overrides });
      Object.assign(CONFIG2.sources[sourceName], overrides);
      return true;
    }
    module2.exports = { showApiTokenSetupUI, showSetupUI };
  }
});

// src/ui/source-picker.js
var require_source_picker = __commonJS({
  "src/ui/source-picker.js"(exports2, module2) {
    var { CONFIG: CONFIG2 } = require_config();
    var { ConfigManager: ConfigManager2 } = require_config_manager();
    var { showApiTokenSetupUI, showSetupUI } = require_config_ui();
    async function pickSource() {
      const sourceNames = Object.keys(CONFIG2.sources);
      const alert = new Alert();
      alert.title = "Mosaic";
      alert.message = "Choose a source to preview or configure.";
      alert.addAction("API Token \u2699\uFE0F");
      for (const name of sourceNames) {
        const src = CONFIG2.sources[name];
        const hasFields = ConfigManager2.getEditableFields(name).length > 0;
        alert.addAction(`${src.name}${hasFields ? " \u2699\uFE0F" : ""}`);
      }
      alert.addCancelAction("Cancel");
      const choice = await alert.presentAlert();
      if (choice === -1) return null;
      if (choice === 0) {
        await showApiTokenSetupUI();
        return pickSource();
      }
      const chosen = sourceNames[choice - 1];
      const editableFields = ConfigManager2.getEditableFields(chosen);
      if (editableFields.length > 0) {
        const actionAlert = new Alert();
        actionAlert.title = CONFIG2.sources[chosen].name;
        actionAlert.addAction("Show Widget");
        actionAlert.addAction("Configure");
        actionAlert.addCancelAction("Cancel");
        const action = await actionAlert.presentAlert();
        if (action === -1) return null;
        if (action === 1) {
          await showSetupUI(chosen);
        }
      }
      return chosen;
    }
    module2.exports = { pickSource };
  }
});

// src/ui/widget-chrome.js
var require_widget_chrome = __commonJS({
  "src/ui/widget-chrome.js"(exports2, module2) {
    var { CONFIG: CONFIG2 } = require_config();
    var { addSeparator, typography } = require_design_system();
    var ERROR_ICON_SIZES = { small: 24, medium: 32, large: 40 };
    function classifyError(message) {
      const msg = (message || "").toLowerCase();
      if (msg.includes("timeout") || msg.includes("timed out")) return "Timeout";
      if (msg.includes("401") || msg.includes("403")) return "Auth Error";
      if (msg.includes("429")) return "Rate Limited";
      if (msg.includes("network") || msg.includes("connect")) return "Network Error";
      return "Error";
    }
    function createErrorWidget(message, widgetSize = "medium", sourceName = "Widget") {
      const widget = new ListWidget();
      const sizes = CONFIG2.sizing[widgetSize];
      const iconSize = ERROR_ICON_SIZES[widgetSize] || 32;
      widget.setPadding(
        sizes.padding,
        sizes.padding,
        sizes.padding,
        sizes.padding
      );
      widget.url = "scriptable://run?name=" + encodeURIComponent(Script.name());
      const stack = widget.addStack();
      stack.layoutVertically();
      stack.centerAlignContent();
      const icon = stack.addImage(
        SFSymbol.named("exclamationmark.triangle").image
      );
      icon.imageSize = new Size(iconSize, iconSize);
      icon.tintColor = CONFIG2.colors.warning;
      stack.addSpacer(sizes.spacing);
      const errorText = stack.addText(`${sourceName} ${classifyError(message)}`);
      errorText.font = typography.title(sizes);
      errorText.textColor = CONFIG2.colors.label;
      errorText.centerAlignText();
      if (widgetSize !== "small") {
        stack.addSpacer(CONFIG2.designTokens.compactSpacing);
        const messageText = stack.addText(message);
        messageText.font = typography.footnote(sizes);
        messageText.textColor = CONFIG2.colors.secondaryLabel;
        messageText.centerAlignText();
      }
      stack.addSpacer(
        widgetSize === "small" ? CONFIG2.designTokens.compactSpacing : sizes.spacing
      );
      const hintText = stack.addText(CONFIG2.messages.tapRetry);
      hintText.font = typography.footnote(sizes);
      hintText.textColor = CONFIG2.colors.tertiaryLabel;
      hintText.centerAlignText();
      return widget;
    }
    function addFooter(widget, sizes, usingCache = false, widgetSize = "large") {
      widget.addSpacer();
      addSeparator(widget);
      widget.addSpacer(CONFIG2.designTokens.compactSpacing);
      const footer = widget.addStack();
      footer.layoutHorizontally();
      footer.centerAlignContent();
      const updateTime = /* @__PURE__ */ new Date();
      const hours = updateTime.getHours().toString().padStart(2, "0");
      const minutes = updateTime.getMinutes().toString().padStart(2, "0");
      const prefix = widgetSize === "large" ? "Updated " : "";
      const timeString = `${prefix}${hours}:${minutes}`;
      const timeText = footer.addText(timeString);
      timeText.font = typography.caption(sizes);
      timeText.textColor = CONFIG2.colors.tertiaryLabel;
      if (usingCache && widgetSize !== "small") {
        footer.addSpacer();
        const offlineIcon = footer.addImage(SFSymbol.named("icloud.slash").image);
        offlineIcon.imageSize = new Size(
          sizes.fontSize.caption,
          sizes.fontSize.caption
        );
        offlineIcon.tintColor = CONFIG2.colors.warning;
        if (widgetSize === "large") {
          footer.addSpacer(CONFIG2.designTokens.compactSpacing);
          const offlineText = footer.addText(CONFIG2.messages.offline);
          offlineText.font = typography.caption(sizes);
          offlineText.textColor = CONFIG2.colors.warning;
        }
      }
    }
    async function presentWidget(widget, widgetSize) {
      const presentMap = {
        small: () => widget.presentSmall(),
        medium: () => widget.presentMedium(),
        large: () => widget.presentLarge()
      };
      const presentFunc = presentMap[widgetSize];
      if (presentFunc) {
        await presentFunc();
      }
    }
    module2.exports = { classifyError, createErrorWidget, addFooter, presentWidget };
  }
});

// src/app.js
var require_app = __commonJS({
  "src/app.js"(exports2, module2) {
    var { CONFIG: CONFIG2 } = require_config();
    var { APIClient: APIClient2 } = require_api_client();
    var { CacheManager: CacheManager2 } = require_cache_manager();
    var { RefreshManager: RefreshManager2 } = require_refresh_manager();
    var { ConfigManager: ConfigManager2 } = require_config_manager();
    var { DataSourceFactory: DataSourceFactory2 } = require_data_source_factory();
    var { pickSource } = require_source_picker();
    var {
      addFooter,
      createErrorWidget,
      presentWidget
    } = require_widget_chrome();
    var Mosaic2 = class {
      constructor() {
        this.sourceName = args.widgetParameter || CONFIG2.defaultSource;
      }
      async run() {
        const widgetSize = config.widgetFamily || "medium";
        try {
          await ConfigManager2.load();
          if (!config.runsInWidget) {
            const picked = await pickSource();
            if (picked === null) {
              Script.complete();
              return;
            }
            this.sourceName = picked;
          }
          this.apiClient = new APIClient2(CONFIG2.apiBaseUrl, CONFIG2.apiToken);
          this.dataSource = DataSourceFactory2.create(
            this.sourceName,
            this.apiClient
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
            createErrorWidget(error.message, widgetSize, this.sourceName)
          );
          Script.complete();
        }
      }
      async createWidget(widgetSize) {
        const widget = new ListWidget();
        const sizes = CONFIG2.sizing[widgetSize];
        widget.setPadding(
          sizes.padding,
          sizes.padding,
          sizes.padding,
          sizes.padding
        );
        const refreshMs = RefreshManager2.getRefreshInterval(this.sourceName);
        const refreshDate = new Date(Date.now() + refreshMs);
        widget.refreshAfterDate = refreshDate;
        if (this.dataSource.config.urlScheme) {
          widget.url = this.dataSource.config.urlScheme;
        }
        let data = null;
        let usingCache = false;
        try {
          data = await this.dataSource.fetchData(widgetSize);
          RefreshManager2.recordSuccess(this.sourceName);
          if (data) {
            await CacheManager2.save(this.sourceName, data);
          }
        } catch (error) {
          console.error("Data fetch error:", error);
          RefreshManager2.recordError(this.sourceName);
          const cached = await CacheManager2.load(this.sourceName);
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
        this.dataSource.renderWidget(widget, data, widgetSize);
        addFooter(widget, sizes, usingCache, widgetSize);
        return widget;
      }
    };
    module2.exports = { Mosaic: Mosaic2 };
  }
});

// src/index.js
var { CONFIG } = require_config();
var { FormatUtils } = require_format_utils();
var { APIClient } = require_api_client();
var { ImageCache } = require_image_cache();
var { CacheManager } = require_cache_manager();
var { RefreshManager } = require_refresh_manager();
var { ConfigManager } = require_config_manager();
var { DataSource } = require_data_source();
var { DataSourceFactory } = require_data_source_factory();
var { BillboardDataSource } = require_billboard();
var { IMDbDataSource } = require_imdb();
var { SteamDataSource } = require_steam();
var { HackerNewsDataSource } = require_hacker_news();
var { GitHubDataSource } = require_github();
var { WikipediaDataSource } = require_wikipedia();
var { TimelineDataSource } = require_timeline();
var { BookmarksDataSource } = require_bookmarks();
var { BooksDataSource } = require_books();
var { AstronomyDataSource } = require_astronomy();
var { BlueskyDataSource } = require_bluesky();
var { ActivityDataSource } = require_activity();
var { StatusBoardDataSource } = require_status_board();
var { DHBWTimetableDataSource } = require_dhbw_timetable();
var { Mosaic } = require_app();
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
    ImageCache,
    CacheManager,
    RefreshManager,
    ConfigManager,
    DataSource,
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
    Mosaic
  };
}
