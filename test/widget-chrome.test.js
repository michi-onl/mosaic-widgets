const test = require("node:test");
const assert = require("node:assert/strict");
require("./scriptable-stubs");
const { classifyError } = require("../src/ui/widget-chrome.js");

test("classifyError labels common failure modes", () => {
  assert.equal(classifyError("Request timeout"), "Timeout");
  assert.equal(classifyError("timed out"), "Timeout");
  assert.equal(classifyError("HTTP 401 Unauthorized"), "Auth Error");
  assert.equal(classifyError("403 Forbidden"), "Auth Error");
  assert.equal(classifyError("429 Too Many Requests"), "Rate Limited");
  assert.equal(classifyError("network unreachable"), "Network Error");
  assert.equal(classifyError("could not connect"), "Network Error");
  assert.equal(classifyError("No data available"), "Error");
  assert.equal(classifyError(undefined), "Error");
});

test("classifyError resolves overlapping signals by precedence", () => {
  assert.equal(classifyError("network timeout"), "Timeout");
  assert.equal(classifyError("429 network"), "Rate Limited");
  assert.equal(classifyError("401 connect"), "Auth Error");
});
