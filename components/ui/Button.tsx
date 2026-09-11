import type { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  const variantClass = variant === "primary" ? styles.primary : styles.secondary;
  return (
    <button
      type="button"
      className={[styles.button, variantClass, className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}
