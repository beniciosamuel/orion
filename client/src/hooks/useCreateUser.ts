import { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { SignUpField, useCreateUserStore } from "../store/createUserStore";

export const useCreateUser = () => {
  const navigate = useNavigate();

  const formData = useCreateUserStore((state) => state.formData);
  const errors = useCreateUserStore((state) => state.errors);
  const isSubmitting = useCreateUserStore((state) => state.isSubmitting);
  const serverError = useCreateUserStore((state) => state.serverError);
  const setField = useCreateUserStore((state) => state.setField);
  const submit = useCreateUserStore((state) => state.submit);

  const handleInputChange = (field: SignUpField, value: string) => {
    setField(field, value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const wasSuccessful = await submit();

    if (wasSuccessful) {
      navigate("/login");
    }
  };

  return {
    formData,
    errors,
    isSubmitting,
    serverError,
    handleInputChange,
    handleSubmit,
  };
};
