# Design

Two parts. **Part A** is the single source of truth for design tokens — reference these, never inline a
raw value; if something genuinely new is needed, add it here first. **Part B** is an append-only UX
decision log (ADR-style, `UX-NNN`): a flow changing later is a *new* entry that can supersede an older
one, never a silent overwrite.

Tokens below are captured as-given from `DESIGN-SYSTEM.md` (extracted from the shipped design files) —
that file remains the authoritative extraction; this consolidates the working set. **Two surfaces with
deliberately different type treatments — do not merge them.**

> **The `.dc.html` design files are the authoritative UI reference.** This file is the distilled token
> layer, but for anything a token doesn't fully pin down — exact spacing on a specific screen, a
> component variant, a layout, an interaction — **open the matching design file and copy the exact
> inline-style values; do not invent.** Map: Super Admin → `Super Admin Flow.dc.html`; Auditor →
> `Auditor Flow - Mobile.dc.html` (primary) + `Auditor Flow - Laptop.dc.html`; report →
> `Audit report v4.dc.html`; overall flow/screens → `Product Spec - Flow, Screens & Stories.dc.html`.
> If you introduce anything genuinely new, add it to Part A here first (maintenance rule 8). See
> `CLAUDE.md` → "Design source files" for the full table and precedence.

---

# Part A — Design system

## Colour

**Brand / navy**
| Token | Hex | Use |
|---|---|---|
| `--navy-900` | `#16202e` | Strongest ink; report body text |
| `--navy-700` | `#1e3a5f` | **Brand primary** — primary buttons, active nav, report header, progress fill, icon strokes, eyebrows |
| `--navy-500` | `#2f5d8a` | Links / secondary accents |
| `--navy-050` | `#eef2f7` | Navy tint fill (icon chips, active nav bg) |
| `--navy-025` | `#f0f4f9` | Lightest tint (role badges) |
| `--navy-chip` | `#eef2f9` | Department chip fill (added during F2 — distinct from `--navy-025`, confirmed against the chip markup in all three flow files) |
| `--navy-border` | `#b9c8dd` | Border on navy chips |
| `--navy-border-soft` | `#dbe4f0` / `#d6e2ee` / `#a8c4de` | Progressive card/table borders |

**Neutrals — App UI**
| Token | Hex | Use |
|---|---|---|
| `--bg` | `#fafafa` | Page background |
| `--surface` | `#ffffff` | Cards, panels, sticky header |
| `--surface-alt` | `#f7f9fb` / `#fafbfc` | Card header bands |
| `--surface-calculated` | `#f6f8fa` | Calculated field fill (added during F2 — distinct from `--surface-alt`, confirmed against `Auditor Flow - Mobile/Laptop.dc.html` line ~125) |
| `--ink` / `--ink-2` / `--ink-3` | `#111` / `#333` / `#555` | Headings / body / secondary |
| `--muted` / `--muted-2` | `#888` / `#999` | Labels, meta / lowest-priority meta |
| `--placeholder` | `#bbb` | Input placeholders |
| `--hint` | `#8a93a0` | Grouped-panel header hint text (added during F2 — `Super Admin Flow.dc.html` grouped-panel headers) |
| `--divider` | `#eee` | List-row dividers (the workhorse) |
| `--border` / `--border-strong` | `#ddd` / `#e6e6e6` | Input borders / header rules |
| `--border-card` | `#e4e7ea` | Grouped-card outlines |
| `--border-dashed` | `#d9dee4` | Read-only / calculated field borders |

**Neutrals — Report**
| Token | Hex | Use |
|---|---|---|
| `--r-bg` | `#f5f7f8` | Paper (white in print) |
| `--r-ink` / `--r-ink-2` | `#16202e` / `#4a5464` | Body / secondary |
| `--r-muted` | `#6b7686` | Labels, uppercase eyebrows |
| `--r-border` / `--r-border-2` | `#e4e8ee` / `#c9d0d8` | Table rules / emphasised rules |
| `--r-surface-alt` | `#f8fafc` / `#fafbfc` | Zebra rows, sub-panels |

**Status & severity**
| Meaning | Fg | Bg | Border |
|---|---|---|---|
| Fail / High / Overdue | `#9f1d17` (report) · `#b91c1c` (app) | `#fdeceb` | `#f0c9c6` |
| Observation / Medium | `#8a6a09` | amber tint | — |
| Pass / Compliant | `#1f6f62`, dot `#4a9c8c` | `#0d3b34` (deep) | — |
| Financial / discount callout | `#8c4a2f` | — | — |
| Neutral / N-A / assigned | `#6b7480` / `#9aa4b2` | `#f0f0f0` | `#dcdfe4` |

Audit lifecycle pills: `assigned` (neutral) → `in-progress` (navy) → `submitted` (navy-solid) →
`published` (green) · `deferred`. Checklist item statuses: `pass` · `fail` · `observation` · `na`;
`fail`/`observation` also carry `severity` (High/Medium/Low), `impact`, `correctiveAction`.

