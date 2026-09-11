import { build } from "esbuild";

const metadata = `// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-blue; icon-glyph: chart-line;`;

await build({
  entryPoints: ["src/index.js"],
  bundle: true,
  format: "cjs",
  platform: "neutral",
  target: "es2020",
  outfile: "Mosaic.js",
  banner: { js: metadata },
  logLevel: "info",
});
