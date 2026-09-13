import { useId, type InputHTMLAttributes } from "react";
import styles from "./TextInput.module.css";

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  numeric?: boolean;
};

export function TextInput({ label, numeric, id, className, style, ...props }: TextInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    // `style` sizes this wrapper (flex/minWidth — every caller lays out whole fields in a
    // row), not the <input> itself, so a field's label stays attached to its input's width.
    <div className={styles.field} style={style}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={[styles.input, numeric && styles.numeric, className].filter(Boolean).join(" ")}
        {...props}
      />
    </div>
  );
}
