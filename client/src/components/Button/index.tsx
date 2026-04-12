import type { ButtonHTMLAttributes, ReactNode } from "react";

import styles from "./Button.module.css";

type ButtonVariant = "primary" | "secondary" | "link";
type ButtonSize = "compact" | "full";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "full",
  className,
  ...buttonProps
}) => {
  const variantClass =
    variant === "primary"
      ? styles.primary
      : variant === "secondary"
        ? styles.secondary
        : styles.link;

  const classes = [
    styles.button,
    variantClass,
    size === "compact" ? styles.compact : styles.full,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
};
