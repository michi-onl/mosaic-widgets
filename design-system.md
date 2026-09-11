# Mosaic Design System v2 — Apple-native / Liquid Glass

**Date:** 2026-09-11
**Direction:** Apple-native, SF-clean, iOS 26 Liquid Glass. Do it how Apple would.

---

## 1. Constraints that shape the design

- **Scriptable `ListWidget` cannot render backdrop blur or real system materials.**
  On iOS 26 the widget surface is already Liquid Glass — the OS provides it. Our job
  is to make content that sits correctly on that surface, not to fake glass inside it.
- **No custom fonts.** SF via `Font.systemFont` / `semiboldSystemFont` only.
- **No dynamic type / accessibility text sizes.** We scale per widget family instead.

## 2. Principles

1. **Content first.** The widget is content; there is no scrolling chrome to glass over.
   Apply glass at most to small grouping surfaces, never to every cell.
2. **SF typography with one emphasis weight.** Semibold for titles, regular for
   everything else. No bold, no italics, no all-caps.
3. **Color is identity and status, never decoration.** One accent (systemBlue) plus
   semantic red/green/orange. Per-source brand color tints the leading SF Symbol only.
4. **Concentric radii.** `outer 12 → control 10 → tag 6 → icon 4`.
5. **Spacing over rules.** List rows are separated by whitespace, not dividers.
   `addSeparator()` remains available for grouped surfaces but is not used between
   rows, and there is no footer rule.
6. **4/8pt rhythm.** Spacing comes from the family's `spacing` token, never ad hoc.

## 3. Color tokens (`CONFIG.colors`)

Semantic HIG labels, dynamic for light/dark. Alpha via `new Color(hex, alpha)`.

| Token | Light | Dark | Use |
|---|---|---|---|
| `label` | `#000000` | `#FFFFFF` | Titles, primary text |
| `secondaryLabel` | `#3C3C43` 60% | `#EBEBF5` 60% | Context, authors |
| `tertiaryLabel` | `#3C3C43` 30% | `#EBEBF5` 30% | Metadata, timestamps |
| `quaternaryLabel` | `#3C3C43` 18% | `#EBEBF5` 18% | Disabled/decorative |
| `separator` | `#3C3C43` 29% | `#545458` 65% | Hairlines |
| `fill` | `#787880` 12% | `#787880` 24% | Tag/group translucent fill |
| `accent` | `#007AFF` | `#0A84FF` | Default tint, "new" dot |
| `warning` | `#FF9500` | `#FF9F0A` | Offline, pre-release, private |
| `up` / `down` | `#34C759` / `#FF3B30` | `#30D158` / `#FF453A` | Deltas |
| `new` | accent | accent | Unread dot (blue, as in Mail/News) |

Status palettes (`steamStatus`, `dhbwTypes`) map onto the same system colors.

## 4. Type scale (`CONFIG.sizing.<family>.fontSize`)

Compacted from SF text styles. `title` is the semibold emphasis role; `primary`
remains as an alias for call sites that predate the rename.

| Role | small | medium | large | extraLarge | Weight | Use |
|---|---|---|---|---|---|---|
| title/primary | 13 | 15 | 17 | 18 | Semibold | Item names |
| secondary | 11 | 13 | 15 | 16 | Regular | Authors, context |
| tertiary | 10 | 11 | 13 | 14 | Regular | Metadata |
| caption | 9 | 10 | 11 | 12 | Regular | Header timestamp, tags |

`src/design-system.js` exposes `typography.title/body/footnote/caption(sizes)` so
render code never hardcodes a weight.

## 5. Spacing, radii, images

- Spacing: small 6, medium 8, large 10, extraLarge 10 (`sizes.spacing`, on the 4pt grid family).
- Radii: `designTokens.cornerRadius = { badge: 6, control: 10, card: 12, icon: 4, cover: 8 }`.
- Tags: `badge.paddingV/H = 3/8`.
- Image sizes live in `CONFIG.images` (`grid` square icons, `gridTall` portrait
  posters, `gridSquare` square album covers, `card` book covers — per family).
- Space budgeting: `CONFIG.widgetCanvas` holds the per-family drawable canvas;
  `DataSource.maxItemsThatFit(sizes, widgetSize)` divides it by each source's
  `rowHeight()` (overridden by tall-row sources) and `renderItemList`/`renderGrid`
  render only that many rows. `test/overflow.test.js` guards this across families.

## 6. Components

- **Header** — leading SF Symbol tinted with the source color (identity), semibold
  `label` title, optional `secondaryLabel` subtitle, and the `tertiaryLabel` refresh
  timestamp right-aligned on the same line (offline = `warning` `icloud.slash` glyph).
  No counts.
- **Tag / badge** — neutral translucent `fill` capsule with a colored label or glyph
  (Apple "tinted" style). Replaces the old solid color pills.
- **List row** — no separators; rows are spaced with `sizes.spacing`. Leading
  accessory optional.
- **Separator** — `design-system.addSeparator(stack, { inset })`, `separator` color.
  Reserved for grouped surfaces; no longer used for a footer rule.
- **Refresh time** — `tertiaryLabel` caption at the header's trailing edge
  (`DataSource.addRefreshTime`); offline adds a `warning` `icloud.slash` glyph.
  Costs no extra vertical space.
- **Error** — warning triangle, semibold title, `secondaryLabel` message, tap hint.
- **Glass surface** — `design-system.addGlassSurface(stack)` = `fill` + `card` radius.
  Use sparingly for grouping; never for arbitrary cells.

## 7. Liquid Glass translation

The skill's two-layer model (content vs. functional chrome) collapses here because a
widget has no chrome layer. We keep the rest: content-first, translucent surfaces only
where grouping helps, high-contrast semantic text so translucency never threatens
legibility, and no heavy brand color on surfaces.

## 8. Migration status

- **Done (v2 token pass):** semantic palette + alpha labels; SF type scale; concentric
  radii; semibold emphasis; tinted tags; semantic separators; slimmed error widget;
  refresh timestamp moved into the header.
- **Done (sizing pass):** extraLarge family; per-source row budgeting so content fits
  every family (`test/overflow.test.js`).
- **Next:** per-source layout polish against these tokens (list/grid/card), then
  on-device verification across small/medium/large/extraLarge in light and dark.
