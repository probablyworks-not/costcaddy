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

**Report §2 Risk Severity chip** (added during C4 — `Audit report v4.dc.html`'s own `sevColor()`, a
distinct palette from the status table above):
| Severity | Fg | Bg |
|---|---|---|
| High | `#c2410c` | `#fff7ed` |
| Medium | `#a16207` | `#fefce8` |
| Low / Passed | `#666666` | `#f5f5f5` |

**Report §1 composition donuts** (added during C4 — `Audit report v4.dc.html`'s own chart palette):
sales composition teals `#0d3b34` · `#1f6f62` · `#4a9c8c` (the same hexes as `--status-pass-bg-deep` /
`-fg` / `-dot`, reused rather than duplicated) · `#8fc5b8` · `#cfe3dd`; cost composition rust tones
`#7a2e14` · `#b8541f` · `#d98b4a` · `#f0c9a0`.

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

**Auditor shell breakpoint (B1):** one component tree, CSS-media-query driven (not a JS device flag) at
`640px`. Below it (mobile, primary): outer pad `28px 16px`, card max-width `390px`, radius `20px`, min-height
`700px`, header stacks column/stretch. At/above it (laptop, the widened variant): outer pad `36px`, max-width
`760px`, radius `10px`, min-height `600px`, header row/center. Values copied verbatim from both
`Auditor Flow - Mobile.dc.html` / `- Laptop.dc.html`'s `isMobile` ternaries.

## Core components
- **Sticky header** — white, `1px solid #e6e6e6` bottom, `sticky; z-index:20`; Newsreader wordmark left, role badge right.
- **Role badge** — pill, `#f0f4f9` bg / `#b9c8dd` border / `#1e3a5f` text, 11/700 uppercase `.08em`.
- **Primary button** — `#1e3a5f`, white text, no border, radius 6, padding 13, 14/600. Secondary = text-only `#888`. Submit disabled until nothing missing.
- **Text input** — `padding 11px 12px`, `1px solid #ddd`, radius 6, 14px; focus border `#111`; numeric inputs `width:150px; text-align:right`; label above at 12/`#888`.
- **Calculated field** — same box, `1px dashed #d9dee4`, `bg #f6f8fa`, weight 700, right-aligned. Never editable.
- **Metric section (B2)** — header band `#eef2f9` bg / `#dbe4f0` border, radius 6, title 11/700 uppercase
  `.08em` navy, note 11/`--hint-2` (`#6b7a90`); each row: label flex-1 (wraps, `min-width:0`), a
  flex-shrink:0 value block right-aligned — a 100px input or calculated-field display, with its sub
  figure (APC / cost %, or nothing) stacked directly beneath at 11px `--hint`. Adapted from `Super Admin
  Flow.dc.html`'s MTD Metrics tab (originally a 134px value + a separate 94px sub column — that fixed
  three-column shape overflowed the auditor shell's ~340px mobile card width; BUG-016) — same section
  layout still drives both the auditor's capture (B2) and the reviewer's as-captured view (C1).
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

### UX-005 — Report delivered as a version-stamped PDF, admin-delivered (no Client Portal for now)
**Decision:** the published report is a self-contained, prominently version-stamped PDF
(`v1 · 21 Jul 2026`), delivered directly by the admin; corrections publish as a new version. **Why:** a
downloaded file can't be recalled, so visible version clarity replaces a revocable-link model.
**Trade-off:** old PDFs remain in the wild — version stamping, not revocation, is what prevents confusion.
**Scope cut (R12, EXECUTION.md):** the design also draws XLSX export and a white-labelled, token-accessed
Client Portal for outlet reading; both are out of current scope. PDF is the only export format and there
is no outlet-facing portal or report token for now — revisit if the Client Portal comes back into scope.

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

### UX-011 — Departments collapse and expand (B3)
**Decision:** each department in the checklist is its own collapsible section, one card open by default
(the first, in template order), a click on its header toggling the rest. **Why:** the product spec's
story A-5 requires this ("departments collapse and expand, each header shows how many points are
marked") even though `Auditor Flow - Mobile.dc.html` never wires a department-level toggle — only its
individual checklist points expand (`activeItemId`). Per the stated precedence rule the spec wins on
behaviour where the design is silent; the department header's existing visual container (icon badge +
name + progress string) needed no layout change to carry the added `onClick`. **Trade-off:** none — the
design's markup for the header is unchanged, only its interactivity is additive.

### UX-012 — Operational files attach per-audit, not to a firm-wide inbox (C1)
**Decision:** the review screen carries its own "Operational Files" panel — attach/replace scoped to the
audit under review — rather than the design's `sReports` screen, which is a single firm-wide upload list
matched to a restaurant/period only by free text. **Why:** EXECUTION.md's C1 done-when explicitly ties
attach/replace to the review flow, and C2's financial engine needs `(auditSnapshot, operationalImports)`
for one specific audit — a global pool with no audit foreign key can't answer "which files feed this
report." **Trade-off:** the firm-wide browse/insights view `sReports` draws (parsed preview table,
cross-file insights) is not built; nothing in C1's done-when calls for it, and it can still be added later
as a read-only index over the same `audit_operational_files` rows.

### UX-013 — Reviewer corrections are an explicit action, not inline editing
**Decision:** each checklist point on the review screen shows the submission exactly as captured (UX-004);
a "Correct status or remark" link reveals a separate form (status buttons, N/A reason, remark) with its own
Save/Cancel, rather than making the as-captured fields directly editable. **Why:** UX-004/ARCHITECTURE §7
require the submission to be shown as captured and "never edited in place" — an always-editable field would
blur that line and risk an accidental one-character change reading as a silent correction. **Trade-off:**
one extra click before a correction lands; accepted because reviewer corrections should be a deliberate,
visible action, not a slip of an inline input.

