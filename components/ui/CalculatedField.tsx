import styles from "./CalculatedField.module.css";

/** Read-only, derived value — never typed. See CLAUDE.md invariant "calculated is never typed". */
export function CalculatedField({
  label,
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.field}>
      {label && <span className={styles.label}>{label}</span>}
      <div className={styles.value}>{children}</div>
    </div>
  );
}
