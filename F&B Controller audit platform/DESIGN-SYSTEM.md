# F&B Controller — Design System

Extracted from the shipped design files. This is descriptive, not aspirational: every value below appears in
`Super Admin Flow.dc.html`, `Auditor Flow - Laptop.dc.html`, `Auditor Flow - Mobile.dc.html` or `Audit report v4.dc.html`.

There are **two surfaces** with deliberately different type treatments. Do not merge them.

| Surface | Files | Character |
|---|---|---|
| **App UI** | Super Admin Flow, Auditor Flow (Laptop + Mobile) | Utilitarian tool. Inter + Newsreader for page titles. Grey-on-white, hairline dividers. |
| **Report / Document** | Audit report v4 | Printed deliverable. Inter Tight + IBM Plex Mono for all numbers. Warmer paper background, card-based. |

---

## 1. Color

### Brand / primary
| Token | Hex | Use |
|---|---|---|
| `--navy-900` | `#16202e` | Primary body text on the report surface; strongest ink |
| `--navy-700` | `#1e3a5f` | **Brand primary.** Primary buttons, active nav, report header bar, icon strokes, section eyebrows, progress fill |
| `--navy-500` | `#2f5d8a` | Links / secondary navy accents |
| `--navy-050` | `#eef2f7` | Navy tint fill (icon chips, active nav background) |
| `--navy-025` | `#f0f4f9` | Lightest navy tint (role badges) |
| `--navy-border` | `#b9c8dd` | Border on navy-tinted chips |
| `--navy-border-soft` | `#dbe4f0` / `#d6e2ee` / `#a8c4de` | Progressive navy borders on cards & report tables |

### Neutrals — App UI
| Token | Hex | Use |
|---|---|---|
| `--bg` | `#fafafa` | Page background |
| `--surface` | `#ffffff` | Cards, panels, sticky header |
| `--surface-alt` | `#f7f9fb` / `#fafbfc` | Card header bands, calculated-field fills |
| `--ink` | `#111111` | Headings, primary text |
| `--ink-2` | `#333333` | Body text |
| `--ink-3` | `#555555` | Secondary body |
| `--muted` | `#888888` | Labels, meta, timestamps |
| `--muted-2` | `#999999` | Lowest-priority meta |
| `--placeholder` | `#bbbbbb` | Input placeholders |
| `--divider` | `#eeeeee` | List row dividers (the workhorse) |
| `--border` | `#dddddd` | Input borders |
| `--border-strong` | `#e6e6e6` | Header rules, card outlines |
| `--border-card` | `#e4e7ea` | Grouped-card outlines |
| `--border-dashed` | `#d9dee4` | Read-only / calculated field borders |

### Neutrals — Report
| Token | Hex | Use |
|---|---|---|
| `--r-bg` | `#f5f7f8` | Paper background (white in print) |
| `--r-ink` | `#16202e` | Body text |
| `--r-ink-2` | `#4a5464` | Secondary text |
| `--r-muted` | `#6b7686` | Labels, uppercase eyebrows |
| `--r-border` | `#e4e8ee` | Table rules, card outlines |
| `--r-border-2` | `#c9d0d8` | Emphasised rules |
| `--r-surface-alt` | `#f8fafc` / `#fafbfc` | Zebra rows, sub-panels |

### Status & severity
| Meaning | Fg | Bg | Border |
|---|---|---|---|
| **Fail / High / Overdue** | `#9f1d17` (report) · `#b91c1c` (app) | `#fdeceb` | `#f0c9c6` |
| **Observation / Medium** | `#8a6a09` | amber tint | — |
| **Pass / Compliant** | `#1f6f62`, dot `#4a9c8c` | `#0d3b34` (deep) | — |
| **Financial / discount callout** | `#8c4a2f` | — | — |
| **Neutral / N-A / assigned** | `#6b7480` / `#9aa4b2` | `#f0f0f0` | `#dcdfe4` |

Audit lifecycle statuses — `assigned` → `in-progress` → `submitted` → `published` (+ `deferred`).
Each renders as a pill; use neutral for `assigned`, navy for `in-progress`, navy-solid for `submitted`, green for `published`.

Checklist item statuses — `pass` · `fail` · `observation` · `na`. `fail` and `observation` additionally carry
`severity` (High / Medium / Low), `impact` and `correctiveAction`.

---

## 2. Typography

### App UI
- **UI / body:** `Inter` — weights 400, 500, 600, 700.
- **Page & screen titles:** `Newsreader` (serif) — weights 500, 600. Used for the wordmark "F&B Controller", screen titles ("Pending Audits"), and diagram captions. Never for body copy.
- **Data / IDs / code:** `ui-monospace, SFMono-Regular, Menlo, monospace`.

```
Google Fonts: family=Inter:wght@400;500;600;700&family=Newsreader:opsz,wght@6..72,500;6..72,600
```

### Report
- **All text:** `Inter Tight` (400–800), fallback `Hanken Grotesk, system-ui`.
- **All numbers, currency, KPIs, table figures:** `IBM Plex Mono` 400–700, with `font-variant-numeric: tabular-nums`. This is non-negotiable — the report's identity is monospaced numerals.
- **Icons:** `Material Symbols Outlined`.

```
Google Fonts: family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter+Tight:wght@400;500;600;700;800
family=Material+Symbols+Outlined:wght,FILL@100..700,0..1
```

