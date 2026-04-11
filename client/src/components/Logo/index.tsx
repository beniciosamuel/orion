import { CubosLogoIcon } from "../Icons/CubosLogo";
import { CubosLogoLetterIcon } from "../Icons/CubosLogoLetter";
import styles from "./Logo.module.css";

export const Logo: React.FC = () => {
  return (
    <div className={styles.logoWrapper}>
      <CubosLogoIcon />
      <span className={styles.letterIcon}>
        <CubosLogoLetterIcon />
      </span>
      <span className={styles.logoText}>Movies</span>
    </div>
  );
};
