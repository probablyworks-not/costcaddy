import styles from "./KpiStrip.module.css";

export type KpiItem = {
  key: string;
  label: string;
  value: string;
  sub?: { label: string; value: string };
};

/** Report §1 KPI strip — big mono number over an uppercase label, per-pax sub-figures. */
export function KpiStrip({ items }: { items: KpiItem[] }) {
  return (
    <div className={styles.strip}>
      {items.map((item) => (
        <div key={item.key} className={styles.cell}>
          <div className={styles.label}>{item.label}</div>
          <div className={styles.value}>{item.value}</div>
          {item.sub && (
            <div className={styles.sub}>
              <span className={styles.subLabel}>{item.sub.label}</span>
              <span className={styles.subValue}>{item.sub.value}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
