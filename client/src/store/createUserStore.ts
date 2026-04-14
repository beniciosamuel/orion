import { create } from "zustand";

import { UserService } from "../services/UserService";

export type SignUpField =
  | "name"
  | "email"
  | "phone"
  | "password"
  | "confirmPassword";

interface SignUpFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface CreateUserStoreState {
  formData: SignUpFormData;
  errors: Partial<Record<SignUpField, string>>;
  isSubmitting: boolean;
  serverError: string | null;
  createdUserToken: string | null;
  setField: (field: SignUpField, value: string) => void;
  submit: () => Promise<boolean>;
  reset: () => void;
}

const initialFormData: SignUpFormData = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

const validateForm = (
  formData: SignUpFormData,
): Partial<Record<SignUpField, string>> => {
  const errors: Partial<Record<SignUpField, string>> = {};

  if (!formData.name.trim()) {
    errors.name = "Name is required.";
  }

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

  if (!formData.confirmPassword) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
};

export const useCreateUserStore = create<CreateUserStoreState>((set, get) => ({
  formData: initialFormData,
  errors: {},
  isSubmitting: false,
  serverError: null,
  createdUserToken: null,
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
      const response = await UserService.createUser({
        fullName: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        scope: "editor",
      });

      localStorage.setItem("authToken", response.token);
      localStorage.setItem("userId", response.user.id);
      localStorage.setItem("userScope", response.user.scope);

      set({
        isSubmitting: false,
        createdUserToken: response.token,
      });

      return true;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to create account. Please try again.";

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
      createdUserToken: null,
      isSubmitting: false,
    });
  },
}));
