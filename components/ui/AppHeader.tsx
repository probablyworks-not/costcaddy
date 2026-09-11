import type { ReactNode } from "react";
import styles from "./AppHeader.module.css";

export function AppHeader({
  wordmark = "F&B Controller",
  children,
}: {
  wordmark?: string;
  children?: ReactNode;
}) {
  return (
    <header className={styles.header}>
      <div className={styles.wordmark}>{wordmark}</div>
      <div className={styles.actions}>{children}</div>
    </header>
  );
}
