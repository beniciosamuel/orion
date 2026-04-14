import { MainLayout } from "../../layouts/MainLayout";
import { ForgotPasswordForm } from "../../components/ForgotPasswordForm";
import styles from "./ForgotPasswordPage.module.css";

export const ForgotPasswordPage: React.FC = () => {
  return (
    <MainLayout>
      <div className={styles.container}>
        <ForgotPasswordForm />
      </div>
    </MainLayout>
  );
};
