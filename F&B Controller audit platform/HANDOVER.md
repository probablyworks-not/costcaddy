# F&B Controller — Design Handover

For the engineer or coding agent building this. Read in the order below; do not start from screenshots — every design file is real HTML you can open, click through and read the source of.

**Rule of precedence:** where a design file and `Product Spec` disagree — the **design wins on layout and visuals**, the **spec wins on behaviour**.

---

## 0. Read in this order

| # | File | What it is | Why first |
|---|---|---|---|
| 1 | `Product Spec - Flow, Screens & Stories.dc.html` | The written spec: roles, the full journey, four flow diagrams, screen inventory, user stories | Gives you the model of the product. Read end to end before opening any UI. |
| 2 | `DESIGN-SYSTEM.md` | Extracted tokens, type, components, print rules | Build this as your theme/primitives layer before any screen. |
| 3 | `Super Admin Flow.dc.html` | The largest surface: ~46 screen states across Restaurants, Auditors, Templates, Template Builder, Review Queue, Review, Reports | The admin owns setup and publishing; most of the data model is visible here. |
| 4 | `Auditor Flow - Laptop.dc.html` | Auditor app, desktop breakpoint | The capture experience. Same state machine as mobile. |
| 5 | `Auditor Flow - Mobile.dc.html` | Auditor app, phone breakpoint | **Primary auditor target** — auditors work on a phone in the outlet. Treat laptop as the widened variant of this, not the reverse. |
| 6 | `Audit report v4.dc.html` | The published deliverable, print-ready | Different type system (see design system §1). Build last; it consumes everything captured upstream. |

Supporting files in the project, copy as-is if useful: `doc-page.js` (paged/print shell used by the spec + report), `image-slot.js` (photo placeholder), `support.js` (design-file runtime — **not** production code; do not ship it).

**How to read a design file:** open it in a browser and click through it — every screen is reachable. Then read the source: markup is inline-styled (copy values directly), and the logic class at the bottom of the file holds the seed data, the state machine and the calculations. The seed data is the closest thing to a schema you have — mine it.

---

## 1. Build order (recommended)

1. **Tokens + primitives** — colors, type, button, input, pill, list row, grouped panel, progress bar (design system §2–4).
2. **Auth + roles** — super admin login, auditor login. Three roles: `super_admin`, `auditor`, `outlet` (reader, no login in this build).
3. **Admin setup** — Restaurants CRUD → Auditors CRUD (admin sets passwords directly, can reveal/change them) → Templates + Template Builder.
4. **Audit creation** — from a restaurant: New audit → pick template + auditor → audit appears in that auditor's app.
5. **Auditor capture** (the core) — pending list → audit → Step 1 metrics → Step 2 checklist → submit.
6. **Review queue + report generation** — admin reads the submission as captured, attaches operational reports, generates findings, edits, publishes.
7. **Report v4** — rendering, sharing by link, print/export, re-publish as a new version.

Ship 1–5 as the first milestone; the report is only meaningful once real captures exist.

---

## 2. Screen map

Each design file's logic class switches on a screen key. Route names below match those keys — reuse them.

### Super Admin (`Super Admin Flow.dc.html`)
| Key | Screen | Notes |
|---|---|---|
| `login` | Sign in | Includes credentials step + error state |
| `restaurants` | Restaurant list | Plus inline "new restaurant" panel |
| `restaurantDetail` | Restaurant detail | Tabs: **Audits** (active / empty) and **Reports** (has / empty). "New audit" opens inline |
| `auditors` | Auditor list | Add-auditor panel with validation error + success flash; password reveal in the row |
| `templates` | Template list | |
| `builder` | Template Builder | Metric categories + metrics, departments + checklist points. Supports `csv` / `paste` import modes |
| `reviewQueue` | Review queue | Has-items and empty states |
| `review` | Review a submission | `reportNotReady` → `reportReady` → generate → edit findings → publish. Export flash state |
| `reports` | Published reports | List + detail (`detail`), `reportDoc` renders the report inline |
| `deferred` | Deferred items | |

### Auditor (`Auditor Flow - Mobile.dc.html` / `- Laptop.dc.html`)
| Key | Screen | Notes |
|---|---|---|
| `login` | Auditor sign in | |
| `pending` | Pending audits | Rows show restaurant, due date, item progress, status pill, `OVERDUE` marker. Plus "Recently Submitted" section |
| `checklist` | The audit | Two tabs: `metrics` and `checklist` (mobile) / stacked steps 1 and 2 (laptop). Sticky progress in the header |
| `report` | Post-submit read-only view | Audit becomes immutable |

