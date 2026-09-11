// Representative render fixtures, one per source, shaped like each source's
// fetchData() return value. They deliberately use long-ish strings so the
// overflow harness measures a worst case rather than a best case.
require("./scriptable-stubs");
const { Image } = require("./scriptable-stubs");

const img = (name) => new Image(name);

// Enough items to always exceed the render budget, so the harness measures the
// filled widget rather than a fixture-starved one.
const MANY = 18;

const FIXTURES = {
  billboard: {
    data: {
      title: "Billboard 200",
      subtitle: "Top albums",
      items: Array.from({ length: MANY }, (_, i) => ({
        position: i + 1,
        title: "The Tortured Poets Department",
        subtitle: "Taylor Swift",
        cover: img("cover"),
        metadata: { last_week: i + 1, peak: 1, weeks: 12 + i },
      })),
    },
  },

  imdb: {
    data: {
      movies: Array.from({ length: MANY / 2 }, () => ({
        title: "Dune: Part Two",
        subtitle: "2024 • 2h 46m",
        rating: "8.5",
        genre: "Sci-Fi",
        url: "https://imdb.com",
        type: "movie",
        imageUrl: "x",
        poster: img("poster"),
      })),
      tvShows: Array.from({ length: MANY / 2 }, () => ({
        title: "Shogun",
        subtitle: "2024 • 1h",
        rating: "8.6",
        genre: "Drama",
        url: "https://imdb.com",
        type: "tv",
        imageUrl: "x",
        poster: img("poster"),
      })),
    },
  },

  steam: {
    data: {
      games: Array.from({ length: MANY }, (_, i) => ({
        name: "Baldur's Gate 3",
        hoursPlayed: 120 + i,
        lastPlayedShort: "2h ago",
        iconUrl: "x",
        storeUrl: "https://steam",
        icon: img("icon"),
      })),
    },
  },

  hackernews: {
    data: {
      stories: Array.from({ length: MANY }, (_, i) => ({
        title: `Show HN: A very long story title number ${i}`,
        points: 120 + i,
        comments: 30 + i,
        author: "user",
        timeAgo: "2h",
        url: "https://news.ycombinator.com",
        domain: "example.com",
        hnUrl: "https://news.ycombinator.com",
      })),
    },
  },

  github: {
    data: {
      releases: Array.from({ length: MANY }, (_, i) => ({
        repo: "anthropics/claude-code",
        releaseName: "Release",
        tagName: `v1.2.${i}`,
        timeAgo: "3h",
        author: "someone",
        authorAvatarUrl: "x",
        isPrerelease: i === 0,
        url: "https://github.com",
        authorAvatar: img("avatar"),
      })),
    },
  },

  wikipedia: {
    data: {
      edits: Array.from({ length: MANY }, (_, i) => ({
        title: `Some article title number ${i}`,
        language: "en",
        user: "editor",
        timeAgo: "5m",
        comment: "fix reference and clean up",
        url: "https://en.wikipedia.org",
      })),
      errors: null,
    },
  },

  timeline: {
    data: {
      events: Array.from({ length: MANY }, (_, i) => ({
        title: `A timeline event with a longer title ${i}`,
        source: "github",
        date: new Date().toISOString(),
        url: "https://example.com",
      })),
    },
  },

  bookmarks: {
    data: {
      bookmarks: Array.from({ length: MANY }, (_, i) => ({
        title: `A bookmarked article title number ${i}`,
        description: "desc",
        tags: ["dev"],
        url: "https://example.com/a",
        domain: "example.com",
        dateAdded: "2024-01-01",
      })),
    },
  },

  books: {
    data: {
      title: "The Design of Everyday Things",
      authors: "Don Norman",
      publisher: "Basic Books",
      publishedDate: "2013",
      pageCount: 368,
      categories: "Design, Psychology",
      maturityRating: "4+",
      language: "English 🇺🇸",
      coverImage: img("cover"),
      goodreadsIcon: img("gr"),
    },
  },

  astronomy: {
    data: {
      sunrise: "2026-09-12T06:30:00",
      sunset: "2026-09-12T19:45:00",
      uvIndex: 4.2,
      temperature: 21.4,
      weatherCode: 1,
      moonPhase: 0.5,
      goldenMorning: {
        start: "2026-09-12T06:00:00",
        end: "2026-09-12T07:00:00",
      },
      goldenEvening: {
        start: "2026-09-12T19:15:00",
        end: "2026-09-12T20:15:00",
      },
    },
  },

  bluesky: {
    data: {
      posts: Array.from({ length: MANY }, (_, i) => ({
        text: `A fairly long bluesky post body number ${i} that keeps going.`,
        author: "Some Person",
        handle: "person.bsky.social",
        avatarUrl: "x",
        avatar: img("avatar"),
        createdAt: new Date().toISOString(),
        likes: 12,
        reposts: 3,
        replies: 4,
        url: "https://bsky.app",
        isRepost: false,
      })),
    },
  },

  activity: {
    data: {
      items: Array.from({ length: MANY }, (_, i) => ({
        source: "github",
        key: `k${i}`,
        title: `repo-name v1.0.${i}`,
        detail: "someone • 3h",
        url: "https://example.com",
      })),
    },
  },

  statusboard: {
    data: {
      sources: ["hackernews", "github", "steam", "billboard", "bluesky"].map(
        (name, i) => ({
          name,
          config: require("../src/config.js").CONFIG.sources[name],
          topItem: `Top item from ${name} with a somewhat long headline ${i}`,
          error: null,
        }),
      ),
    },
  },

  "dhbw-timetable": {
    data: {
      courseName: "Wirtschaftsinformatik 2023",
      courseCode: "WI23",
      events: Array.from({ length: MANY }, (_, i) => ({
        id: i,
        name: `Programmierung und Softwaretechnik ${i}`,
        type: "Vorlesung",
        date: "2026-09-12",
        startTime: "08:00",
        endTime: "11:15",
        lecturer: "Prof. Dr. Mustermann",
        rooms: ["Raum 101"],
        course: "WI23",
      })),
    },
  },
};

module.exports = { FIXTURES };
