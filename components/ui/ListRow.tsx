import type { ReactNode } from "react";
import styles from "./ListRow.module.css";

export function ListRow({
  icon,
  title,
  meta,
  status,
  onClick,
}: {
  icon?: ReactNode;
  title: ReactNode;
  meta?: ReactNode;
  status?: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button type="button" className={styles.row} onClick={onClick}>
      <div className={styles.main}>
        <div>
          <div className={styles.title}>
            {icon}
            <span>{title}</span>
          </div>
          {meta && <div className={styles.meta}>{meta}</div>}
        </div>
      </div>
      {status && <div className={styles.status}>{status}</div>}
    </button>
  );
}
