import { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { AuthService } from "../../services/AuthService";
import { Button } from "../Button";
import { Input } from "../Input";
import styles from "./ForgotPasswordForm.module.css";

const emailPattern = /^\S+@\S+\.\S+$/;

export const ForgotPasswordForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setErrorMessage(t("auth.forgotPassword.errors.emailRequired"));
      return;
    }

    if (!emailPattern.test(normalizedEmail)) {
      setErrorMessage(t("auth.forgotPassword.errors.emailInvalid"));
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await AuthService.createUserCode({
        email: normalizedEmail,
      });
      setSuccessMessage(t("auth.forgotPassword.success"));
      navigate(`/reset-password?userId=${encodeURIComponent(response.userId)}`);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : t("auth.forgotPassword.errors.requestFailed"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.formDock}>
      <div className={styles.header}>
        <p className={styles.kicker}>{t("auth.forgotPassword.kicker")}</p>
        <h1 className={styles.title}>{t("auth.forgotPassword.title")}</h1>
        <p className={styles.subtitle}>{t("auth.forgotPassword.subtitle")}</p>
      </div>

      {errorMessage && (
        <div className={styles.errorMessage}>{errorMessage}</div>
      )}
      {successMessage && (
        <div className={styles.successMessage}>{successMessage}</div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="forgot-password-email" className={styles.label}>
            {t("auth.forgotPassword.email")}
          </label>
          <Input
            id="forgot-password-email"
            type="email"
            hasError={Boolean(errorMessage)}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={t("auth.forgotPassword.emailPlaceholder")}
            disabled={isSubmitting}
          />
        </div>

        <p className={styles.helperText}>
          {t("auth.forgotPassword.helperText")}
        </p>

        <div className={styles.actionsRow}>
          <Button
            type="button"
            variant="secondary"
            size="compact"
            onClick={() => navigate("/login")}
          >
            {t("auth.forgotPassword.backToLogin")}
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="compact"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? t("auth.forgotPassword.submitting")
              : t("auth.forgotPassword.submit")}
          </Button>
        </div>
      </form>
    </div>
  );
};
