import type { InputHTMLAttributes } from "react";

import { SearchIcon } from "../Icons";
import { Input } from "../Input";
import styles from "./SearchBar.module.css";

type SearchBarProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  hasError?: boolean;
  wrapperClassName?: string;
};

export const SearchBar: React.FC<SearchBarProps> = ({
  hasError = false,
  className,
  wrapperClassName,
  ...inputProps
}) => {
  const wrapperClasses = [
    styles.wrapper,
    hasError ? styles.wrapperError : "",
    wrapperClassName,
  ]
    .filter(Boolean)
    .join(" ");

  const inputClasses = [styles.inputWithIcon, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperClasses}>
      <span className={styles.icon} aria-hidden="true">
        <SearchIcon />
      </span>
      <Input
        type="search"
        hasError={false}
        className={inputClasses}
        {...inputProps}
      />
    </div>
  );
};
