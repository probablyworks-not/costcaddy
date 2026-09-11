import styles from "./RoleBadge.module.css";

export function RoleBadge({ children }: { children: React.ReactNode }) {
  return <div className={styles.badge}>{children}</div>;
}
