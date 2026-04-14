import { MainLayout } from "../../layouts/MainLayout";
import { ResetPasswordForm } from "../../components/ResetPasswordForm";
import styles from "./ResetPasswordPage.module.css";

export const ResetPasswordPage: React.FC = () => {
  return (
    <MainLayout>
      <div className={styles.container}>
        <ResetPasswordForm />
      </div>
    </MainLayout>
  );
};
