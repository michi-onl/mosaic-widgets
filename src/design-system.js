const { CONFIG } = require("./config.js");

// SF text styles, compacted for widget density. Apple uses semibold (not bold)
// for emphasis.
const typography = {
  title: (sizes) =>
    Font.semiboldSystemFont(sizes.fontSize.title || sizes.fontSize.primary),
  body: (sizes) => Font.regularSystemFont(sizes.fontSize.secondary),
  footnote: (sizes) => Font.regularSystemFont(sizes.fontSize.tertiary),
  caption: (sizes) => Font.regularSystemFont(sizes.fontSize.caption),
};

// Hairline rule in the semantic separator color. Pass `inset` to align it with
// content that starts after a leading icon/badge.
function addSeparator(stack, { inset = 0 } = {}) {
  const row = stack.addStack();
  row.layoutHorizontally();
  if (inset > 0) row.addSpacer(inset);
  const line = row.addStack();
  line.size = new Size(0, 0.5);
  line.backgroundColor = CONFIG.colors.separator;
  row.addSpacer();
  return row;
}

// Tinted "tag" style: neutral translucent fill, colored label/glyph. Color is
// reserved for identity/status, not decoration.
function addTag(parentStack, { text, icon, color, sizes }) {
  const tag = parentStack.addStack();
  tag.backgroundColor = CONFIG.colors.fill;
  tag.cornerRadius = CONFIG.designTokens.cornerRadius.badge;
  tag.setPadding(
    CONFIG.designTokens.badge.paddingV,
    CONFIG.designTokens.badge.paddingH,
    CONFIG.designTokens.badge.paddingV,
    CONFIG.designTokens.badge.paddingH,
  );

  const tint = color || CONFIG.colors.accent;

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

// Translucent card surface approximating a system material. Used sparingly:
// content-first, glass for grouping only.
function addGlassSurface(stack) {
  stack.backgroundColor = CONFIG.colors.fill;
  stack.cornerRadius = CONFIG.designTokens.cornerRadius.card;
  stack.setPadding(
    CONFIG.designTokens.compactSpacing,
    CONFIG.designTokens.compactSpacing,
    CONFIG.designTokens.compactSpacing,
    CONFIG.designTokens.compactSpacing,
  );
  return stack;
}

module.exports = { typography, addSeparator, addTag, addGlassSurface };
