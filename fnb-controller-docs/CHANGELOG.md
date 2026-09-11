# Changelog

Human-facing, reverse-chronological, grouped by date/phase. What shipped, not why (the why lives in ADRs
and DESIGN Part B). One dated line per shipped thing.

## Foundations — 2026

### 2026-09-11
- F4 done: own-auth in `lib/auth/` — argon2 password hashing (`password.ts`, admin-generated
  passwords, shown once, never stored plaintext); signed-cookie sessions (`session.ts`,
  `cookies.ts`) backed by the `sessions` table, cookie value is a random session id plus an
  HMAC-SHA256 signature (`AUTH_SECRET`) so a tampered cookie is rejected before any DB lookup;
  `getCurrentUser`/`requireRole` (`rbac.ts`) resolve the signed-in user from the session, never a
  hardcoded name; `createAuditor`/`resetPassword`/`forceSignOut`/`setAuditorStatus`
  (`accounts.ts`) back A3 — duplicate email refused, reset and force-sign-out are separate
  actions, suspend ends all sessions immediately. Verified: argon2 hash/verify round-trip,
  cookie sign/verify round-trip, tamper and malformed-cookie rejection, all against real crypto
  (no DB needed for these). No screens yet — A1/B1 build the login UI against this.
- F3 done: Drizzle schema + migration 1 (`db/schema/`, `db/migrations/0000_migration_1.sql`) — 16
  tables, `org_id` on every one but `orgs` itself; `brands` → `outlets` hierarchy; `audits` references
  `outlet_id`/`auditor_id`/`template_id` by FK uuid, replacing the design's name strings (R6);
  `audit_metric_defs`/`audit_items` are the frozen per-audit copy taken at assign (template snapshot
  invariant), kept separate from the editable `template_metrics`/`template_checklist_points` they were
  cloned from; `audit_metric_values` holds only raw entered figures — calculated totals stay
  unstored, computed live by F7. `postgres`/`drizzle-orm`/`drizzle-kit` added; `db:generate`/
  `db:migrate`/`db:push`/`db:studio` npm scripts.
- F2 done: `styles/tokens.css` ports DESIGN.md Part A to CSS custom properties (App UI unprefixed,
  Report `--r-`/`--font-report-*`, kept as two separate type systems); real fonts wired in
  `app/layout.tsx` (Inter + Newsreader via `next/font`, Inter Tight + IBM Plex Mono for the report
  surface, Material Symbols Outlined via stylesheet link); the 12 core components built in
  `components/ui/` and `components/report/` (sticky header, role badge, primary/secondary button,
  text input, calculated field, grouped panel, department chip, list row, progress bar, overdue
  marker, report table + KPI strip, App UI icon + report MaterialIcon). Two tokens genuinely new to
  Part A added and documented: `--surface-calculated` (`#f6f8fa`) and `--hint` (`#8a93a0`), plus
  `--navy-chip` (`#eef2f9`, distinct from `--navy-025`). Verified with a screenshot of all 12
  primitives rendered against real tokens — zero console errors.
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
