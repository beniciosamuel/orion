import { create } from "zustand";

import { AuthService } from "../services/AuthService";
import { ThemePreferenceService } from "../services/ThemePreference";

export type LoginField = "email" | "password";

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginStoreState {
  formData: LoginFormData;
  errors: Partial<Record<LoginField, string>>;
  isSubmitting: boolean;
  serverError: string | null;
  setField: (field: LoginField, value: string) => void;
  submit: () => Promise<boolean>;
  reset: () => void;
}

const initialFormData: LoginFormData = {
  email: "",
  password: "",
};

const validateForm = (
  formData: LoginFormData,
): Partial<Record<LoginField, string>> => {
  const errors: Partial<Record<LoginField, string>> = {};

  if (!formData.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
    errors.email = "Email is invalid.";
  }

  if (!formData.password) {
    errors.password = "Password is required.";
  } else if (formData.password.length < 8) {
    errors.password = "Password must have at least 8 characters.";
  }

  return errors;
};

export const useLoginStore = create<LoginStoreState>((set, get) => ({
  formData: initialFormData,
  errors: {},
  isSubmitting: false,
  serverError: null,
  setField: (field, value) => {
    set((state) => ({
      formData: {
        ...state.formData,
        [field]: value,
      },
      errors: {
        ...state.errors,
        [field]: undefined,
      },
      serverError: null,
    }));
  },
  submit: async () => {
    const { formData } = get();
    const errors = validateForm(formData);

    if (Object.keys(errors).length > 0) {
      set({ errors });
      return false;
    }

    set({ isSubmitting: true, errors: {}, serverError: null });

    try {
      const response = await AuthService.authenticate({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (!response.authToken) {
        throw new Error("Authentication token was not returned by server.");
      }

      localStorage.setItem("authToken", response.authToken);
      localStorage.setItem("userId", response.id);
      localStorage.setItem("userScope", response.scope);

      set({
        isSubmitting: false,
      });

      try {
        await ThemePreferenceService.syncStoredThemeToServer();
      } catch (syncError) {
        console.error("Failed to sync theme after login:", syncError);
      }

      return true;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to login. Please try again.";

      set({
        isSubmitting: false,
        serverError: message,
      });

      return false;
    }
  },
  reset: () => {
    set({
      formData: initialFormData,
      errors: {},
      serverError: null,
      isSubmitting: false,
    });
  },
}));
