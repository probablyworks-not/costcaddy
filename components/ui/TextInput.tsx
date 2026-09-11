import { useId, type InputHTMLAttributes } from "react";
import styles from "./TextInput.module.css";

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  numeric?: boolean;
};

export function TextInput({ label, numeric, id, className, ...props }: TextInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <div className={styles.field}>
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
