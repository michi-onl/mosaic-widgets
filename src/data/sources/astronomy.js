const { CONFIG } = require("../../config.js");
const { APIClient } = require("../../core/api-client.js");
const { CacheManager } = require("../../core/cache-manager.js");
const { FormatUtils } = require("../../core/format-utils.js");
const { DataSource } = require("../data-source.js");

class AstronomyDataSource extends DataSource {
  static moonPhases = [
    { name: "New Moon", icon: "moonphase.new.moon" },
    { name: "Waxing Crescent", icon: "moonphase.waxing.crescent" },
    { name: "First Quarter", icon: "moonphase.first.quarter" },
    { name: "Waxing Gibbous", icon: "moonphase.waxing.gibbous" },
    { name: "Full Moon", icon: "moonphase.full.moon" },
    { name: "Waning Gibbous", icon: "moonphase.waning.gibbous" },
    { name: "Last Quarter", icon: "moonphase.last.quarter" },
    { name: "Waning Crescent", icon: "moonphase.waning.crescent" },
  ];

  async getLocation() {
    // Try configured coordinates first
    if (this.config.latitude && this.config.longitude) {
      return {
        latitude: parseFloat(this.config.latitude),
        longitude: parseFloat(this.config.longitude),
      };
    }

    // Try cached location
    const cached = await CacheManager.load("_location");
    if (cached && cached.data) {
      return cached.data;
    }

    // Request device location
    const location = await Location.current();
    const coords = {
      latitude: location.latitude,
      longitude: location.longitude,
    };
    CacheManager.save("_location", coords);
    return coords;
  }

