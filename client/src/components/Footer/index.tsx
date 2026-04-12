import styles from "./Footer.module.css";

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <span className={styles.text}>
        2026 © Todos os direitos reservados a{" "}
        <span className={styles.logoText}>Cubos Movies</span>
      </span>
    </footer>
  );
};
