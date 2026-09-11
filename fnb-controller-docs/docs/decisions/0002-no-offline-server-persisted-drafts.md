# ADR-0002 — No offline; server-persisted drafts with explicit Save

Status: accepted · Date: 2026-09-11

## Context
Auditors capture in outlets, sometimes in kitchens/basements. The spec's intent is that a session stays
signed in and nothing typed is lost ("a phone restart or a dead zone never signs them out mid-audit").
The original design raised offline capture as an open question; a full local-first/offline-sync
subsystem is costly and changes the submit model.

## Options considered
- **Full offline / local-first** (IndexedDB + outbox + conflict resolution). Robust to no connectivity;
  large surface area; complicates the one-way submit invariant.
- **Device autosave** (write drafts to the device). Cheap, but a draft is trapped on one device — no
  mobile→laptop handoff, and device loss loses the draft.
- **Server-persisted drafts + explicit Save, online-only.** Server is the single source of truth.

## Decision
No offline engine. **Drafts persist server-side** via an **explicit Save** button (not autosave).
Sessions are signed-cookie and survive restarts/dead zones; the admin can end all sessions. Photos upload
one-by-one on capture (compressed, EXIF-normalised client-side) so Save writes only small structured data.
A `localStorage` cache of the active form + a navigate-away warning is added in Phase 4 as a
belt-and-braces guard against accidental tab-close — explicitly *not* an offline sync layer.

## Consequences
- **Accepted trade-off:** this rests on one assumption — auditors have connectivity while working — which
  **must be confirmed with the client**. If offline is genuinely required, the submit model changes and
  this ADR would be superseded.
- Mobile→laptop handoff falls out for free: the same in-progress audit reopens on any device. A photo
  taken on mobile is already visible on the laptop. Save stays fast.
- Supersedes the design's open "offline capture" question for this build. Relates to UX-002.
