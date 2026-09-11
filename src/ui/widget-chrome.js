const { CONFIG } = require("../config.js");
const { addSeparator, typography } = require("../design-system.js");

const ERROR_ICON_SIZES = { small: 24, medium: 32, large: 40 };

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

function addFooter(widget, sizes, usingCache = false, widgetSize = "large") {
  widget.addSpacer();

  addSeparator(widget);
  widget.addSpacer(CONFIG.designTokens.compactSpacing);

  const footer = widget.addStack();
  footer.layoutHorizontally();
  footer.centerAlignContent();

  const updateTime = new Date();
  const hours = updateTime.getHours().toString().padStart(2, "0");
  const minutes = updateTime.getMinutes().toString().padStart(2, "0");
  const prefix = widgetSize === "large" ? "Updated " : "";
  const timeString = `${prefix}${hours}:${minutes}`;

  const timeText = footer.addText(timeString);
  timeText.font = typography.caption(sizes);
  timeText.textColor = CONFIG.colors.tertiaryLabel;

  if (usingCache && widgetSize !== "small") {
    footer.addSpacer();

    const offlineIcon = footer.addImage(SFSymbol.named("icloud.slash").image);
    offlineIcon.imageSize = new Size(
      sizes.fontSize.caption,
      sizes.fontSize.caption,
    );
    offlineIcon.tintColor = CONFIG.colors.warning;

    if (widgetSize === "large") {
      footer.addSpacer(CONFIG.designTokens.compactSpacing);
      const offlineText = footer.addText(CONFIG.messages.offline);
      offlineText.font = typography.caption(sizes);
      offlineText.textColor = CONFIG.colors.warning;
    }
  }
}

async function presentWidget(widget, widgetSize) {
  const presentMap = {
    small: () => widget.presentSmall(),
    medium: () => widget.presentMedium(),
    large: () => widget.presentLarge(),
  };

  const presentFunc = presentMap[widgetSize];
  if (presentFunc) {
    await presentFunc();
  }
}

module.exports = { classifyError, createErrorWidget, addFooter, presentWidget };
