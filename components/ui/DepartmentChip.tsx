import styles from "./DepartmentChip.module.css";

export function DepartmentChip({ children }: { children: React.ReactNode }) {
  return <div className={styles.chip}>{children}</div>;
}
