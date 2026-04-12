import { MainLayout } from "../../layouts/MainLayout";
import { LoginForm } from "../../components/LoginForm";
import styles from "./LoginPage.module.css";

export const LoginPage: React.FC = () => {
  return (
    <MainLayout>
      <div className={styles.container}>
        <LoginForm />
      </div>
    </MainLayout>
  );
};
