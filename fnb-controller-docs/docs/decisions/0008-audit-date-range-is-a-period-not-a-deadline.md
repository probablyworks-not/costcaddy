# ADR-0008 — The audit date range is the recurring conduct window, not a due date

Status: accepted · Date: 2026-09-22

## Context
The admin "Create audit link" form has always had a two-date field labelled "Audit due date range"
(`dueStart`/`dueDate` on `audits`), ported directly from `Super Admin Flow.dc.html`'s own labelling and
its mock computation `overdue: a.dueDate < TODAY`. `lib/queries/audits.ts::isOverdue` implemented that
literally: once `dueDate` (the range's end) was in the past, the auditor's pending list showed a red
`● OVERDUE` marker (`components/ui/OverdueMarker.tsx`), same as B1's "done when" clause in
`docs/EXECUTION.md` required.

The user reported this is wrong. The date range an admin sets when creating an audit isn't a submission
deadline — it's the recurring audit-conduct window a restaurant contracts with an auditor for (e.g. a
weekly/monthly/daily cadence clause: "audit the week of 21–27 Jul"). Once that window passes, the audit
isn't late — it simply covers a period that's now in the past, same as any other completed period. Marking
it "OVERDUE" in the auditor portal is actively misleading.

This also reconciles a standing inconsistency already visible in the docs: ADR-0006 and `docs/BUGS.md`
UX-020 already treat `dueStart`/`dueDate` as "the period the audit covers" for report grouping — the
Reports tab and the new MTD-consolidated report (`lib/report/mtdViewModel.ts`) both key off this range as
a coverage period, not a deadline — while `isOverdue` treated the same field as a deadline at the same
time. `docs/ARCHITECTURE.md` even listed "reminders / overdue tracking" as explicitly **not built**,
contradicting the shipped `isOverdue`/`OverdueMarker` feature. Nothing reconciled the two readings until
now.

This matters beyond wording: the firm is about to ship Week 1/Week 2/Week 3/Week 4 reports plus an MTD
report that cumulatively sums whichever of a month's weekly audits have published so far (ADR-0006). That
model only works if each audit's date range is understood purely as "which period does this cover,"
consistently, everywhere — not as a deadline in one place and a period in another.

## Options considered
- **Keep `dueStart`/`dueDate` naming, just stop computing overdue from it.** Smallest change, but leaves
  the schema and every call site calling a period a "due date," which will keep inviting the same
  deadline-shaped bug (a future screen, sort, or report reintroducing "overdue" logic against a name that
  says "due").
- **Rename to `periodStart`/`periodEnd` everywhere (schema, actions, queries, UI) and drop the overdue
  concept entirely, since no separate real deadline exists on `audits` today.** Matches how ADR-0006/
  UX-020 already conceptually use the field. Requires a migration (`ALTER TABLE ... RENAME COLUMN`, data
  preserved) and touches every read/write site, but leaves no "due"-shaped name anywhere to relapse into.

User chose the rename, specifically because the upcoming Week 1–4 + MTD reporting work depends on this
field consistently meaning "period," not "deadline."

## Decision
**`audits.dueStart`/`audits.dueDate` are renamed to `audits.periodStart`/`audits.periodEnd`** (migration
`0006_amazing_frank_castle.sql`, a plain column rename — no data loss, `periodEnd` keeps its `NOT NULL`).
The admin form label changes from "Audit due date range" to "Audit date range." The auditor-portal "Due
{date}" labels become "Period {date}." **The `isOverdue` function and `OverdueMarker` component are
removed outright** — there is no longer any concept of a deadline on an audit, so nothing computes or
displays an overdue state. `lib/queries/reports.ts`'s existing `periodStart ?? periodEnd` fallback (used
by the Reports tab's month grouping and the MTD report) now reads the real column names it was already
conceptually aliasing.

## Consequences
- New migration `0006_amazing_frank_castle.sql`; `db/migrations/meta/0006_snapshot.json` captures the
  renamed columns. No new column, no data migration beyond the rename.
- `docs/EXECUTION.md` B1's "done when" clause (which required "● OVERDUE on anything past due") no longer
  matches shipped behaviour — updated to drop the overdue requirement.
- If the firm later wants real deadline tracking (a genuine "audit is late" signal, separate from the
  period it covers), that needs its own new field and its own ADR — it is not this rename, and not
  resurrected by reusing `periodEnd`.
- See `docs/BUGS.md` BUG-025 for the user-facing symptom this closes.
