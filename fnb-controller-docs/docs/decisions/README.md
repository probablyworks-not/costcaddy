# Architecture Decision Records

One file per significant decision, numbered `NNNN-title.md`. Each ADR: **Context · Options considered ·
Decision · Consequences** (including trade-offs accepted). Add a row here when you file one.

The full consolidated decision register (D1–D14) lives in the **Architecture & Execution Plan** and is
summarised in `docs/ARCHITECTURE.md`. ADRs here capture the most load-bearing choices in standalone form
and are where *new* decisions get recorded going forward.

| ID | Decision | Status | Date |
|---|---|---|---|
| [0001](0001-typescript-end-to-end.md) | TypeScript end-to-end on Next.js + Supabase Postgres | accepted | 2026-09-11 |
| [0002](0002-no-offline-server-persisted-drafts.md) | No offline; server-persisted drafts with explicit Save | accepted | 2026-09-11 |
| [0003](0003-super-admin-metric-model-is-canonical.md) | The Super Admin metric model is canonical; the auditor files' is stale | accepted | 2026-09-11 |
| [0004](0004-ai-polishes-remarks-on-submit.md) | AI polishes remarks on submit, replacing the raw text | accepted | 2026-09-11 |

Statuses: proposed · accepted · superseded (note which ADR supersedes it).