### Scale (px — the design uses half-steps intentionally)
| Role | Size / weight |
|---|---|
| Wordmark | 21 / 600 Newsreader |
| Login title | 28 / 600 Newsreader |
| Screen title | 22 / 600 Newsreader |
| Panel title | 18 / 600 |
| Row title | 14–15 / 600 |
| Card header | 13–13.5 / 700 |
| Body | 13 / 400 |
| Meta / label | 12 / 400, color `--muted` |
| Small meta | 11.5 / 400 |
| **Eyebrow** | 10–11 / 700, `letter-spacing: .06–.12em`, `text-transform: uppercase` |
| Chip / pill label | 10 / 700, `letter-spacing: .06em` |
| Report KPI number | 18–21 / 700 IBM Plex Mono |

Line height: `1.4` on tight rows, `1.55–1.6` on prose, `1.9` on the spec's dense paragraphs. Always `text-wrap: pretty` on prose.

---

## 3. Geometry

**Radii:** `3px` (micro tags) · `6px` (inputs, buttons) · `8px` (cards) · `10px` (grouped panels) · `12px` (large containers) · `20px` / `9999px` (pills).

**Borders:** always `1px solid`. Read-only/calculated values use `1px dashed #d9dee4`.

**Spacing rhythm:** 2 · 4 · 6 · 8 · 10 · 12 · 14 · 16 · 18 · 22 · 24 · 28 px. Card padding `12–16px`; page padding `24px` desktop / `16px` mobile; sticky header `14px 28px`.

**Shadows:** almost none. Only the report header carries `0 2px 6px rgba(13,59,52,.25)`. Depth comes from borders, not shadow.

**Layout:** flex/grid with `gap` throughout. App content is centred with a `max-width` container on a `#fafafa` field. Lists are flat rows separated by `1px solid #eee` — no card-per-row.

---

## 4. Components

**Sticky app header** — white, `1px solid #e6e6e6` bottom, `position:sticky; z-index:20`. Newsreader wordmark left, role badge right.

**Role badge** — pill, `#f0f4f9` bg, `#b9c8dd` border, `#1e3a5f` text, 11px/700 uppercase, `letter-spacing:.08em`.

**Primary button** — `#1e3a5f` bg, white text, `border:none`, `radius:6px`, `padding:13px`, 14px/600. Secondary = text-only `#888` with no border. Disabled = neutral grey; the Submit action is disabled until nothing is missing.

**Text input** — `padding:11px 12px`, `1px solid #ddd`, `radius:6px`, 14px. Focus → `border-color:#111`. Numeric inputs are `width:150px; text-align:right`. Label sits above at 12px `#888`.

**Calculated field** — same box metrics, but `1px dashed #d9dee4`, `background:#f6f8fa`, `font-weight:700`, right-aligned. Never editable.

**Grouped panel** — `1px solid #e4e7ea`, `radius:10px`, white body; header band `#f7f9fb` with `1px solid #e4e7ea` bottom, holding a 13px/700 title, a 12px `#8a93a0` hint, and a right-aligned progress string (`"4 of 12"`).

**Numbered department chip** — `24×24`, `radius:6px`, `#eef2f9` bg, `#dbe4f0` border, `#1e3a5f` 11px/700, centred.

**List row** — `padding:16px 4px`, `border-bottom:1px solid #eee`, `cursor:pointer`; title 15/600 with a 15px stroked SVG icon at `#1e3a5f` and `stroke-width:1.8`; meta line 13px `#888`; status pill right-aligned, `white-space:nowrap`.

**Progress bar** — 5px tall, track `#eee`, fill `#1e3a5f`, `radius:3px`.

**Overdue marker** — `● OVERDUE`, 11px/700, `#b91c1c`, `letter-spacing:.04em`.

**Flow diagram** (spec doc) — dotted-grid card: `1px solid #d9dde3`, `radius:10px`, `background:#f6f7f8` + `radial-gradient(#d3d8de 1px,transparent 1px)` at `14px 14px`. Steps are equal-flex white boxes, `1px solid #9aa1a9`, `radius:8px`, 11.5px centred, joined by `34px`-wide `→` cells in `#6b7280`. Branches indent `28px` under an italic `↳` caption.

**Report table** — full-width, `#e4e8ee` rules, 12px cells with `padding:12px`, header row in 10.5px/600 uppercase `#6b7686`, figures right-aligned in IBM Plex Mono with tabular numerals. Categories carry an 8px round colour dot.

**Report KPI strip** — equal cells divided by `border-right:1px solid #e4e8ee`; big mono number over a 10.5px uppercase `#6b7686` label.

**Icons** — App UI: inline stroked SVG, `stroke:#1e3a5f`, `stroke-width:1.8`, 14–16px, `fill:none`. Report: Material Symbols Outlined. Do not mix the two systems on one surface.

---

## 5. Print

The report and the spec doc are print-first (`doc-page.js`, letter, `0.6in` margin):

```css
@media print {
  body { background:#fff !important; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
  [data-noprint] { display:none !important; }
  [data-avoid]   { page-break-inside:avoid; }
  [data-break]   { page-break-before:always; }
}
```

Mark every card, table block and diagram `data-avoid`. Chrome (headers, toolbars, edit affordances) gets `data-noprint`.

---

## 6. Voice

Sentence case for everything except eyebrows and pills. Labels are plain nouns ("Due", "Covers", "Total Discount") — no invented product vocabulary. Hints are one short sentence, lowercase-feeling: *"Rows marked calculated fill in automatically."* Currency is Indian-format short-scale: `₹4.80L`. Dates render as `Due 14 Jul`. Never use emoji.
