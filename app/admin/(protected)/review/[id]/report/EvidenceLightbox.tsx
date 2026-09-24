'use client';

import { useState } from 'react';
import type { EvidencePhoto } from './ComplianceSection';

// Same thumbnail-button + full-size modal pattern as the Review screen's
// PhotoLightbox, restyled with the report's own --r-* tokens. The thumbnail is a real
// <img>, not a placeholder — renderReportPdf.tsx's Playwright pass rasterizes it into
// the PDF as pixels, so it reads correctly there too even though the click handler
// (and the modal it opens) is inert once rendered to static markup for print.
export function EvidenceThumb({ photo }: { photo: EvidencePhoto }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title={photo.name}
        style={{
          width: 28,
          height: 28,
          padding: 0,
          border: '1px solid var(--r-border)',
          borderRadius: 4,
          overflow: 'hidden',
          background: 'var(--r-surface-alt-2)',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        {photo.isImage && photo.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo.url} alt={photo.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <span style={{ fontSize: 8, color: 'var(--r-muted)' }}>FILE</span>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            zIndex: 1000,
          }}
        >
          {photo.isImage && photo.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo.url} alt={photo.name} style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: 8 }} />
          ) : (
            <a
              href={photo.url}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{ color: '#fff', fontSize: 14, textDecoration: 'underline', fontFamily: 'var(--font-report-mono)' }}
            >
              Open {photo.name}
            </a>
          )}
        </div>
      )}
    </>
  );
}
