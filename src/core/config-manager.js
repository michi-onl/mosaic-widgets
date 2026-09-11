const { CONFIG } = require("../config.js");
const { CacheManager } = require("./cache-manager.js");

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

module.exports = { ConfigManager };
