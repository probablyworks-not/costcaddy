import type { ReactNode } from "react";
import styles from "./ReportTable.module.css";

export type ReportColumn = {
  key: string;
  label: string;
  align?: "left" | "right";
  emphasis?: boolean;
};

export type ReportRow = {
  id: string;
  zebra?: boolean;
  /** Category colour dot rendered before the first cell's content. */
  dotColor?: string;
  cells: Record<string, ReactNode>;
};

/** Report §1/§1B/§2 table primitive — full-width, `--r-border` rules, IBM Plex Mono figures. */
export function ReportTable({ columns, rows }: { columns: ReportColumn[]; rows: ReportRow[] }) {
  return (
    <table className={styles.table}>
      <thead>
        <tr className={styles.headRow}>
          {columns.map((col) => (
            <th
              key={col.key}
              className={[styles.th, col.align === "right" && styles.thRight, col.emphasis && styles.thEmphasis]
                .filter(Boolean)
                .join(" ")}
            >
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id} className={[styles.row, row.zebra && styles.rowZebra].filter(Boolean).join(" ")}>
            {columns.map((col, i) => (
              <td
                key={col.key}
                className={[styles.td, col.align === "right" && styles.tdRight, col.emphasis && styles.tdEmphasis]
                  .filter(Boolean)
                  .join(" ")}
              >
                {i === 0 && row.dotColor && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                    <span className={styles.categoryDot} style={{ background: row.dotColor }} />
                    {row.cells[col.key]}
                  </span>
                )}
                {!(i === 0 && row.dotColor) && row.cells[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
