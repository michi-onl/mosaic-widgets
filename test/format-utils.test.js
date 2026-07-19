const test = require("node:test");
const assert = require("node:assert/strict");
require("./scriptable-stubs");
const { FormatUtils } = require("../Mosaic.js");

test("truncate leaves short strings untouched", () => {
  assert.equal(FormatUtils.truncate("hello", 10), "hello");
});

test("truncate adds an ellipsis and respects maxLength", () => {
  const result = FormatUtils.truncate("hello world", 8);
  assert.equal(result, "hello w…");
  assert.equal(result.length, 8);
});

test("truncate handles empty input", () => {
  assert.equal(FormatUtils.truncate(null, 5), "");
  assert.equal(FormatUtils.truncate("", 5), "");
});

test("formatNumber abbreviates thousands and millions", () => {
  assert.equal(FormatUtils.formatNumber(999), "999");
  assert.equal(FormatUtils.formatNumber(1500), "1.5K");
  assert.equal(FormatUtils.formatNumber(2500000), "2.5M");
});

test("formatTimeAgo handles missing and invalid dates", () => {
  assert.equal(FormatUtils.formatTimeAgo(null), "Unknown");
  assert.equal(FormatUtils.formatTimeAgo("not a date"), "Unknown");
});

test("formatTimeAgo treats future dates as Just now", () => {
  const future = new Date(Date.now() + 60000).toISOString();
  assert.equal(FormatUtils.formatTimeAgo(future), "Just now");
});

test("formatTimeAgo picks the largest applicable unit", () => {
  const twoHoursAgo = new Date(Date.now() - 2 * 3600 * 1000).toISOString();
  assert.equal(FormatUtils.formatTimeAgo(twoHoursAgo), "2h ago");
});

test("formatDuration switches from minutes to hours at 1h", () => {
  assert.equal(FormatUtils.formatDuration(0.5), "30m");
  assert.equal(FormatUtils.formatDuration(1.5), "1.5h");
});

test("pluralize", () => {
  assert.equal(FormatUtils.pluralize(1, "week"), "1 week");
  assert.equal(FormatUtils.pluralize(2, "week"), "2 weeks");
  assert.equal(FormatUtils.pluralize(2, "child", "children"), "2 children");
});

test("cleanTitle strips feat. tags and parentheticals", () => {
  assert.equal(
    FormatUtils.cleanTitle("Song Title [feat. Someone] (Remix)"),
    "Song Title",
  );
});

test("stripHtml removes tags and decodes entity spacing", () => {
  assert.equal(FormatUtils.stripHtml("<p>Hello&nbsp;World</p>"), "Hello World");
});

test("formatDateLabel recognizes Today and Tomorrow", () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const toStr = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  assert.equal(FormatUtils.formatDateLabel(toStr(today), today, tomorrow), "Today");
  assert.equal(
    FormatUtils.formatDateLabel(toStr(tomorrow), today, tomorrow),
    "Tomorrow",
  );
});
