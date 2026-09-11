const test = require("node:test");
const assert = require("node:assert/strict");
require("./scriptable-stubs");
const {
  CONFIG,
  StatusBoardDataSource,
  SteamDataSource,
  GitHubDataSource,
  BooksDataSource,
} = require("../src/index.js");

test("every configured source (other than statusboard) has a topItemExtractors entry", () => {
  const sourceNames = Object.keys(CONFIG.sources).filter(
    (name) => name !== "statusboard",
  );
  const covered = Object.keys(StatusBoardDataSource.topItemExtractors);

  for (const name of sourceNames) {
    assert.ok(
      covered.includes(name),
      `StatusBoardDataSource.topItemExtractors is missing "${name}" — its row ` +
        `would silently show "no data" on the Status Board`,
    );
  }
});

test("extractTopItem formats a representative item per source", () => {
  const board = new StatusBoardDataSource(CONFIG.sources.statusboard, null);

  assert.equal(
    board.extractTopItem("books", { title: "Dune" }),
    "Dune",
  );
  assert.equal(
    board.extractTopItem("activity", {
      items: [{ title: "repo v1.0.0" }],
    }),
    "repo v1.0.0",
  );
  assert.equal(board.extractTopItem("unknown-source", { anything: true }), null);
  assert.equal(board.extractTopItem("books", null), null);
});

test("SteamDataSource.fetchData rejects clearly when no profiles are configured", async () => {
  const source = new SteamDataSource({ ...CONFIG.sources.steam, profiles: [] }, null);
  await assert.rejects(() => source.fetchData("medium"), /Set steam profiles in CONFIG/);
});

test("GitHubDataSource.fetchReleases rejects clearly when no repos are configured", async () => {
  const source = new GitHubDataSource({ ...CONFIG.sources.github, repos: [] }, null);
  await assert.rejects(
    () => source.fetchReleases("medium"),
    /Set github repos in CONFIG/,
  );
});

test("BooksDataSource.fetchData rejects clearly when no isbn is available", async () => {
  const source = new BooksDataSource(
    { ...CONFIG.sources.books, defaultIsbn: undefined },
    null,
  );
  await assert.rejects(
    () => source.fetchData("medium"),
    /Set defaultIsbn in CONFIG or use books:<isbn>/,
  );
});
