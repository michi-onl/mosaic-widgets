// Minimal stand-ins for the Scriptable globals Mosaic.js touches at module-load
// time (Color) plus a lightweight layout model so tests can estimate rendered
// height and catch content that would clip/ellipsize on device.
//
// The model is intentionally coarse: it computes the *minimum* intrinsic height
// of a stack tree (flexible spacers collapse to 0, text reserves its lineLimit)
// and compares it to the widget family's drawable canvas. That is enough to flag
// gross overflow; it is not a pixel-accurate reimplementation of UIKit.

class Color {
  constructor(hex, alpha) {
    this.hex = hex;
    this.alpha = alpha;
  }
  static dynamic(light) {
    return light;
  }
  static white() {
    return new Color("#FFFFFF");
  }
}

class Size {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }
}

// SF text line height is roughly 1.2x the point size (ascender + descender +
// leading). Good enough for overflow detection.
function lineHeight(size) {
  return size * 1.2;
}

class Font {
  constructor(size, weight) {
    this.size = size;
    this.weight = weight;
  }
  static regularSystemFont(size) {
    return new Font(size, "regular");
  }
  static mediumSystemFont(size) {
    return new Font(size, "medium");
  }
  static semiboldSystemFont(size) {
    return new Font(size, "semibold");
  }
  static systemFont(size) {
    return new Font(size, "regular");
  }
}

class Image {
  constructor(name) {
    this.name = name;
  }
}

const SFSymbol = {
  named(name) {
    return { image: new Image(name) };
  },
};

class TextElement {
  constructor(text) {
    this.kind = "text";
    this.text = String(text);
    this.font = null;
    this.textColor = null;
    this.lineLimit = 0;
    this.url = null;
  }
  centerAlignText() {}
  rightAlignText() {}
  leftAlignText() {}
}

class ImageElement {
  constructor(image) {
    this.kind = "image";
    this.image = image;
    this.imageSize = null;
    this.cornerRadius = 0;
    this.tintColor = null;
    this.url = null;
  }
  centerAlignImage() {}
}

class Stack {
  constructor() {
    this.kind = "stack";
    this.children = [];
    this.direction = "vertical";
    this.padding = { top: 0, left: 0, bottom: 0, right: 0 };
    this.size = null;
    this.backgroundColor = null;
    this.cornerRadius = 0;
    this.url = null;
  }
  layoutHorizontally() {
    this.direction = "horizontal";
  }
  layoutVertically() {
    this.direction = "vertical";
  }
  centerAlignContent() {}
  addStack() {
    const child = new Stack();
    this.children.push(child);
    return child;
  }
  addText(text) {
    const child = new TextElement(text);
    this.children.push(child);
    return child;
  }
  addImage(image) {
    const child = new ImageElement(image);
    this.children.push(child);
    return child;
  }
  addSpacer(length) {
    this.children.push({ kind: "spacer", length: length });
  }
  setPadding(top, left, bottom, right) {
    this.padding = { top, left, bottom, right };
  }
}

class ListWidget extends Stack {
  constructor() {
    super();
    this.refreshAfterDate = null;
    this.presentSmall = async () => {};
    this.presentMedium = async () => {};
    this.presentLarge = async () => {};
    this.presentExtraLarge = async () => {};
  }
}

// Intrinsic minimum height of a node, assuming it is laid out vertically.
function minHeight(node) {
  if (!node) return 0;
  if (node.kind === "spacer") return node.length == null ? 0 : node.length;
  if (node.kind === "text") {
    const size = node.font ? node.font.size : 12;
    const lines = node.lineLimit > 0 ? node.lineLimit : 1;
    return lineHeight(size) * lines;
  }
  if (node.kind === "image") {
    return node.imageSize ? node.imageSize.height : 0;
  }
  if (node.kind === "stack") {
    if (node.size && node.size.height > 0) return node.size.height;
    const inner =
      node.direction === "horizontal"
        ? Math.max(0, ...node.children.map(minHeight))
        : node.children.reduce((sum, child) => sum + minHeight(child), 0);
    return inner + node.padding.top + node.padding.bottom;
  }
  return 0;
}

// Drawable canvas per family now lives in CONFIG.widgetCanvas so production and
// tests share one source of truth. The measured root tree already includes the
// widget's own padding, so this returns the full canvas height.
function availableHeight(widget, family, canvasByFamily) {
  const canvas = canvasByFamily[family];
  if (!canvas) return null;
  return canvas.height;
}

global.Color = Color;
global.Size = Size;
global.Font = Font;
global.Image = Image;
global.SFSymbol = SFSymbol;
global.Stack = Stack;
global.ListWidget = ListWidget;

module.exports = {
  Color,
  Size,
  Font,
  Image,
  SFSymbol,
  Stack,
  ListWidget,
  minHeight,
  availableHeight,
  lineHeight,
};
