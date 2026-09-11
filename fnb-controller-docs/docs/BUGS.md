# Bugs

One entry per bug, sequential `BUG-XXX` (never reused). **Guard is mandatory once fixed** — no fix is
complete without a named test/check that locks it. If a bug regresses, append to its History and update
Status — never open a duplicate. Cross-reference the ADR when the root cause traces to a documented
decision. Use the exact shape below.

<!-- Entry template — copy for each new bug:

## BUG-XXX — <short title>
Status: <open|fixed|regressed once (see history)> · Area: <component/module>

Repro:      <steps to reproduce>
Root cause: <why it actually happened>
Fix:        <what was changed (commit ref if known)>
Guard:      <the test/check that now locks the fix — must stay green>
Related:    <other BUG-IDs, ADR-IDs, or files this connects to>

History:
- YYYY-MM-DD  opened
- YYYY-MM-DD  fixed <commit> + test added
-->

---

## BUG-000 — Example: calculated metric row accepted typed input (template)
Status: fixed · Area: auditor/metrics-step

Repro:      On the Metrics step, focus a row marked `calculated` and type a number; the typed value
            persisted and was submitted instead of the derived total.
Root cause: The row renderer keyed editability off the field being numeric, not off `metric.kind`, so
            calculated rows fell through to the editable input branch. Violated the "calculated is never
            typed" invariant.
Fix:        Render calculated rows through the read-only calculated-field component; totals recompute
            live from inputs only. (commit <ref>)
Guard:      Unit test — a `kind:'calculated'` row renders read-only and ignores keystrokes; e2e — typing
            in a calculated cell leaves the derived total unchanged through submit.
Related:    ADR-0002 (server-save), ARCHITECTURE §8 invariants, docs/DESIGN.md "Calculated field"

History:
- 2026-09-11  opened (placeholder example to calibrate the entry shape)
- 2026-09-11  fixed + guard added

<!-- Next real bug starts at BUG-001. -->