  async fetchData(widgetSize) {
    const loc = await this.getLocation();
    const lat = loc.latitude;
    const lon = loc.longitude;

    const weatherApi = new APIClient(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=sunrise,sunset,uv_index_max&current=temperature_2m,weather_code&timezone=auto`,
    );
    const weather = await weatherApi.fetch("");

    if (!weather || !weather.daily) {
      return {};
    }

    const daily = weather.daily;
    const sunrise = daily.sunrise[0];
    const sunset = daily.sunset[0];

    // Calculate golden hours (30min window around sunrise/sunset)
    const sunriseDate = new Date(sunrise);
    const sunsetDate = new Date(sunset);
    const goldenMorningStart = new Date(sunriseDate.getTime() - 30 * 60000);
    const goldenMorningEnd = new Date(sunriseDate.getTime() + 30 * 60000);
    const goldenEveningStart = new Date(sunsetDate.getTime() - 30 * 60000);
    const goldenEveningEnd = new Date(sunsetDate.getTime() + 30 * 60000);

    // Moon phase: calculate from date (0-1 scale, synodic month)
    const moonPhase = this.calculateMoonPhase(new Date());

    return {
      sunrise,
      sunset,
      uvIndex: daily.uv_index_max[0],
      temperature: weather.current?.temperature_2m,
      weatherCode: weather.current?.weather_code,
      moonPhase,
      goldenMorning: { start: goldenMorningStart, end: goldenMorningEnd },
      goldenEvening: { start: goldenEveningStart, end: goldenEveningEnd },
    };
  }

  calculateMoonPhase(date) {
    // Simplified moon phase calculation based on known new moon reference
    const knownNewMoon = new Date("2024-01-11T11:57:00Z");
    const synodicMonth = 29.53058770576;
    const daysSince = (date - knownNewMoon) / (1000 * 60 * 60 * 24);
    const phase = ((daysSince % synodicMonth) + synodicMonth) % synodicMonth;
    return phase / synodicMonth; // 0-1 scale
  }

  getMoonPhaseInfo(phase) {
    const index = Math.round(phase * 8) % 8;
    return AstronomyDataSource.moonPhases[index];
  }

  isEmpty(data) {
    return !data || !data.sunrise;
  }

  renderWidget(widget, data, widgetSize) {
    const sizes = CONFIG.sizing[widgetSize];

    this.addHeader(widget, "Astronomy", sizes);
    widget.addSpacer(sizes.spacing);

    const contentStack = widget.addStack();
    contentStack.layoutVertically();

    // Sun row
    this.renderSunRow(contentStack, data, sizes);
    contentStack.addSpacer(sizes.spacing);

    // Moon row
    this.renderMoonRow(contentStack, data, sizes);

    if (widgetSize !== "small") {
      contentStack.addSpacer(sizes.spacing);
      // UV index row
      this.renderUvRow(contentStack, data, sizes);
      contentStack.addSpacer(sizes.spacing);
      // Golden hour row
      this.renderGoldenHourRow(contentStack, data, sizes);
    }

    if (widgetSize === "large") {
      contentStack.addSpacer(sizes.spacing);
      this.renderTemperatureRow(contentStack, data, sizes);
    }
  }

  renderSunRow(stack, data, sizes) {
    const row = stack.addStack();
    row.layoutHorizontally();
    row.centerAlignContent();

    const sunriseIcon = row.addImage(SFSymbol.named("sunrise.fill").image);
    sunriseIcon.imageSize = new Size(sizes.iconSize, sizes.iconSize);
    sunriseIcon.tintColor = CONFIG.colors.warning;
    row.addSpacer(CONFIG.designTokens.compactSpacing);

    const sunriseText = row.addText(FormatUtils.formatTime(data.sunrise));
    sunriseText.font = Font.mediumSystemFont(sizes.fontSize.primary);
    sunriseText.textColor = CONFIG.colors.primary;

    row.addSpacer(sizes.spacing * 2);

    const sunsetIcon = row.addImage(SFSymbol.named("sunset.fill").image);
    sunsetIcon.imageSize = new Size(sizes.iconSize, sizes.iconSize);
    sunsetIcon.tintColor = CONFIG.colors.sunset;
    row.addSpacer(CONFIG.designTokens.compactSpacing);

    const sunsetText = row.addText(FormatUtils.formatTime(data.sunset));
    sunsetText.font = Font.mediumSystemFont(sizes.fontSize.primary);
    sunsetText.textColor = CONFIG.colors.primary;
  }

  renderMoonRow(stack, data, sizes) {
    const row = stack.addStack();
    row.layoutHorizontally();
    row.centerAlignContent();

    const moonInfo = this.getMoonPhaseInfo(data.moonPhase);
    const moonIcon = row.addImage(SFSymbol.named(moonInfo.icon).image);
    moonIcon.imageSize = new Size(sizes.iconSize, sizes.iconSize);
    moonIcon.tintColor = CONFIG.colors.primary;
    row.addSpacer(CONFIG.designTokens.compactSpacing);

    const moonText = row.addText(moonInfo.name);
    moonText.font = Font.mediumSystemFont(sizes.fontSize.primary);
    moonText.textColor = CONFIG.colors.primary;

    row.addSpacer(sizes.spacing);

    const pctText = row.addText(`${Math.round(data.moonPhase * 100)}%`);
    pctText.font = Font.systemFont(sizes.fontSize.tertiary);
    pctText.textColor = CONFIG.colors.secondary;
  }

  renderUvRow(stack, data, sizes) {
    const row = stack.addStack();
    row.layoutHorizontally();
    row.centerAlignContent();

    const uvIcon = row.addImage(SFSymbol.named("sun.max.fill").image);
    uvIcon.imageSize = new Size(sizes.iconSize, sizes.iconSize);
    uvIcon.tintColor = CONFIG.colors.warning;
    row.addSpacer(CONFIG.designTokens.compactSpacing);

    const label = row.addText("UV Index");
    label.font = Font.systemFont(sizes.fontSize.secondary);
    label.textColor = CONFIG.colors.secondary;
    row.addSpacer(sizes.spacing);

    const uvValue = Math.round(data.uvIndex);
    const uvColor =
      uvValue >= 6
        ? CONFIG.colors.down
        : uvValue >= 3
          ? CONFIG.colors.warning
          : CONFIG.colors.up;
    const uvText = row.addText(`${uvValue}`);
    uvText.font = Font.mediumSystemFont(sizes.fontSize.primary);
    uvText.textColor = uvColor;
  }

  renderGoldenHourRow(stack, data, sizes) {
    const row = stack.addStack();
    row.layoutHorizontally();
    row.centerAlignContent();

    const ghIcon = row.addImage(SFSymbol.named("camera.filters").image);
    ghIcon.imageSize = new Size(sizes.iconSize, sizes.iconSize);
    ghIcon.tintColor = CONFIG.colors.golden;
    row.addSpacer(CONFIG.designTokens.compactSpacing);

    const morningText = `${FormatUtils.formatTime(data.goldenMorning.start)}–${FormatUtils.formatTime(data.goldenMorning.end)}`;
    const eveningText = `${FormatUtils.formatTime(data.goldenEvening.start)}–${FormatUtils.formatTime(data.goldenEvening.end)}`;

    const text = row.addText(`↑ ${morningText}  ↓ ${eveningText}`);
    text.font = Font.systemFont(sizes.fontSize.secondary);
    text.textColor = CONFIG.colors.primary;
  }

  renderTemperatureRow(stack, data, sizes) {
    if (data.temperature === undefined) return;

    const row = stack.addStack();
    row.layoutHorizontally();
    row.centerAlignContent();

    const tempIcon = row.addImage(SFSymbol.named("thermometer.medium").image);
    tempIcon.imageSize = new Size(sizes.iconSize, sizes.iconSize);
    tempIcon.tintColor = CONFIG.colors.accent;
    row.addSpacer(CONFIG.designTokens.compactSpacing);

    const tempText = row.addText(`${Math.round(data.temperature)}°C`);
    tempText.font = Font.mediumSystemFont(sizes.fontSize.primary);
    tempText.textColor = CONFIG.colors.primary;
  }
}

module.exports = { AstronomyDataSource };
