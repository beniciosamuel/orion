import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useNavigate } from "react-router-dom";
import styles from "./MainLayout.module.css";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const authToken = localStorage.getItem("authToken");

  const handleSignOut = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userScope");
    navigate("/login", { replace: true });
  };

  return (
    <div className={styles.container}>
      <Header onSignOut={authToken ? handleSignOut : undefined} />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
};
