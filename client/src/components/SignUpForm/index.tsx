import { useTranslation } from "react-i18next";

import { useState } from "react";
import styles from "./SignUpForm.module.css";

const handleLogin = (e: React.FormEvent) => {
  e.preventDefault();
  console.log("Login form submitted");
};

export const SignUpForm: React.FC = () => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

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
  const [loginErrors, setLoginErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [signUpErrors, setSignUpErrors] = useState<{
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
          <input
            id="sign-up-name"
            type="text"
            className={`${styles.input} ${signUpErrors.name ? styles.inputError : ""}`}
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
          <input
            id="sign-up-email"
            type="email"
            className={`${styles.input} ${signUpErrors.email ? styles.inputError : ""}`}
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
          <input
            id="sign-up-password"
            type="password"
            className={`${styles.input} ${signUpErrors.password ? styles.inputError : ""}`}
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
          <input
            id="sign-up-confirm-password"
            type="password"
            className={`${styles.input} ${signUpErrors.confirmPassword ? styles.inputError : ""}`}
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

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? t("auth.signup.submitting") : t("auth.signup.submit")}
        </button>
      </form>
    </div>
  );
};
