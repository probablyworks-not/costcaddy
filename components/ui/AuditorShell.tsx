import type { ReactNode } from 'react';
import styles from './AuditorShell.module.css';

// UX-001: one component tree for mobile + laptop, CSS-media-driven (not a JS device
// flag) at the 640px breakpoint documented in DESIGN.md Part A.
export function AuditorShell({ children }: { children: ReactNode }) {
  return (
    <div className={styles.outer}>
      <div className={styles.card}>{children}</div>
    </div>
  );
}
