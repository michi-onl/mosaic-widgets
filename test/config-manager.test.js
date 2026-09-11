const test = require("node:test");
const assert = require("node:assert/strict");
require("./scriptable-stubs");

// In-memory stand-ins for the Scriptable storage globals ConfigManager touches.
const files = new Map();
const dirs = new Set();
let keychain = new Map();

function makeFileManager() {
  return {
    documentsDirectory: () => "/docs",
    joinPath: (...parts) => parts.join("/"),
    fileExists: (p) => files.has(p) || dirs.has(p),
    createDirectory: (p) => dirs.add(p),
    readString: (p) => {
      if (!files.has(p)) throw new Error(`missing ${p}`);
      return files.get(p);
    },
    writeString: (p, s) => files.set(p, s),
    isFileStoredIniCloud: () => false,
  };
}

global.FileManager = {
  iCloud: makeFileManager,
  local: makeFileManager,
};
global.Keychain = {
  contains: (k) => keychain.has(k),
  get: (k) => keychain.get(k),
  set: (k, v) => keychain.set(k, v),
  remove: (k) => keychain.delete(k),
};

const { CONFIG } = require("../src/config.js");
const { ConfigManager } = require("../src/core/config-manager.js");

const CONFIG_PATH = "/docs/widget-config.json";

function reset() {
  files.clear();
  keychain = new Map();
  ConfigManager._loaded = false;
  CONFIG.apiToken = "";
  CONFIG.sources.steam.profiles = [];
  CONFIG.sources.github.repos = [];
}

test("load merges saved source overrides into CONFIG", async () => {
  reset();
  files.set(
    CONFIG_PATH,
    JSON.stringify({ version: 1, sources: { steam: { profiles: ["gabelogannewell"] } } }),
  );

  await ConfigManager.load();

  assert.deepEqual(CONFIG.sources.steam.profiles, ["gabelogannewell"]);
});

test("load migrates a legacy plaintext apiToken into Keychain", async () => {
  reset();
  files.set(
    CONFIG_PATH,
    JSON.stringify({ version: 1, apiToken: "legacy-secret", sources: {} }),
  );

  await ConfigManager.load();

  assert.equal(keychain.get("mosaic_api_token"), "legacy-secret");
  assert.equal(CONFIG.apiToken, "legacy-secret");
  assert.equal(JSON.parse(files.get(CONFIG_PATH)).apiToken, undefined);
});

test("save merges overrides into the existing config file", () => {
  reset();
  files.set(
    CONFIG_PATH,
    JSON.stringify({ version: 1, sources: { steam: { profiles: ["a"] } } }),
  );

  ConfigManager.save({ github: { repos: ["owner/repo"] } });

  const saved = JSON.parse(files.get(CONFIG_PATH));
  assert.deepEqual(saved.sources.steam.profiles, ["a"]);
  assert.deepEqual(saved.sources.github.repos, ["owner/repo"]);
  assert.equal(saved.version, 1);
  assert.ok(saved.lastModified > 0);
});

test("getEditableFields returns the schema for editable sources only", () => {
  assert.deepEqual(ConfigManager.getEditableFields("bluesky"), [
    { key: "handle", label: "Bluesky handle" },
  ]);
  assert.deepEqual(ConfigManager.getEditableFields("billboard"), []);
});
