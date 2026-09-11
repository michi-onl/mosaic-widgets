const { CONFIG } = require("../config.js");
const { typography } = require("../design-system.js");

const ERROR_ICON_SIZES = { small: 24, medium: 32, large: 40, extraLarge: 48 };

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
  const sizes = CONFIG.sizing[widgetSize];
  const iconSize = ERROR_ICON_SIZES[widgetSize] || 32;

  widget.setPadding(
    sizes.padding,
    sizes.padding,
    sizes.padding,
    sizes.padding,
  );

  widget.url = "scriptable://run?name=" + encodeURIComponent(Script.name());

  const stack = widget.addStack();
  stack.layoutVertically();
  stack.centerAlignContent();

  const icon = stack.addImage(
    SFSymbol.named("exclamationmark.triangle").image,
  );
  icon.imageSize = new Size(iconSize, iconSize);
  icon.tintColor = CONFIG.colors.warning;

  stack.addSpacer(sizes.spacing);

  const errorText = stack.addText(`${sourceName} ${classifyError(message)}`);
  errorText.font = typography.title(sizes);
  errorText.textColor = CONFIG.colors.label;
  errorText.centerAlignText();

  if (widgetSize !== "small") {
    stack.addSpacer(CONFIG.designTokens.compactSpacing);

    const messageText = stack.addText(message);
    messageText.font = typography.footnote(sizes);
    messageText.textColor = CONFIG.colors.secondaryLabel;
    messageText.centerAlignText();
  }

  stack.addSpacer(
    widgetSize === "small"
      ? CONFIG.designTokens.compactSpacing
      : sizes.spacing,
  );

  const hintText = stack.addText(CONFIG.messages.tapRetry);
  hintText.font = typography.footnote(sizes);
  hintText.textColor = CONFIG.colors.tertiaryLabel;
  hintText.centerAlignText();

  return widget;
}

async function presentWidget(widget, widgetSize) {
  const presentMap = {
    small: () => widget.presentSmall(),
    medium: () => widget.presentMedium(),
    large: () => widget.presentLarge(),
    extraLarge: () => widget.presentExtraLarge(),
  };

  const presentFunc = presentMap[widgetSize];
  if (presentFunc) {
    await presentFunc();
  }
}

module.exports = { classifyError, createErrorWidget, presentWidget };
