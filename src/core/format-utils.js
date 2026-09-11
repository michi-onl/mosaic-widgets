class FormatUtils {
  static truncate(text, maxLength) {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 1) + "…";
  }

  static formatNumber(num) {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  }

  static formatTimeAgo(dateString) {
    if (!dateString) return "Unknown";

    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) return "Unknown";

    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 0) return "Just now";

    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval}${unit.charAt(0)} ago`;
      }
    }

    return "Just now";
  }

  static formatDuration(hours) {
    if (hours < 1) {
      return `${Math.round(hours * 60)}m`;
    }
    return `${hours.toFixed(1)}h`;
  }

  static pluralize(count, singular, plural) {
    return count === 1
      ? `${count} ${singular}`
      : `${count} ${plural || singular + "s"}`;
  }

  static formatTime(value) {
    if (!value) return "";
    if (value instanceof Date) {
      return `${value.getHours().toString().padStart(2, "0")}:${value.getMinutes().toString().padStart(2, "0")}`;
    }
    if (typeof value === "string") {
      if (value.includes("T")) {
        const time = value.split("T")[1] || value;
        if (time.length >= 5) return time.slice(0, 5);
      }
      if (value.length >= 5) return value.slice(0, 5);
    }
    return String(value);
  }

  static formatDateLabel(dateStr, today, tomorrow) {
    const d = new Date(dateStr + "T00:00:00");
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dMid = new Date(d);
    dMid.setHours(0, 0, 0, 0);
    if (today && dMid.getTime() === today.getTime()) return "Today";
    if (tomorrow && dMid.getTime() === tomorrow.getTime()) return "Tomorrow";
    return `${dayNames[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}`;
  }

  static cleanTitle(title) {
    if (!title) return "";
    return title
      .replace(/\[feat\. .*?\]/gi, "")
      .replace(/\(.*?\)/gi, "")
      .trim();
  }

  static stripHtml(html) {
    if (!html) return "";
    return html
      .replace(/<[^>]*>/g, "")
      .replace(/&[^;]+;/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }
}

module.exports = { FormatUtils };
