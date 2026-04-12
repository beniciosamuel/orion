import type { InputHTMLAttributes } from "react";

import styles from "./Input.module.css";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean;
};

export const Input: React.FC<InputProps> = ({
  hasError = false,
  className,
  ...inputProps
}) => {
  const classes = [styles.input, hasError ? styles.inputError : "", className]
    .filter(Boolean)
    .join(" ");

  return <input className={classes} {...inputProps} />;
};
