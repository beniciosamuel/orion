import { useTranslation } from "react-i18next";

import { useLogin } from "../../hooks/useLogin";
import { Button } from "../Button";
import { Input } from "../Input";
import styles from "./LoginForm.module.css";

export const LoginForm: React.FC = () => {
  const { t } = useTranslation();
  const {
    formData,
    errors,
    isSubmitting,
    serverError,
    handleInputChange,
    handleSubmit,
  } = useLogin();

  return (
    <div className={styles.formDock}>
      {serverError && <div className={styles.errorMessage}>{serverError}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="login-email" className={styles.label}>
            {t("auth.login.email")}
          </label>
          <Input
            id="login-email"
            type="email"
            hasError={Boolean(errors.email)}
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder={t("auth.login.emailPlaceholder")}
            disabled={isSubmitting}
          />
          {errors.email && (
            <span className={styles.errorText}>{errors.email}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="login-password" className={styles.label}>
            {t("auth.login.password")}
          </label>
          <Input
            id="login-password"
            type="password"
            hasError={Boolean(errors.password)}
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            placeholder={t("auth.login.passwordPlaceholder")}
            disabled={isSubmitting}
          />
          {errors.password && (
            <span className={styles.errorText}>{errors.password}</span>
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
