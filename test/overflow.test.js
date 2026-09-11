const test = require("node:test");
const assert = require("node:assert/strict");
const { minHeight, availableHeight } = require("./scriptable-stubs");
const { FIXTURES } = require("./fixtures");
const { CONFIG } = require("../src/config.js");
const { DataSourceFactory } = require("../src/data/data-source-factory.js");

const FAMILIES = ["small", "medium", "large", "extraLarge"];

// Renders one source at one family the same way Mosaic.createWidget does, then
// measures the intrinsic content height against the drawable canvas.
function measure(sourceName, family) {
  const sizes = CONFIG.sizing[family];
  if (!sizes) return { error: `CONFIG.sizing.${family} is undefined` };

  const fixture = FIXTURES[sourceName];
  const source = DataSourceFactory.create(sourceName, null);
  // Exercise the cached/offline header (extra glyph) rather than the happy path.
  source.usingCache = true;

  const widget = new ListWidget();
  widget.setPadding(sizes.padding, sizes.padding, sizes.padding, sizes.padding);
  source.renderWidget(widget, fixture.data, family);

  const needed = minHeight(widget);
  const available = availableHeight(widget, family, CONFIG.widgetCanvas);
  return { needed, available, overflow: needed - available };
}

const results = {};
for (const sourceName of Object.keys(FIXTURES)) {
  results[sourceName] = {};
  for (const family of FAMILIES) {
    let outcome;
    try {
      outcome = measure(sourceName, family);
    } catch (error) {
      outcome = { error: error.message };
    }
    results[sourceName][family] = outcome;
  }
}

// Diagnostic table (visible with `node --test`).
const header = ["source", ...FAMILIES].map((h) => h.padEnd(12)).join("");
console.log(header);
for (const [sourceName, byFamily] of Object.entries(results)) {
  const cells = FAMILIES.map((family) => {
    const r = byFamily[family];
    if (r.error) return "THROWS".padEnd(12);
    const sign = r.overflow > 0 ? "+" : "";
    return `${sign}${Math.round(r.overflow)}/${Math.round(r.available)}`.padEnd(12);
  });
  console.log(sourceName.padEnd(12) + cells.join(""));
}
console.log("(cell = overflow/available, points; positive means clipping)");

test("every family has a sizing entry", () => {
  for (const family of FAMILIES) {
    assert.ok(CONFIG.sizing[family], `CONFIG.sizing.${family} is missing`);
  }
});

test("no source overflows its widget family", () => {
  // The line-height model is approximate, so allow a couple of points of slack.
  const TOLERANCE = 4;
  const failures = [];
  for (const [sourceName, byFamily] of Object.entries(results)) {
    for (const family of FAMILIES) {
      const r = byFamily[family];
      if (r.error) {
        failures.push(`${sourceName}/${family}: ${r.error}`);
      } else if (r.overflow > TOLERANCE) {
        failures.push(
          `${sourceName}/${family}: needs ${Math.round(r.needed)}pt, ` +
            `has ${Math.round(r.available)}pt (+${Math.round(r.overflow)}pt)`,
        );
      }
    }
  }
  assert.deepEqual(failures, [], `Overflowing widgets:\n${failures.join("\n")}`);
});
