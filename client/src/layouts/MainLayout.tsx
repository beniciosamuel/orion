import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import styles from "./MainLayout.module.css";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
};
