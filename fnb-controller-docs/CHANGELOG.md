# Changelog

Human-facing, reverse-chronological, grouped by date/phase. What shipped, not why (the why lives in ADRs
and DESIGN Part B). One dated line per shipped thing.

## Foundations — 2026

### 2026-09-11
- F1 done: repo initialised, Next.js (App Router) + strict TypeScript scaffolded at the project root,
  ESLint clean (design sources and docs excluded from lint), `CLAUDE.md` Run/build/test filled in with
  real `dev`/`build`/`start`/`lint` commands. CI deferred to F6 — no remote yet.
- Execution plan added: `docs/EXECUTION.md` sequences Stage A as work packages F1–F7, A1–A5, B1–B6,
  C1–C6, each with its design file, screen keys, dependencies and "done when" clause; `docs/TASKS.md`
  rewritten to mirror it.
- Eleven design-vs-docs conflicts reconciled (R1–R11) — ADR-0003 (the Super Admin metric model is
  canonical), ADR-0004 (AI polishes remarks on submit, replacing the raw text), and DESIGN Part B
  UX-006…UX-010. ADR-0004 reverses the "remarks are quoted, not rewritten" invariant; `CLAUDE.md` and
  `ARCHITECTURE.md` updated to match.
- Documentation framework initialised: `CLAUDE.md`, `docs/` (PRODUCT, ROADMAP, ARCHITECTURE, DESIGN,
  TASKS, BUGS, decisions + ADR-0001/0002), `CHANGELOG.md`, `docs/archive/`.
