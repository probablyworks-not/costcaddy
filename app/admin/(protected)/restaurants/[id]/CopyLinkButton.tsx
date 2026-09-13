'use client';

import { useState } from 'react';
import { auditUrl } from './auditUrl';

// A5/A2: "Copy link" -> "Copied ✓" for 1800ms, then reverts (verbatim UX from the design file).
export function CopyLinkButton({ token }: { token: string }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(auditUrl(token));
    } catch {
      // clipboard permission denied — the URL is still visible in the row to copy manually
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      style={{
        padding: '9px 14px',
        border: '1px solid var(--navy-700)',
        background: copied ? 'var(--navy-700)' : 'var(--surface)',
        color: copied ? 'var(--surface)' : 'var(--navy-700)',
        borderRadius: 'var(--radius-control)',
        fontSize: 12,
        fontWeight: 600,
        cursor: 'pointer',
      }}
    >
      {copied ? 'Copied ✓' : 'Copy link'}
    </button>
  );
}
