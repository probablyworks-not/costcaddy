import type { ReactNode } from "react";
import styles from "./GroupedPanel.module.css";

export function GroupedPanel({
  title,
  hint,
  progress,
  children,
}: {
  title: string;
  hint?: string;
  /** e.g. "4 of 12" */
  progress?: string;
  children: ReactNode;
}) {
  return (
    <section className={styles.panel}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.title}>{title}</div>
          {hint && <div className={styles.hint}>{hint}</div>}
        </div>
        {progress && <div className={styles.progress}>{progress}</div>}
      </header>
      <div className={styles.body}>{children}</div>
    </section>
  );
}