## Typography
**App UI** — body/UI `Inter` (400–700); page & screen titles `Newsreader` serif (500/600, titles &
wordmark only, never body); data/IDs `ui-monospace`. **Report** — all text `Inter Tight` (400–800); **all
numbers/currency/KPIs `IBM Plex Mono` with `font-variant-numeric: tabular-nums` (non-negotiable)**; icons
`Material Symbols Outlined`. Do not substitute Inter on the report or mix icon systems on one surface.

Scale (px): wordmark 21/600 · login title 28/600 · screen title 22/600 (Newsreader) · panel 18/600 ·
row title 14–15/600 · card header 13–13.5/700 · body 13/400 · meta 12/400 `--muted` · small meta 11.5 ·
eyebrow 10–11/700 uppercase `.06–.12em` · chip/pill 10/700 `.06em` · report KPI 18–21/700 mono.
Line height 1.4 tight / 1.55–1.6 prose; `text-wrap: pretty` on prose.

## Geometry
Radii `3` (tags) · `6` (inputs/buttons) · `8` (cards) · `10` (panels) · `12` (large) · `20`/`9999` (pills).
Borders always `1px solid`; read-only/calculated `1px dashed #d9dee4`. Spacing rhythm
`2·4·6·8·10·12·14·16·18·22·24·28`; card padding 12–16; page padding 24 desktop / 16 mobile; sticky header
`14px 28px`. Shadows almost none — depth from borders (only the report header carries one). Lists are
flat rows on `#fafafa`, separated by `1px solid #eee` — no card-per-row.

## Core components
- **Sticky header** — white, `1px solid #e6e6e6` bottom, `sticky; z-index:20`; Newsreader wordmark left, role badge right.
- **Role badge** — pill, `#f0f4f9` bg / `#b9c8dd` border / `#1e3a5f` text, 11/700 uppercase `.08em`.
- **Primary button** — `#1e3a5f`, white text, no border, radius 6, padding 13, 14/600. Secondary = text-only `#888`. Submit disabled until nothing missing.
- **Text input** — `padding 11px 12px`, `1px solid #ddd`, radius 6, 14px; focus border `#111`; numeric inputs `width:150px; text-align:right`; label above at 12/`#888`.
- **Calculated field** — same box, `1px dashed #d9dee4`, `bg #f6f8fa`, weight 700, right-aligned. Never editable.
- **Grouped panel** — `1px solid #e4e7ea`, radius 10; header band `#f7f9fb` with 13/700 title, 12px hint, right-aligned progress string (`"4 of 12"`).
- **Department chip** — 24×24, radius 6, `#eef2f9` bg / `#dbe4f0` border, `#1e3a5f` 11/700, centred.
- **List row** — `padding 16px 4px`, `border-bottom 1px solid #eee`, pointer; 15/600 title + 15px stroked SVG icon (`#1e3a5f`, `stroke-width 1.8`); 13px `#888` meta; right-aligned status pill.
- **Progress bar** — 5px tall, track `#eee`, fill `#1e3a5f`, radius 3.
- **Overdue marker** — `● OVERDUE`, 11/700 `#b91c1c` `.04em`.
- **Report table / KPI strip** — full-width `#e4e8ee` rules, 12px cells; header 10.5/600 uppercase `#6b7686`; figures right-aligned mono; category colour dot 8px. KPI strip: big mono number over 10.5 uppercase label, cells divided by `border-right`.
- **Icons** — App UI: inline stroked SVG `#1e3a5f`, `stroke-width 1.8`, 14–16px, `fill:none`. Report: Material Symbols Outlined.

## Print
Report + spec are print-first (`doc-page.js`, letter, `0.6in` margin). `[data-noprint]` hidden;
`[data-avoid]` = `page-break-inside:avoid` (every card/table/diagram); `[data-break]` =
`page-break-before:always`; `print-color-adjust:exact`; background white in print.

## Voice
Sentence case except eyebrows/pills. Plain-noun labels ("Due", "Covers", "Total Discount") — no invented
vocabulary. Hints are one short lowercase-feeling sentence. Currency Indian short-scale `₹4.80L`; dates
`Due 14 Jul`. Never use emoji.

---

# Part B — UX / product design decisions

Append-only. Each entry: the decision, the "why", and what it trades off. Supersede, don't overwrite.

### UX-001 — Auditor app is one responsive tree, mobile-primary
**Decision:** build a single component tree for the auditor app; mobile is the primary target, laptop is
the widened variant. Mobile uses two tabs (`metrics` / `checklist`) + a bottom-anchored submit; laptop
stacks both steps with a right-aligned progress block. **Why:** auditors work on a phone in the outlet;
designing mobile-first and widening avoids a desktop layout awkwardly squeezed onto a phone. Same screen
keys, data and rules across both — differences are layout only. **Trade-off:** the laptop view is
constrained by mobile's information architecture rather than exploiting desktop space freely.

