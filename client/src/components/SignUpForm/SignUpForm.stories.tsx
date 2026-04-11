import type { ReactNode } from "react";

import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { createInstance } from "i18next";
import type { InitOptions } from "i18next";
import { I18nextProvider } from "react-i18next";
import { expect } from "storybook/test";

import enTranslations from "../../i18n/locales/en.json";
import ptTranslations from "../../i18n/locales/pt.json";
import { SignUpForm } from ".";
import styles from "./SignUpForm.stories.module.css";

type Locale = "en" | "pt";

const createPreviewI18n = (locale: Locale) => {
  const instance = createInstance();

  const initOptions: InitOptions = {
    resources: {
      en: {
        translation: enTranslations,
      },
      pt: {
        translation: ptTranslations,
      },
    },
    lng: locale,
    fallbackLng: locale,
    interpolation: {
      escapeValue: false,
    },
  };

  void instance.init(initOptions);

  return instance;
};

const previewI18n: Record<Locale, ReturnType<typeof createInstance>> = {
  en: createPreviewI18n("en"),
  pt: createPreviewI18n("pt"),
};

const StoryFrame = ({
  children,
  locale,
}: {
  children: ReactNode;
  locale: Locale;
}) => {
  return (
    <div className={styles.previewRoot}>
      <I18nextProvider i18n={previewI18n[locale]}>
        <div className={styles.previewContent}>{children}</div>
      </I18nextProvider>
    </div>
  );
};

const meta: Meta<typeof SignUpForm> = {
  title: "Components/SignUpForm",
  component: SignUpForm,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story, context) => {
      const locale = (context.parameters.locale as Locale) ?? "en";

      return (
        <StoryFrame locale={locale}>
          <Story />
        </StoryFrame>
      );
    },
  ],
};

export default meta;

type Story = StoryObj<typeof SignUpForm>;

const assertSignUpFormCopy = (
  emailLabel: string,
  emailPlaceholder: string,
  passwordLabel: string,
  passwordPlaceholder: string,
  forgotPasswordLabel: string,
  submitLabel: string,
) => {
  return async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await expect(canvasElement).toHaveTextContent(emailLabel);
    await expect(canvasElement).toHaveTextContent(passwordLabel);
    await expect(canvasElement).toHaveTextContent(forgotPasswordLabel);
    await expect(canvasElement).toHaveTextContent(submitLabel);

    const emailInput = canvasElement.querySelector("#login-email");
    const passwordInput = canvasElement.querySelector("#login-password");
    const forgotPasswordButton = canvasElement.querySelector(
      "button[type='button']",
    );
    const submitButton = canvasElement.querySelector("button[type='submit']");

    await expect(emailInput).toHaveAttribute("placeholder", emailPlaceholder);
    await expect(passwordInput).toHaveAttribute(
      "placeholder",
      passwordPlaceholder,
    );
    await expect(forgotPasswordButton).toHaveTextContent(forgotPasswordLabel);
    await expect(submitButton).toHaveTextContent(submitLabel);
  };
};

export const English: Story = {
  parameters: {
    locale: "en",
  },
  play: assertSignUpFormCopy(
    "Email",
    "Enter your email",
    "Password",
    "Enter your password",
    "Forgot password?",
    "Sign up",
  ),
};

export const Portuguese: Story = {
  parameters: {
    locale: "pt",
  },
  play: assertSignUpFormCopy(
    "E-mail",
    "Digite seu e-mail",
    "Senha",
    "Digite sua senha",
    "Esqueceu a senha?",
    "Entrar",
  ),
};
