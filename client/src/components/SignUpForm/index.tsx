import { useTranslation } from "react-i18next";

import { useCreateUser } from "../../hooks/useCreateUser";
import { Button } from "../Button";
import { Input } from "../Input";
import styles from "./SignUpForm.module.css";

export const SignUpForm: React.FC = () => {
  const { t } = useTranslation();
  const {
    formData,
    errors,
    isSubmitting,
    serverError,
    handleInputChange,
    handleSubmit,
  } = useCreateUser();

  return (
    <div className={styles.formDock}>
      {serverError && <div className={styles.errorMessage}>{serverError}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="sign-up-name" className={styles.label}>
            {t("auth.signup.name")}
          </label>
          <Input
            id="sign-up-name"
            type="text"
            hasError={Boolean(errors.name)}
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder={t("auth.signup.namePlaceholder")}
            disabled={isSubmitting}
          />
          {errors.name && (
            <span className={styles.errorText}>{errors.name}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="sign-up-email" className={styles.label}>
            {t("auth.signup.email")}
          </label>
          <Input
            id="sign-up-email"
            type="email"
            hasError={Boolean(errors.email)}
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder={t("auth.signup.emailPlaceholder")}
            disabled={isSubmitting}
          />
          {errors.email && (
            <span className={styles.errorText}>{errors.email}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="sign-up-password" className={styles.label}>
            {t("auth.signup.password")}
          </label>
          <Input
            id="sign-up-password"
            type="password"
            hasError={Boolean(errors.password)}
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            placeholder={t("auth.signup.passwordPlaceholder")}
            disabled={isSubmitting}
          />
          {errors.password && (
            <span className={styles.errorText}>{errors.password}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="sign-up-confirm-password" className={styles.label}>
            {t("auth.signup.confirmPassword")}
          </label>
          <Input
            id="sign-up-confirm-password"
            type="password"
            hasError={Boolean(errors.confirmPassword)}
            value={formData.confirmPassword}
            onChange={(e) =>
              handleInputChange("confirmPassword", e.target.value)
            }
            placeholder={t("auth.signup.confirmPasswordPlaceholder")}
            disabled={isSubmitting}
          />
          {errors.confirmPassword && (
            <span className={styles.errorText}>{errors.confirmPassword}</span>
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
