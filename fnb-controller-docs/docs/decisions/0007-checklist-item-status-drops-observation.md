# ADR-0007 — Checklist item status is Pass/Fail/N-A only; "Observation" removed

Status: accepted · Date: 2026-09-22

## Context
Since F3/B3, `audit_items.status` has been a four-way enum — `pending | pass | fail | observation | na` —
carried through the DB (`db/schema/_enums.ts`), both capture UIs (the auditor's checklist buttons and the
admin review screen's correction editor), the findings pipeline (`generateReport`/`updateFinding` treated
Fail and Observation identically: both required a remark, both became a finding with severity/impact/
corrective action, both counted against the compliance percentage), and the report (`ComplianceSection`'s
`isFinding` check). This traced back to the Super Admin design file's own four-way button and was recorded
as `DESIGN.md` Part B **UX-007** (compliance denominator) and **UX-009** (remark requirement).

In practice `observation` never carried distinct behavior from `fail` anywhere in the pipeline — same
remark requirement, same finding treatment, same compliance-denominator membership. The user asked to
remove it: the auditor only needs Pass, Fail, or N/A.

## Decision
**`observation` is removed as a checklist-item status.** The auditor and admin four-way exclusive-choice
buttons are now three-way (Pass/Fail/N-A). `item_status` drops the enum value (migration `0005_sudden_
cargill.sql`); every `lib/actions/review.ts` check that read `status === 'fail' || status === 'observation'`
now reads `status === 'fail'` alone. Compliance is `pass / (pass + fail)` (`DESIGN.md` **UX-024**,
superseding UX-007's three-term denominator).

**Existing data:** 5 `audit_items` rows already captured as `observation` were folded into `fail` as part
of the migration, rather than dropped or left stranded — an observation already required a remark and
already became a finding exactly like fail, so no information was lost in the merge.

**Token cleanup:** `--status-observation-fg` is renamed `--status-warn-fg`. Its only remaining call sites
(`OperationalFilesPanel`'s parse-status indicator, the auditor `pending` screen's "polish failed" notice)
never represented this checklist status — they borrowed its amber for an unrelated warning state — so the
old name was actively misleading once the status it named no longer existed.

## Consequences
- Simpler capture flow: one fewer choice per checkpoint, on a checklist auditors already fill out under
  time pressure (the original rationale for keeping non-pass remarks optional-but-encouraged, UX-009).
- No behavior actually changes for a point that would have been marked `observation` — it becomes `fail`,
  which already required the same remark and produced the same finding treatment. The only visible change
  is that the report's Risk Severity/finding treatment for that point is now labelled the same as any other
  fail, not distinguished as an "observation."
- `DESIGN.md` Part B UX-007/UX-009 are updated in place to reflect the new denominator/status set, with a
  pointer forward to UX-024 rather than being rewritten as if `observation` never existed — the historical
  reasoning for excluding N/A only (UX-007) and requiring a remark on non-pass points (UX-009) still holds.
