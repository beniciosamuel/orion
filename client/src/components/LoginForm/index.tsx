import { useTranslation } from "react-i18next";

import { useState } from "react";
import styles from "./LoginForm.module.css";

const handleLogin = (e: React.FormEvent) => {
  e.preventDefault();
  console.log("Login form submitted");
};

export const LoginForm: React.FC = () => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const handleLoginInputChange = (
    field: keyof typeof loginForm,
    value: string,
  ) => {
    setLoginForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Validation errors
  const [loginErrors, setLoginErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  return (
    <div className={styles.formDock}>
      <form onSubmit={handleLogin} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="login-email" className={styles.label}>
            {t("auth.login.email")}
          </label>
          <input
            id="login-email"
            type="email"
            className={`${styles.input} ${loginErrors.email ? styles.inputError : ""}`}
            value={loginForm.email}
            onChange={(e) => handleLoginInputChange("email", e.target.value)}
            placeholder={t("auth.login.emailPlaceholder")}
            disabled={isSubmitting}
          />
          {loginErrors.email && (
            <span className={styles.errorText}>{loginErrors.email}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="login-password" className={styles.label}>
            {t("auth.login.password")}
          </label>
          <input
            id="login-password"
            type="password"
            className={`${styles.input} ${loginErrors.password ? styles.inputError : ""}`}
            value={loginForm.password}
            onChange={(e) => handleLoginInputChange("password", e.target.value)}
            placeholder={t("auth.login.passwordPlaceholder")}
            disabled={isSubmitting}
          />
          {loginErrors.password && (
            <span className={styles.errorText}>{loginErrors.password}</span>
          )}
        </div>

        <div className={styles.formActionsRow}>
          <button type="button" className={styles.forgotPasswordButton}>
            {t("auth.login.forgotPassword")}
          </button>

          <button
            type="submit"
            className={`${styles.submitButton} ${styles.submitButtonInline}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? t("auth.login.submitting") : t("auth.login.submit")}
          </button>
        </div>
      </form>
    </div>
  );
};
