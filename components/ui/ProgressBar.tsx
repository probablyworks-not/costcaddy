import styles from "./ProgressBar.module.css";

/** value/max as 0-100, or pass value+max to have it computed. */
export function ProgressBar({ value, max = 100 }: { value: number; max?: number }) {
  const pct = max === 0 ? 0 : Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={styles.track}>
      <div className={styles.fill} style={{ width: `${pct}%` }} />
    </div>
  );
}
