# ADR-0001 — TypeScript end-to-end on Next.js + Supabase Postgres

Status: accepted · Date: 2026-09-11

## Context
The product is two interfaces (Auditor Portal, Client Portal) over one RBAC-governed relational database
holding versioned financial data. The design files already carry the state machine and financial calc in
JavaScript. The build is agent-heavy and solo-maintained, and must be cheap to run and simple to hand
over to the client eventually. The core language question is the backend — the frontend is TypeScript
regardless.

## Options considered
- **TS end-to-end on Next.js (App Router), Postgres on Supabase, Drizzle ORM.** One deployable; server
  handles persisted drafts, report render and PDF.
- **TS frontend + Python backend (FastAPI + pandas).** Python's edge is data wrangling for the Stage B
  analytics.
- **Firebase / Firestore.** Managed, but non-relational.
- **AWS/GCP self-managed Postgres.** More control, higher floor and billing complexity.

## Decision
TypeScript end-to-end: **Next.js App Router + TS**, **PostgreSQL on Supabase**, **Drizzle** for
type-safe migrations, **own-auth** (argon2 + signed-cookie sessions, not Supabase Auth), **Supabase
Storage**, **Playwright** for PDF, **exceljs** for XLSX, hosted on **Cloudflare/Vercel**. Postgres is
non-negotiable for relational, versioned, financial data.

## Consequences
- **Accepted trade-offs:** we forgo Python's data-wrangling strength up front. Mitigated by an escape
  hatch (ADR to follow / D11): the isolated Stage B Excel-ingestion worker — and *only* that — may be
  reimplemented in Python/pandas if real client files prove gnarly, judged against real samples.
- Shared types across the wire (no Pydantic-vs-TS drift on deep, versioned shapes); a near-mechanical
  port of the design files' JS rather than a re-verified Python translation; one runtime for reliable
  agent development; one deployable to run and hand over.
- Standard Postgres keeps migration off Supabase open if scale demands it. Infra ~$0 dev / ~$25/mo prod.
- Firebase was rejected because it would mean abandoning Postgres for Firestore.
