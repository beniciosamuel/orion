import { MainLayout } from "../../layouts/MainLayout";
import { SignUpForm } from "../../components/SignUpForm";
import styles from "./SignUpPage.module.css";

export const SignUpPage: React.FC = () => {
  return (
    <MainLayout>
      <div className={styles.container}>
        <SignUpForm />
      </div>
    </MainLayout>
  );
};
