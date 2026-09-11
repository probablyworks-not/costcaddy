# ADR-0004 — AI polishes remarks on submit, replacing the raw text

Status: accepted · Date: 2026-09-11

## Context
Auditors type remarks on a phone, in an outlet, under time pressure. The resulting text is accurate but
rarely report-ready. The published PDF is a client deliverable, so someone has to turn field shorthand
into report prose.

Until now the rule was the opposite: *"Remarks are quoted, not rewritten — the auditor's words reach the
report unedited."* It was stated as an architecture-shaping invariant in `CLAUDE.md`, in
`ARCHITECTURE.md` §8, and as DESIGN Part B **UX-004**. The design mock does polish remarks, but admin-side
inside `generateReport()`, and it keeps the original in a `rawRemark` field so the reviewer can revert any
enhancement.

The product owner has decided the polish should happen **earlier** — at submit, so the reviewer opens an
already-readable submission — and that the polished text should simply **be** the remark, with no raw copy
retained.

## Options considered
- **Keep the invariant; AI drafts findings only.** The remark stays verbatim and the model writes only the
  surrounding narration, impact and corrective-action prose. Preserves the field record completely, but
  leaves the reviewer editing every remark by hand.
- **Polish on submit, keep `rawRemark` alongside.** What the mock does, moved earlier. Every enhancement
  stays revertible. Costs a second field and a revert affordance on the review screen.
- **Polish on submit, replacing the raw text.** Simplest data model and the shortest path to a readable
  submission. Nothing to revert to.

## Decision
**Polish runs on submit and the polished text replaces the raw remark.** Submitting queues an async job
that rewrites every non-pass remark into report prose; the stored remark becomes the polished version. The
verbatim field text is **not** retained.

The model rewrites prose only. It never touches, restates or invents a number — the "LLM never computes"
rule is untouched and every figure in the report still traces to a value computed by F7/C2.

Because submit now depends on a model call, the audit carries a polish state (`polishing` / `ready` /
`failed`) surfaced in the review queue, and **a failed or timed-out polish never blocks or reverses the
submit**. The audit submits regardless; unpolished remarks pass through verbatim and the job retries.
Submit remains one-way and immutable-for-the-auditor.

## Consequences
- **Accepted trade-off, stated plainly: there is nothing to revert to.** If a polish distorts meaning, the
  original wording is gone. Combined with the no-audit-trail decision, it is unrecoverable. This is the
  real cost of dropping `rawRemark` and it was accepted knowingly.
- The report is **no longer a quotation** of what was observed in the field. The separation the old
  invariant protected — auditor records fact, reviewer judges — is now partly mediated by a model. The
  reviewer's edit on the review screen (C1) becomes the only correction mechanism, which makes reading the
  submission carefully more important, not less.
- **Supersedes UX-004** on the remarks point (the "submission shown exactly as captured, never edited in
  place" half still holds). Recorded as DESIGN Part B **UX-010** and as reconciliation **R11** in
  `docs/EXECUTION.md`; implemented as package **B6**, the one package with no design reference.
- `CLAUDE.md` and `ARCHITECTURE.md` §7/§8 are updated so no doc still asserts the old rule.
- `PRODUCT.md` needs no change: its five core promises never claimed remarks were verbatim, so nothing
  there contradicts this decision (checked, not assumed).
- Submit is no longer a purely local operation. It needs a job runner, a retry path and a visible state —
  a small amount of infrastructure that Stage A did not otherwise require.
