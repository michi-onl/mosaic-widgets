const CONFIG = {
  // Default settings
  defaultSource: "billboard",
  apiBaseUrl: "https://api.michi.onl/api",
  apiToken: "", // Set via in-app "API Token" setup UI; stored in Keychain

  // Widget sizing configuration
  sizing: {
    small: {
      maxItems: 4,
      fontSize: { primary: 12, secondary: 10, tertiary: 9, caption: 8 },
      iconSize: 14,
      spacing: 5,
      padding: 14,
    },
    medium: {
      maxItems: 4,
      fontSize: { primary: 14, secondary: 12, tertiary: 10, caption: 9 },
      iconSize: 16,
      spacing: 8,
      padding: 16,
    },
    large: {
      maxItems: 12,
      fontSize: { primary: 16, secondary: 13, tertiary: 11, caption: 10 },
      iconSize: 18,
      spacing: 10,
      padding: 18,
    },
  },

  // Standardized image sizes per layout template
  images: {
    grid: {
      small: { width: 32, height: 32, cornerRadius: 4 },
      medium: { width: 40, height: 40, cornerRadius: 4 },
      large: { width: 48, height: 48, cornerRadius: 6 },
    },
    gridTall: {
      small: { width: 28, height: 42, cornerRadius: 4 },
      medium: { width: 36, height: 54, cornerRadius: 4 },
      large: { width: 44, height: 66, cornerRadius: 6 },
    },
    card: {
      small: { width: 40, height: 60, cornerRadius: 6 },
      medium: { width: 60, height: 90, cornerRadius: 6 },
      large: { width: 80, height: 120, cornerRadius: 8 },
    },
  },

  // Color scheme following iOS system design
  colors: {
    // Dynamic colors that adapt to light/dark mode
    primary: Color.dynamic(new Color("#000000"), new Color("#FFFFFF")),
    secondary: Color.dynamic(new Color("#8E8E93"), new Color("#8E8E93")),
    secondaryBright: Color.dynamic(new Color("#8E8E93"), new Color("#AEAEB2")),
    tertiary: Color.dynamic(new Color("#C7C7CC"), new Color("#636366")),

    // Semantic colors
    accent: new Color("#007AFF"),
    warning: new Color("#FF9500"),

    // Status indicators
    new: new Color("#FF9500"),
    up: new Color("#34C759"),
    down: new Color("#FF3B30"),
    unchanged: Color.dynamic(new Color("#8E8E93"), new Color("#636366")),

    sunset: new Color("#FF6B35"),
    golden: new Color("#FFD700"),
    white: Color.white(),

    // Steam status indicators (moved from SteamDataSource.statusColors)
    steamStatus: {
      online: new Color("#34C759"),
      "in-game": new Color("#34C759"),
      offline: new Color("#8E8E93"),
      private: new Color("#FF9500"),
    },

    dhbwTypes: {
      Vorlesung: new Color("#007AFF"),
      Übung: new Color("#34C759"),
      Labor: new Color("#FF9500"),
      Praktikum: new Color("#FF9500"),
      Seminar: new Color("#AF52DE"),
      Tutorium: new Color("#5856D6"),
      Klausur: new Color("#FF3B30"),
      Prüfung: new Color("#FF3B30"),
    },
  },

  // Shared design tokens for badges, radii, and spacing
  designTokens: {
    // badge radius set generously above half the tallest badge's height so it
    // always renders as a fully rounded pill, not a rounded rectangle
    cornerRadius: { badge: 8, icon: 3, cover: 6 },
    badge: { paddingV: 3, paddingH: 7 },
    compactSpacing: 4,
  },

  messages: {
    offline: "Offline",
    tapRetry: "Tap to try again",
  },

  // Source-specific configuration
  sources: {
    billboard: {
      name: "Billboard 200",
      endpoint: "/billboard-200",
      icon: "chart.bar.fill",
      color: new Color("#FF2D55"),
      refreshHours: 24,
      urlScheme: "https://www.billboard.com/charts/billboard-200/",
    },
    imdb: {
      name: "IMDb Popular",
      endpoint: "/imdb",
      icon: "tv.fill",
      color: new Color("#F5C518"), // IMDb's own brand yellow
      refreshHours: 12,
      urlScheme: "imdb://",
    },
    steam: {
      name: "Steam Games",
      endpoint: "/steam-profiles",
      icon: "gamecontroller.fill",
      color: new Color("#66C0F4"), // Steam's own brand blue
      refreshHours: 6,
      urlScheme: "steam://",
      profiles: [], // Set via widget-config.json
    },
    hackernews: {
      name: "Hacker News",
      endpoint: "/hackernews",
      icon: "newspaper.fill",
      color: new Color("#FF6600"), // Hacker News' own brand orange
      refreshHours: 1,
      urlScheme: "https://news.ycombinator.com/",
    },
    github: {
      name: "GitHub Releases",
      endpoint: "/github-releases",
      icon: "arrow.down.circle",
      color: new Color("#6e5494"), // matches TimelineDataSource/ActivityDataSource github badge color
      refreshHours: 6,
      urlScheme: "https://github.com/",
      repos: [], // Set via widget-config.json
    },
    wikipedia: {
      name: "Wikipedia Edits",
      endpoint: "/wikipedia-watchlist",
      icon: "book.fill",
      color: new Color("#636466"), // matches TimelineDataSource/ActivityDataSource wikipedia badge color
      refreshHours: 2,
      urlScheme: "https://wikipedia.org/",
      limit: 10,
      hours: 72,
    },
    timeline: {
      name: "Timeline",
      endpoint: "/timeline",
      icon: "clock.arrow.circlepath",
      // no color override: aggregates other sources, whose rows already carry their own color
      refreshHours: 1,
      urlScheme: "https://www.michi.onl/",
    },
    bookmarks: {
      name: "Bookmarks",
      endpoint: "/bookmarks",
      icon: "bookmark.fill",
      color: new Color("#30B0C7"),
      refreshHours: 1,
      urlScheme: "https://linkding.michi.onl/",
    },
    "dhbw-timetable": {
      name: "DHBW Timetable",
      endpoint: "/dhbw-timetable",
      icon: "calendar.badge.clock",
      // no color override: each event row is already color-coded by CONFIG.colors.dhbwTypes
      refreshHours: 1,
    },
    astronomy: {
      name: "Astronomy",
      icon: "moon.stars.fill",
      color: new Color("#FFD700"), // matches CONFIG.colors.golden, ties into the golden-hour row
      refreshHours: 1,
      urlScheme: "weather://",
    },
    bluesky: {
      name: "Bluesky",
      icon: "bubble.left.fill",
      color: new Color("#0285FF"), // Bluesky's own brand blue
      refreshHours: 1,
      urlScheme: "https://bsky.app/",
    },
    activity: {
      name: "Activity",
      endpoint: "",
      icon: "bolt.fill",
      // no color override: aggregates other sources, whose rows already carry their own color
      refreshHours: 1,
      urlScheme: "",
    },
    statusboard: {
      name: "Status Board",
      icon: "square.grid.2x2.fill",
      // no color override: every row already carries its own source's color
      refreshHours: 1,
      urlScheme: "",
    },
    books: {
      name: "Currently Reading",
      icon: "book.fill",
      color: new Color("#A0522D"),
      refreshHours: 24,
      urlScheme: "goodreads://",
      apiUrl: "https://www.googleapis.com/books/v1/volumes?q=isbn:",
      goodreadsIconUrl:
        "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/42/d8/cd/42d8cdbf-48df-d1b6-ade9-d972bac7f371/PolarisAppIcon-0-0-1x_U007epad-0-1-0-85-220.png/1024x1024bb.jpg",
    },
  },

  // Language display mapping for books
  languageMap: {
    es: "Spanish 🇪🇸",
    en: "English 🇺🇸",
    de: "German 🇩🇪",
    fr: "French 🇫🇷",
    it: "Italian 🇮🇹",
    pt: "Portuguese 🇧🇷",
    ja: "Japanese 🇯🇵",
  },

  maturityMap: {
    NOT_MATURE: "4+",
    MATURE: "18+",
  },
};

module.exports = { CONFIG };
