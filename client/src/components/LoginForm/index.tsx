import { useTranslation } from "react-i18next";

import { useState } from "react";
import { Button } from "../Button";
import { Input } from "../Input";
import styles from "./LoginForm.module.css";

const handleLogin = (e: React.FormEvent) => {
  e.preventDefault();
  console.log("Login form submitted");
};

export const LoginForm: React.FC = () => {
  const { t } = useTranslation();
  const [isSubmitting] = useState(false);

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
  const [loginErrors] = useState<{
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
          <Input
            id="login-email"
            type="email"
            hasError={Boolean(loginErrors.email)}
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
          <Input
            id="login-password"
            type="password"
            hasError={Boolean(loginErrors.password)}
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
          <Button type="button" variant="link" size="full">
            {t("auth.login.forgotPassword")}
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="compact"
            disabled={isSubmitting}
          >
            {isSubmitting ? t("auth.login.submitting") : t("auth.login.submit")}
          </Button>
        </div>
      </form>
    </div>
  );
};
