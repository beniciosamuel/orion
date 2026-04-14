import { Button } from "../Button";
import { CubosLogoIcon } from "../Icons/CubosLogo";
import { CubosLogoLetterIcon } from "../Icons/CubosLogoLetter";
import { ThemeSwitcher } from "../ThemeSwitcher";
import styles from "./Header.module.css";

type HeaderProps = {
  onSignOut?: () => void;
};

export const Header: React.FC<HeaderProps> = ({ onSignOut }) => {
  return (
    <header className={styles.header}>
      <span className={styles.logo}>
        <span className={styles.logoMark}>
          <CubosLogoIcon />
        </span>
        <span className={styles.logoLetter}>
          <CubosLogoLetterIcon />
        </span>
        <span className={styles.logoText}>Movies</span>
      </span>

      <div className={styles.actions}>
        <ThemeSwitcher className={styles.headerIcon} />
        {onSignOut ? (
          <Button
            type="button"
            variant="secondary"
            size="compact"
            onClick={onSignOut}
          >
            Sign Out
          </Button>
        ) : null}
      </div>
    </header>
  );
};
