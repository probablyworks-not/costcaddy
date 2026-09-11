# Tasks

Current working set only, in execution order. Each line carries its `docs/EXECUTION.md` package id — that
file holds the deliverable, design file, dependencies and "done when" clause. Done tasks get removed and
rolled into `docs/archive/` monthly or past ~40 lines. Not a PM tool — just what's active.

Legend: ☐ todo · ◐ in progress · ☑ done (clear on next rollup)

## Foundations
- ☑ Repo, strict TS, lint, CI; fill Run/build/test into CLAUDE.md · F1 (CI deferred — no
  remote yet; add with F6 deploy pipeline)
- ☑ Token layer + 12 primitives, App UI and Report kept separate · F2
- ☐ Drizzle schema + migration 1: org_id everywhere, brand→outlet, FK ids · F3
- ☐ Own-auth: users, sessions, argon2, RBAC, end all sessions · F4
- ☐ Supabase Storage bucket + signed URLs · F5
- ☐ Deploy pipeline · F6
- ☐ Shared calculation core `computeMetrics` + ₹ formatter, unit-tested vs seed · F7

## Super Admin
- ☐ Login + one-message error · A1
- ☐ Restaurants CRUD + detail with Audits/Reports tabs · A2
- ☐ Auditors CRUD — password shown once, access, suspend, remove-keeps-audits · A3
- ☐ Templates library + Template Builder, auto-renumbering reference codes · A4
- ☐ Audit create/assign, share token, template snapshot on assign · A5

## Auditor
- ☐ Responsive shell + login + pending list · B1
- ☐ Metrics step — calculated rows read-only, live totals from F7 · B2
- ☐ Checklist step — Pass/Fail/Observation/N-A, remarks, photos; N/A from spec · B3
- ☐ Explicit Save → server draft; assigned→in-progress; photos on capture · B4
- ☐ Submit gate naming what's missing → immutable · B5
- ☐ AI remark polish on submit, with a non-blocking failure path · B6

## Report & outlet portal
- ☐ Review queue + review as captured + operational file attach · C1
- ☐ Financial engine — pure (auditSnapshot, imports) → reportDraft · C2
- ☐ Findings generation from every Fail/Observation, reviewer-editable · C3
- ☐ Report v4 render — §1, §1B, §2; no §3; print-first · C4
- ☐ Publish: version stamp, PDF via Playwright, XLSX; split from share link · C5
- ☐ Outlet reader portal — token access, per-client branding · C6

F1, F2 done — F3 (schema and migration 1) is the next package. Completed docs work rolled to
`docs/archive/2026-09-tasks.md`.