The mobile and laptop files are the **same product at two breakpoints** — same keys, same data, same rules. Build one component tree with responsive layout; the two files exist so you can see both intended layouts. Differences are layout only: mobile uses tabs and a bottom-anchored submit; laptop stacks both steps with a right-aligned progress block.

---

## 3. Data model (inferred from the seed data — verify with the client)

```
Restaurant   { id, name, ... , status: 'active' | 'suspended' }
Auditor      { id, name, email, phone, outlets[], password }
Template     { id, name, metricCategories[], departments[] }
  MetricCategory { name, metrics[] }
  Metric      { label, unit, kind: 'input' | 'calculated', formula? }
  Department  { name, prefix, items[] }        // prefix e.g. 'KIT', 'OTH'
  ChecklistPoint { id, label }
Audit        { id, restaurant, auditor, templateId, dueDate,
               status: 'assigned' | 'in-progress' | 'submitted' | 'published' | 'deferred',
               submittedAt?, publishedAt?, version?, metrics{}, items[] }
AuditItem    { pointId, status: 'pass' | 'fail' | 'observation' | 'na',
               remark, photos: n,
               severity?: 'High' | 'Medium' | 'Low',   // fail / observation only
               impact?, correctiveAction? }
Report       { auditId, version, findings[], attachments[], publishedAt }
```

Metric categories seen in the seed data: `sales`, `tax`/`taxes`, `cost`/`costing`, `discount`/`discounts`, `volume`, plus row types `bar`, `charge`, `kitchen`, `nc`, `net`, `covers`.

---

## 4. Behaviour rules — non-negotiable

**Metrics (Step 1)**
- Rows are either **editable inputs** or **calculated**. Calculated rows are never editable and render in the dashed read-only style. Totals recompute live as figures are typed.
- Read the calculation logic out of the auditor file's logic class rather than re-deriving it.

**Checklist (Step 2)**
- Every point must be marked `pass` / `fail` / `observation` / `na`.
- A **remark is required on every point**; photos are optional but expected on fails.
- `fail` and `observation` additionally require **severity, impact and corrective action** — these three fields are what flow into the report's findings. Do not make them optional.
- Progress counters run per department and for the whole audit.

**Submit**
- Disabled until nothing is missing. Validation must name what's missing, not just refuse.
- Submitting asks for confirmation, then makes the audit **read-only for the auditor, permanently**. There is no unsubmit — corrections happen admin-side.
- Submitted audits land in the admin's review queue.

**Review & publish**
- The admin sees the submission **exactly as captured** — never editable in place.
- Attach operational reports → **Generate report** → review and edit findings → **Publish**.
- Published reports are **versioned**. A correction is a new version (`v1`, `v2`, …), never an in-place edit.
- Reports are shared as a link. In this build the outlet has **no login** — the link is the access mechanism, so treat it as unguessable and revocable.

**Scheduling**
- Deliberately out of scope. Due dates are recorded; chasing and scheduling happen offline. Don't build reminders.

**Auditor accounts**
- The admin sets the password directly and can reveal or change it from the auditor row. No self-service signup, no email invite flow in this build.

---

## 5. Report v4 specifics

- Own type system: `Inter Tight` for text, `IBM Plex Mono` with `tabular-nums` for **every** number, `Material Symbols Outlined` for icons. Do not substitute Inter.
- Built on `doc-page.js` at letter size, `0.6in` margin, and is **print-first**: `data-avoid` on every card/table/diagram, `data-noprint` on all chrome, `data-break` for forced page breaks.
- Two content toggles exist as props and should ship as options: `showCharts` and `showSummaryRibbon` (both default true).
- Severity counts drive the summary ribbon (`High` in `#9f1d17`, `Medium` in `#8a6a09`). Compliant/pass reads green `#1f6f62`.
- Currency is Indian short-scale (`₹4.80L`). Keep the formatter centralised.

---

## 6. What is *not* in the designs

Decide these with the client before building — they are genuine gaps, not omissions to guess at:

- Offline capture. Auditors work in kitchens and basements; the designs assume connectivity. If offline is needed it changes the submit model.
- Photo upload limits, compression and storage.
- Outlet authentication and link expiry.
- Notifications of any kind.
- Audit trail / who-changed-what on findings.
- Multi-tenant boundaries if the firm serves several restaurant groups.
- Localisation and multi-currency.

---

## 7. Do not ship

`support.js` is the design-file runtime and the `<sc-if>` / `<sc-for>` / `{{ }}` markup is authoring syntax for these design files only. Read them for intent, then rebuild in your real framework. The inline styles, however, are exact — copy the values.
