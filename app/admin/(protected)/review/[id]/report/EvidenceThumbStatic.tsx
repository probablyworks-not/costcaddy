import type { EvidencePhoto } from './ComplianceSection';

// Non-interactive counterpart to EvidenceLightbox's EvidenceThumb, for renderReportPdf.tsx's
// Playwright pass: that path renders ReportBody via react-dom/server's renderToStaticMarkup
// directly, outside Next's RSC pipeline, which cannot invoke a 'use client' component
// (EvidenceThumb) as a plain function. The click-to-zoom modal is inert once rasterized to
// print anyway, but the thumbnail itself is wrapped in a real <a href> — Chromium's
// print-to-PDF (renderReportPdf.tsx) preserves that as a clickable link annotation, and the
// signed URL is long-lived (ADR-0009) so it still resolves whenever the PDF is later opened.
export function EvidenceThumbStatic({ photo }: { photo: EvidencePhoto }) {
  const boxStyle = {
    width: 28,
    height: 28,
    padding: 0,
    border: '1px solid var(--r-border)',
    borderRadius: 4,
    overflow: 'hidden',
    background: 'var(--r-surface-alt-2)',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as const;

  const content = photo.isImage && photo.url ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={photo.url} alt={photo.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
  ) : (
    <span style={{ fontSize: 8, color: 'var(--r-muted)' }}>FILE</span>
  );

  if (!photo.url) {
    return (
      <div title={photo.name} style={boxStyle}>
        {content}
      </div>
    );
  }

  return (
    <a href={photo.url} target="_blank" rel="noreferrer" title={photo.name} style={boxStyle}>
      {content}
    </a>
  );
}