### UX-014 — Report financial matrix has two revenue groups, not three (C2)
**Decision:** the revenue matrix (Section 1's Sales & Per-Customer Revenue Matrix) breaks sales into
**Kitchen** and **Bar** — matching F7's own `MetricDef.revGroup: 'bar'|'kitchen'` — rather than the report
mock's static **Food / Bar / Liquor** three-way split. **Why:** the mock's numbers are hand-typed example
content, not driven by any data model in its logic class (unlike the Super Admin file, this design file
carries no seed data or computed cascade at all — EXECUTION.md's own note that it specifies "the output
shape," not a schema). F7 — the canonical, already-built metric model (ADR-0003) — only distinguishes two
revenue buckets; inventing a third to match the mock's illustrative labels would mean either a schema
change unrelated to any captured data, or fabricating a Bar/Liquor split with no underlying metric to
split it from. **Trade-off:** the report's Bar row reads "Bar" where the mock shows separate Bar and
Liquor rows; a template that wants that distinction can still get it by tagging the relevant sales metrics
accordingly — F7 already sums by `revGroup`, so no further engine change would be needed.

### UX-015 — A finding's Ref ID is the item's own template code (C3)
**Decision:** every finding's `refId` is the checklist item's existing code from the template snapshot
(`KIT-03`, `SEC-01`, …), never a generated fallback sequence. **Why:** the mock's `decorateItems` falls
back to `'EQ-'+String(idx+1).padStart(2,'0')` only when `it.refId` and `it.code` are both missing — but
in the real schema every `audit_item` always carries a `code`, cloned from the template at assign (A5,
"template snapshot on assign"). The fallback branch in the mock exists for its own seed data quirks, not
for a case that can occur here. **Trade-off:** none — this is strictly simpler than porting a code path
that can never run.

### UX-016 — Report v4's build departures from the mock (C4)
**Decision, bundled:** (1) the composition donuts use what our data actually has — Sales Composition is
Kitchen/Bar net sales + service charge + statutory taxes (4 slices, following UX-014's two-group model)
and Cost Composition is Bar/Kitchen/Non-commercial cost (3 slices, F7's own cost groups) — not the mock's
illustrative Food/Liquor/Beverage breakdowns. (2) `showCharts` and `showSummaryRibbon` exist as real
flags gating their sections but both default `true` with no admin control to flip them — no story asks
to hide either, and CLAUDE.md's own convention is not to build settings nobody asked for; an admin-facing
toggle can be added when one does. `showEvidence` stays stubbed off per the design file itself. (3) All six template departments (SEC/KIT/STR/OPS/POS/OTH) render
as their own card, not just the four the mock happens to illustrate (Security, Kitchen, Purchase & Stores,
Operations) — POS Controls and Other Observations get `point_of_sale` / `fact_check` Material Symbols,
picked to match the existing icon language since the mock never reaches those two. (4) The mock's header
"Export Data" button (never wired to anything, no `onClick`) and `editMode`'s inline `contenteditable`
editing are both dropped — CLAUDE.md already rules out porting the mock's edit model, and a
Playwright-rendered PDF (C5) makes an unwired export button moot. **Why bundled:** none of these are
independent architectural choices — each is "use the real data model / only build what a story asks for,"
already the governing principle behind UX-014 and the C4 done-when itself.

### UX-017 — No "Share" action was built for the report (C5)
**Decision:** the review screen has a Publish button and nothing else — no "Share report" / copy-link
affordance alongside it. **Why:** R5 settled that publishing must be a separate action from sharing,
because the mock's `doPublish()` and `shareLink()` mutated identically; R12 then cut the Client Portal
entirely, so there is no outlet-facing surface, report token, or public URL for a share link to point at.
Building a "Share" button anyway would either silently reuse the internal `/admin/review/[id]/report`
admin route (misleading — that page requires a super-admin session, so "sharing" it would just fail for
anyone else) or fabricate a token system for a portal that doesn't exist. **Trade-off:** none currently —
R5's separation is satisfied vacuously (there's nothing to conflate publish with). Revisit this the
moment the Client Portal (deferred, `EXECUTION.md` "Not yet designed") comes back into scope: that's when
a real share link — and the reason to keep it separate from publish — starts to exist.

### UX-018 — Taxes-category metrics get an explicit Statutory tax / Service charge choice (BUG-020)
**Decision:** each row added under Template Builder's Taxes category shows a two-option radio (Statutory
tax / Service charge), defaulting to Statutory tax, instead of the whole category silently stamping every
row `kind:'tax'`. **Why:** `computeMetrics` (F7) only routes a `kind:'charge'` row into `totalCharges`;
with no way to set that from the builder, a Service Charge metric was always summed into `totalTaxes`
instead, so the report showed "Needs data" for Service Charge everywhere while inflating Total Taxes by
that amount (BUG-020). The design source itself has the same gap — even `Super Admin Flow.dc.html`'s
builder hardcodes `kind:'tax'` on every tax row; only its seed data hand-tags Service Charge — so this is
a deliberate departure from the mock's builder, not a port of it. **Trade-off:** one more control on an
already-dense category; kept to a plain radio pair rather than a general "kind" field since `tax`/`charge`
are the only two values the schema (and the calc engine) recognise for this section.
