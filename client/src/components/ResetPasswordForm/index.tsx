import { FormEvent, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";

import { AuthService } from "../../services/AuthService";
import { Button } from "../Button";
import { Input } from "../Input";
import styles from "./ResetPasswordForm.module.css";

export const ResetPasswordForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId") ?? "";
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isMissingUserId = useMemo(() => !userId, [userId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isMissingUserId) {
      setErrorMessage(t("auth.resetPassword.errors.missingUserId"));
      return;
    }

    if (!code.trim()) {
      setErrorMessage(t("auth.resetPassword.errors.codeRequired"));
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage(t("auth.resetPassword.errors.passwordLength"));
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage(t("auth.resetPassword.errors.passwordMismatch"));
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await AuthService.updateUserPassword({
        userId,
        code: code.trim(),
        newPassword,
      });

      setSuccessMessage(t("auth.resetPassword.success"));

      window.setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1200);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : t("auth.resetPassword.errors.requestFailed"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.formDock}>
      <div className={styles.header}>
        <p className={styles.kicker}>{t("auth.resetPassword.kicker")}</p>
        <h1 className={styles.title}>{t("auth.resetPassword.title")}</h1>
        <p className={styles.subtitle}>{t("auth.resetPassword.subtitle")}</p>
      </div>

      {isMissingUserId && (
        <div className={styles.errorMessage}>
          {t("auth.resetPassword.errors.missingUserId")}
        </div>
      )}
      {errorMessage && (
        <div className={styles.errorMessage}>{errorMessage}</div>
      )}
      {successMessage && (
        <div className={styles.successMessage}>{successMessage}</div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="reset-password-code" className={styles.label}>
            {t("auth.resetPassword.code")}
          </label>
          <Input
            id="reset-password-code"
            type="text"
            hasError={Boolean(errorMessage)}
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder={t("auth.resetPassword.codePlaceholder")}
            disabled={isSubmitting}
            autoComplete="one-time-code"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="reset-password-new" className={styles.label}>
            {t("auth.resetPassword.newPassword")}
          </label>
          <Input
            id="reset-password-new"
            type="password"
            hasError={Boolean(errorMessage)}
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            placeholder={t("auth.resetPassword.newPasswordPlaceholder")}
            disabled={isSubmitting}
            autoComplete="new-password"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="reset-password-confirm" className={styles.label}>
            {t("auth.resetPassword.confirmPassword")}
          </label>
          <Input
            id="reset-password-confirm"
            type="password"
            hasError={Boolean(errorMessage)}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder={t("auth.resetPassword.confirmPasswordPlaceholder")}
            disabled={isSubmitting}
            autoComplete="new-password"
          />
        </div>

        <p className={styles.helperText}>
          {t("auth.resetPassword.helperText")}
        </p>

        <div className={styles.actionsRow}>
          <Button
            type="button"
            variant="secondary"
            size="compact"
            onClick={() => navigate("/forgot-password")}
          >
            {t("auth.resetPassword.back")}
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="compact"
            disabled={isSubmitting || isMissingUserId}
          >
            {isSubmitting
              ? t("auth.resetPassword.submitting")
              : t("auth.resetPassword.submit")}
          </Button>
        </div>
      </form>
    </div>
  );
};
