const { CONFIG } = require("../../config.js");
const { FormatUtils } = require("../../core/format-utils.js");
const { DataSource } = require("../data-source.js");

class DHBWTimetableDataSource extends DataSource {
  isEmpty(data) {
    return !data.events || data.events.length === 0;
  }

  async fetchData(widgetSize) {
    const response = await this.api.fetch(this.config.endpoint);

    if (!response || !Array.isArray(response.events)) {
      return { events: [], courseName: "", courseCode: "" };
    }

    const now = new Date();
    // Local date, not UTC — toISOString() would roll to tomorrow late evening.
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    let events = response.events
      .filter((e) => e.date >= todayStr)
      .map((e) => ({
        id: e.id,
        name: e.name,
        type: e.type || "",
        date: e.date,
        startTime: e.startTime,
        endTime: e.endTime,
        lecturer: e.lecturer || "",
        rooms: e.rooms || [],
        course: e.course || "",
      }))
      .sort((a, b) => {
        const dateCmp = a.date.localeCompare(b.date);
        if (dateCmp !== 0) return dateCmp;
        return a.startTime.localeCompare(b.startTime);
      });

    const limit = CONFIG.sizing[widgetSize].maxItems;

    return {
      events: events.slice(0, limit),
      courseName: response.course?.name || "",
      courseCode: response.courseCode || "",
    };
  }

  renderWidget(widget, data, widgetSize) {
    const sizes = CONFIG.sizing[widgetSize];

    const title = data.courseName || "DHBW Timetable";
    this.addHeader(widget, title, sizes);
    widget.addSpacer(sizes.spacing);

    if (data.events.length === 0) {
      const emptyText = widget.addText("No upcoming events");
      emptyText.font = Font.systemFont(sizes.fontSize.secondary);
      emptyText.textColor = CONFIG.colors.secondary;
      emptyText.centerAlignText();
      return;
    }

    const contentStack = widget.addStack();
    contentStack.layoutVertically();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let lastDate = null;
    data.events.forEach((event, index) => {
      if (event.date !== lastDate) {
        if (lastDate !== null) {
          contentStack.addSpacer(sizes.spacing);
        }
        const dateLabel = contentStack.addText(
          FormatUtils.formatDateLabel(event.date, today, tomorrow),
        );
        dateLabel.font = Font.boldSystemFont(sizes.fontSize.secondary);
        dateLabel.textColor = CONFIG.colors.accent;
        contentStack.addSpacer(CONFIG.designTokens.compactSpacing);
        lastDate = event.date;
      }

      this.renderItem(contentStack, event, sizes, widgetSize);

      if (index < data.events.length - 1) {
        const nextEvent = data.events[index + 1];
        if (nextEvent.date === event.date) {
          contentStack.addSpacer(CONFIG.designTokens.compactSpacing);
        }
      }
    });
  }

  renderItem(stack, event, sizes, widgetSize) {
    const itemStack = stack.addStack();
    itemStack.layoutHorizontally();

    const timeColumn = itemStack.addStack();
    timeColumn.layoutVertically();
    timeColumn.setPadding(0, 0, 0, 0);
    timeColumn.size = new Size(sizes.iconSize * 3, 0);

    const startText = timeColumn.addText(
      FormatUtils.formatTime(event.startTime),
    );
    startText.font = Font.mediumSystemFont(sizes.fontSize.secondary);
    startText.textColor = CONFIG.colors.primary;
    startText.rightAlignText();

    const endText = timeColumn.addText(FormatUtils.formatTime(event.endTime));
    endText.font = Font.systemFont(sizes.fontSize.tertiary);
    endText.textColor = CONFIG.colors.secondary;
    endText.rightAlignText();

    // The color dot and the type badge below both encode event.type by color;
    // on a small widget that's redundant, so only the badge carries it there.
    if (widgetSize !== "small") {
      const divider = itemStack.addStack();
      divider.layoutVertically();
      divider.centerAlignContent();
      divider.setPadding(
        0,
        CONFIG.designTokens.compactSpacing,
        0,
        CONFIG.designTokens.compactSpacing,
      );

      const dot = divider.addStack();
      dot.size = new Size(sizes.fontSize.tertiary, sizes.fontSize.tertiary);
      dot.cornerRadius = sizes.fontSize.tertiary / 2;
      dot.backgroundColor =
        CONFIG.colors.dhbwTypes[event.type] || CONFIG.colors.accent;
    }

    itemStack.addSpacer(CONFIG.designTokens.compactSpacing);

    const textStack = itemStack.addStack();
    textStack.layoutVertically();

    const titleRow = textStack.addStack();
    titleRow.layoutHorizontally();
    titleRow.centerAlignContent();

    const nameText = titleRow.addText(FormatUtils.truncate(event.name, 30));
    nameText.font = Font.boldSystemFont(sizes.fontSize.primary);
    nameText.textColor = CONFIG.colors.primary;
    nameText.lineLimit = 1;

    if (event.type) {
      titleRow.addSpacer(CONFIG.designTokens.compactSpacing);
      this.addBadge(titleRow, {
        text: event.type,
        color: CONFIG.colors.dhbwTypes[event.type] || CONFIG.colors.accent,
        sizes,
      });
    }

    const detailParts = [];
    if (event.rooms && event.rooms.length > 0) {
      detailParts.push(event.rooms.join(", "));
    }
    if (event.lecturer) {
      detailParts.push(event.lecturer);
    }
    if (detailParts.length > 0) {
      const detailText = textStack.addText(detailParts.join(" · "));
      detailText.font = Font.systemFont(sizes.fontSize.tertiary);
      detailText.textColor = CONFIG.colors.secondary;
      detailText.lineLimit = 1;
    }

    itemStack.addSpacer();
  }
}

module.exports = { DHBWTimetableDataSource };