### UX-002 — "Save the session": server-persisted drafts + explicit Save, no offline
**Decision:** the session stays signed in across restarts/dead zones (admin can end all sessions), and the
in-progress audit is saved **server-side** via an explicit Save button — no autosave, no offline engine.
**Why:** with the server as the single source of truth, the same in-progress audit reopens on any device
(mobile→laptop handoff is free), and Save only writes small structured data so it stays fast (photos
upload one-by-one on capture). **Trade-off:** assumes connectivity while auditing — the one assumption to
confirm with the client; if offline is genuinely needed, the submit model changes (would supersede this).

### UX-003 — Submit is one confirmed, irreversible action, with named validation
**Decision:** Submit is disabled until nothing is missing; when blocked it **names what's missing** (a
count and the items), not just refuses; submitting asks for confirmation, then makes the audit read-only
for the auditor permanently. **Why:** completeness is the product's core promise, and an immutable
capture is what the review/report pipeline can trust. **Trade-off:** no unsubmit — every correction is an
admin-side action, which is deliberate.

### UX-004 — Reviewer sees the submission exactly as captured
> **Partly superseded by UX-010.** Remarks are no longer verbatim — they are AI-polished on submit. The
> rest of this entry (the submission is shown as captured and never edited in place; the reviewer sets
> severity/impact/corrective-action) still holds.

**Decision:** the review screen shows the submission as captured and is never edited in place; the
reviewer sets severity/impact/corrective-action and generates findings, but the auditor's remarks reach
the report **unedited**. **Why:** preserves the integrity of the field record and keeps a clean line
between what was observed (auditor) and what was judged (reviewer). **Trade-off:** reviewer judgements
live only in the report version, since there is no separate audit trail.

### UX-005 — Report delivered as a version-stamped PDF (+ read-only Client Portal)
**Decision:** the published report is a self-contained, prominently version-stamped PDF
(`v1 · 21 Jul 2026`), shared by the admin and surfaced read-only in the white-labelled Client Portal via
an unguessable token; corrections publish as a new version. **Why:** a downloaded file can't be recalled,
so visible version clarity replaces a revocable-link model; the token gives account-free outlet access.
**Trade-off:** old PDFs remain in the wild — version stamping, not revocation, is what prevents confusion.

### UX-006 — Severity is High / Medium / Low
**Decision:** three severity levels only. The `Critical` value that appears in the Super Admin file's seed
data is dropped. **Why:** DESIGN Part A defines colours for three, and the report's severity `<select>` and
its summary ribbon are both built for three (+ Passed) — the seed outran the design system rather than
extending it. **Trade-off:** nothing can be escalated above High; a genuinely urgent finding is carried by
the SLA field ("Immediate (24 Hours)") instead of by a fourth severity. Recorded as R7 in `EXECUTION.md`.

### UX-007 — Compliance % excludes N/A only
**Decision:** the department and report compliance figure is `pass / (pass + fail + observation)`. N/A is
excluded from the denominator; an observation counts against the score. **Why:** the stated invariant is
that *N/A* is neither fail nor blank — it says nothing about observations, and an observation is a real
non-conformity. The design file's `scoreLabel` excludes both, which flatters the score. **Trade-off:**
scores read lower than the mock's, and an outlet with many advisory observations is penalised alongside one
with outright failures. Recorded as R8 in `EXECUTION.md`.

### UX-008 — No separate findings register in the report
**Decision:** the report ends at §2. The spec's "§3 · Findings Register" (RP-1) is not built. **Why:** §2's
compliance matrix already carries Ref ID, checkpoint and observation, operational impact, risk severity,
corrective action and SLA — a register would print every finding twice, and design wins on layout per the
stated precedence rule. **Trade-off:** there is no flat, cross-department view of findings in the PDF; a
reader wanting only the failures scans the department cards. Recorded as R9 in `EXECUTION.md`.

### UX-009 — A remark is required on non-pass points only
**Decision:** fail, observation and N-A each require a remark; a bare Pass is allowed. N/A additionally
requires a reason from the fixed list of five. **Why:** on a 38-point checklist most points pass, and
demanding a typed sentence on each one makes the mobile-first capture slow enough that auditors work around
it. The evidentiary value is in explaining what went wrong. **Trade-off:** reverses `HANDOVER.md`'s
"remark required on every point"; a pass is recorded without supporting words. Recorded as R10.

### UX-010 — AI polishes remarks on submit *(supersedes UX-004 on the remarks point)*
**Decision:** submitting queues a job that rewrites every non-pass remark into report prose, and the
polished text **replaces** the raw remark. No verbatim copy is retained. The model rewrites prose only and
never touches a number. A failed polish never blocks the submit. **Why:** field shorthand typed on a phone
is not a client deliverable, and polishing at submit means the reviewer opens an already-readable
submission. **Trade-off — the significant one:** there is nothing to revert to if a polish distorts
meaning, and the report is no longer a quotation of what was observed. The reviewer's correction on the
review screen becomes the only safety net. UX-004's other half — the submission is shown as captured and
never edited in place — still holds. Full reasoning in **ADR-0004**; recorded as R11 in `EXECUTION.md`.
