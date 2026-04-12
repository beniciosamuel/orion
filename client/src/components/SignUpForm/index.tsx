import { useTranslation } from "react-i18next";

import { useState } from "react";
import { Button } from "../Button";
import { Input } from "../Input";
import styles from "./SignUpForm.module.css";

const handleLogin = (e: React.FormEvent) => {
  e.preventDefault();
  console.log("Login form submitted");
};

export const SignUpForm: React.FC = () => {
  const { t } = useTranslation();
  const [isSubmitting] = useState(false);

  const [signUpForm, setSignUpForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleSignUpInputChange = (
    field: keyof typeof signUpForm,
    value: string,
  ) => {
    setSignUpForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Validation errors
  const [signUpErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  return (
    <div className={styles.formDock}>
      <form onSubmit={handleLogin} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="sign-up-name" className={styles.label}>
            {t("auth.signup.name")}
          </label>
          <Input
            id="sign-up-name"
            type="text"
            hasError={Boolean(signUpErrors.name)}
            value={signUpForm.name}
            onChange={(e) => handleSignUpInputChange("name", e.target.value)}
            placeholder={t("auth.signup.namePlaceholder")}
            disabled={isSubmitting}
          />
          {signUpErrors.name && (
            <span className={styles.errorText}>{signUpErrors.name}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="sign-up-email" className={styles.label}>
            {t("auth.signup.email")}
          </label>
          <Input
            id="sign-up-email"
            type="email"
            hasError={Boolean(signUpErrors.email)}
            value={signUpForm.email}
            onChange={(e) => handleSignUpInputChange("email", e.target.value)}
            placeholder={t("auth.signup.emailPlaceholder")}
            disabled={isSubmitting}
          />
          {signUpErrors.email && (
            <span className={styles.errorText}>{signUpErrors.email}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="sign-up-password" className={styles.label}>
            {t("auth.signup.password")}
          </label>
          <Input
            id="sign-up-password"
            type="password"
            hasError={Boolean(signUpErrors.password)}
            value={signUpForm.password}
            onChange={(e) =>
              handleSignUpInputChange("password", e.target.value)
            }
            placeholder={t("auth.signup.passwordPlaceholder")}
            disabled={isSubmitting}
          />
          {signUpErrors.password && (
            <span className={styles.errorText}>{signUpErrors.password}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="sign-up-confirm-password" className={styles.label}>
            {t("auth.signup.confirmPassword")}
          </label>
          <Input
            id="sign-up-confirm-password"
            type="password"
            hasError={Boolean(signUpErrors.confirmPassword)}
            value={signUpForm.confirmPassword}
            onChange={(e) =>
              handleSignUpInputChange("confirmPassword", e.target.value)
            }
            placeholder={t("auth.signup.confirmPasswordPlaceholder")}
            disabled={isSubmitting}
          />
          {signUpErrors.confirmPassword && (
            <span className={styles.errorText}>
              {signUpErrors.confirmPassword}
            </span>
          )}
        </div>

        <div className={styles.formActionsRow}>
          <Button
            type="submit"
            variant="primary"
            size="compact"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? t("auth.signup.submitting")
              : t("auth.signup.submit")}
          </Button>
        </div>
      </form>
    </div>
  );
};
