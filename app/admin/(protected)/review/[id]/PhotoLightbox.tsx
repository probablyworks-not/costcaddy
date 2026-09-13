'use client';

import { useState } from 'react';

// C1 — "photos open full size". A signed URL is resolved server-side at render time
// (F5) and handed in here; this only owns the open/close modal state.
export function PhotoLightbox({ name, meta, url, isImage }: { name: string; meta: string | null; url: string; isImage: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '5px 10px 5px 5px',
          border: '1px solid var(--border-strong)',
          borderRadius: 'var(--radius-card)',
          background: 'var(--surface)',
          cursor: 'pointer',
          font: 'inherit',
          textAlign: 'left',
        }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 5,
            background: 'linear-gradient(135deg,#eef2f7,#dde5ee)',
            flexShrink: 0,
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-2)', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {name}
          </div>
          {meta && <div style={{ fontSize: 10, color: 'var(--muted-2)' }}>{meta}</div>}
        </div>
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
          {isImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt={name} style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: 8 }} />
          ) : (
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{ color: '#fff', fontSize: 14, textDecoration: 'underline' }}
            >
              Open {name}
            </a>
          )}
        </div>
      )}
    </>
  );
}
