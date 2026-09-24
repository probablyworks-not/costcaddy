# 0009 — Evidence photo links in the published PDF use long-lived signed URLs

Status: accepted · Date: 2026-09-22

## Context
The published report PDF's Evidence column shows real photo thumbnails, but they weren't
clickable (BUG-026). The proximate cause was that the thumbnail had no `<a href>` wrapping it —
but the deeper cause is that `lib/report/reportViewModel.ts` generates each thumbnail's URL via
`createSignedUrl()` with the storage layer's default 1-hour TTL (`lib/storage/index.ts`), baked
into the PDF at publish time. A published PDF is a durable artifact meant to be opened days, weeks,
or years later — so even a correctly-wired clickable link would 404 shortly after publish. The
storage bucket (`audit-files`) is private by design; every read goes through a signed URL.

## Options considered
1. **Report-token redirect route.** PDF links point at a permanent app URL
   (`/r/[reportToken]/evidence/[fileId]`), which validates the report token and redirects to a
   freshly-generated 1-hour signed URL at click time. Bucket stays private, links never go stale,
   and access is revocable by invalidating the report token. Requires a new authenticated route
   and threading the report token through `reportViewModel`/`renderReportPdf` — more build cost.
2. **Long-lived signed URLs.** Generate the evidence photo's signed URL with a multi-year expiry
   at publish time, and wrap the thumbnail in a real `<a href>` so Chromium's print-to-PDF
   (`renderReportPdf.tsx`) preserves it as a clickable link annotation. Minimal code change, no new
   infrastructure. The signed URL is a bearer credential embedded in the PDF for its whole expiry
   window — not revocable short of deleting the file.
3. **Public bucket / public URLs.** Make evidence photos public and embed plain URLs. Simplest
   technically, but reverses the existing "never public" storage invariant (`lib/storage/index.ts`,
   `db/schema/audits.ts`) for audit/compliance photos that can be sensitive, with no offsetting
   cost or engineering benefit over the other two options.

All three options cost effectively $0/month to run at this product's scale — Supabase Storage
egress/API pricing doesn't change meaningfully across them. Cost was not the deciding factor.

## Decision
Go with **option 2, long-lived signed URLs**, scoped to report evidence photos only. A new
`REPORT_EVIDENCE_URL_TTL_SECONDS` constant (10 years) in `lib/storage/index.ts` is used by
`reportViewModel.ts` in place of the general 1-hour default; `EvidenceThumbStatic.tsx` wraps the
PDF-path thumbnail in `<a href>`. The general 1-hour default is untouched everywhere else (e.g. the
pre-publish review screen, `review/[id]/page.tsx`).

Scope: **new publishes only.** Already-published PDFs keep their original (now-expired) signed
URLs and are not retroactively re-signed or republished by this change.

## Consequences
- Evidence thumbnails in every PDF published from now on are real, clickable links that keep
  working for the life of the report.
- Each embedded URL is a long-lived bearer credential: anyone holding the PDF, or a forwarded
  link, can view that one photo for up to 10 years, with no revocation mechanism short of deleting
  the underlying file (which would also break the thumbnail everywhere else it's used).
- If a future need for revocable/authenticated evidence access arises (e.g. a real Client Portal,
  per ADR-0005), the report-token redirect route (option 1) is the documented fallback design.
- Bucket stays private; no change to the "never public" invariant elsewhere.
