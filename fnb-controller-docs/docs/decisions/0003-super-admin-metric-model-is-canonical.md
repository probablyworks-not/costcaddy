# ADR-0003 — The Super Admin metric model is canonical

Status: accepted · Date: 2026-09-11

## Context
The design files carry **two different, incompatible metric models**, and until now nothing said which one
to build.

`Auditor Flow - Mobile.dc.html` / `- Laptop.dc.html` use `DEFAULT_METRIC_CATS`: category objects holding
`rows: [[id, label, unit]]`, with a single naive `total: Σrows` per category. There is no notion of a
revenue bucket, no distinction between a tax and a service charge, and no cost denominator — so it cannot
express gross sale, per-cover figures, or cost as a percentage of anything.

`Super Admin Flow.dc.html` uses a flat `DEFAULT_METRICS` list (17 seeded metrics) where each metric carries
`section` (`covers` | `sales` | `discount` | `tax` | `cost`) plus, as applicable, `revGroup`
(`bar` | `kitchen`), `kind` (`tax` | `charge`), `group` (`bar` | `kitchen` | `nc`) and `den`
(`net` | `bar` | `kitchen` | a metric id). Its `computeMetrics` / `metricSections` pair (~lines 1908–1986)
derives the full cascade the report actually needs.

The same split shows up in the checklist seeds: the auditor files seed a flat 8+6 item set with four
ad-hoc departments, while the Super Admin file seeds the 6-department, 38-point `DEPTS` structure with the
SEC / KIT / STR / OPS / POS / OTH prefixes and auto-generated reference codes.

Building the auditor files' model would mean discovering at report time (C4) that the numbers the report
needs cannot be derived from the shape the auditor captured — the most expensive possible moment.

## Options considered
- **Build the auditor files' model.** Simpler, and it is the file the auditor screens are actually built
  from. But it cannot produce §1B of the report at all, and the Template Builder (A4) has nothing to
  configure — no metric types, no calculated rows, no denominators.
- **Build both and translate at the boundary.** Preserves each file as drawn. Adds a mapping layer with no
  design reference, two sources of arithmetic truth, and a guaranteed drift surface.
- **Build the Super Admin model everywhere.** One model, one calculation engine, the auditor screens
  rendered from the richer definitions.

## Decision
**The Super Admin model is canonical.** `DEFAULT_METRICS` with `section`/`revGroup`/`kind`/`group`/`den`
is the metric shape; the 6-department `DEPTS` set is the checklist shape. **The auditor design files'
metric and checklist code is stale — do not port it.**

The derived cascade is extracted once as a pure, tested module (**F7**) and consumed by both the auditor's
live totals (B2) and the report's financial sections (C2). No other module computes a total.

This does **not** loosen the "build every screen from its `.dc.html`" convention. The auditor files remain
authoritative for **layout, inline style values, interaction and state** — which is what they were drawn
for. Only their metric and checklist *data* is superseded.

## Consequences
- The auditor's metrics step (B2) renders from richer definitions than the auditor file draws. Where a
  field has no visual precedent in that file, take the treatment from the Super Admin file's equivalent row
  rather than inventing one.
- One arithmetic implementation, unit-tested against the Super Admin file's seed figures. F7 becomes a
  hard dependency of both B2 and C2, which is why it sits in Foundations rather than in Phase 2.
- Audits already store a frozen `metricDefs` copy at creation (the template snapshot invariant), so the
  canonical shape is what gets frozen — later template edits still never touch a running audit.
- Recorded as reconciliations **R1** and **R2** in `docs/EXECUTION.md`. Relates to ARCHITECTURE §5 and §7.
