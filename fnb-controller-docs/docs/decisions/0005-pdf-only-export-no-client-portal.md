# ADR-0005 — Publish ships PDF only; the Client Portal is cut from current scope

Status: accepted · Date: 2026-09-12

## Context
Both `Audit report v4.dc.html` and `Super Admin Flow.dc.html` draw more delivery surface than the product
currently needs: the report screen has an "Export Data" / "Download full report (XLSX)" control next to
Print/PDF, and Super Admin draws a restaurant/outlet reader tree — a white-labelled, read-only Client
Portal reached by an unguessable report token, with no outlet login. `docs/EXECUTION.md` had carried both
forward as in-scope packages (C5's XLSX half, and C6 in full), and `PRODUCT.md`/`ROADMAP.md`/
`ARCHITECTURE.md` described the Client Portal as one of the two delivered interfaces.

The product owner has decided that, for now, the only deliverable is the audit report as a PDF — the admin
generates it and delivers it directly. There is no outlet-facing portal, no report token, and no XLSX
export.

## Options considered
- **Keep both, as designed.** Matches the `.dc.html` files exactly, but builds an entire second
  authentication-free surface (token routing, per-client branding, an XLSX renderer) that nothing today
  requires the firm to use.
- **Keep the design as future scope, cut it from the current build.** Preserves the design work as a
  reference for later and keeps the current build to what is actually needed: PDF export of the report the
  admin already reviews and publishes.
- **Delete the design intent entirely.** Removes the option to revisit cleanly; rejected — the `.dc.html`
  files aren't being touched, and the docs still need to explain why they aren't fully built.

## Decision
**PDF via Playwright is the only export format, and there is no Client Portal for now.** Publish (C5)
stamps a version and renders the version-stamped PDF; the admin delivers it directly to the outlet. XLSX
export and the outlet reader portal (formerly package **C6**) are retired to `EXECUTION.md`'s "Not yet
designed" section — a design exists for both, but neither is in the current build.

## Consequences
- `EXECUTION.md`: C5 drops its XLSX clause; C6 is removed from the active package list and its content
  moved to "Not yet designed" with a pointer back here. Recorded as reconciliation **R12**.
- `docs/DESIGN.md` Part B **UX-005** updated: still a version-stamped PDF, admin-delivered instead of
  portal-surfaced; the XLSX/Client Portal half is marked as a scope cut rather than removed from the
  decision log.
- `PRODUCT.md`, `ROADMAP.md`, `ARCHITECTURE.md`, `TASKS.md` updated so no doc still describes the Client
  Portal or XLSX as shipping in the current build.
- **No outlet-facing auth surface is needed for now** — no report token, no account-free portal session to
  design or secure. Simplifies Phase 4's security review scope (drops report-token unguessability).
- **Reversible.** The design files are untouched; reviving the Client Portal or XLSX export later is a
  scope decision, not a design one — `C6` and the XLSX clause can be restored from this ADR and
  `EXECUTION.md` R12 without redesigning anything.
