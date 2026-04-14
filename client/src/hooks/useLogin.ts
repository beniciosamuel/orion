import { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { LoginField, useLoginStore } from "../store/loginStore";

export const useLogin = () => {
  const navigate = useNavigate();

  const formData = useLoginStore((state) => state.formData);
  const errors = useLoginStore((state) => state.errors);
  const isSubmitting = useLoginStore((state) => state.isSubmitting);
  const serverError = useLoginStore((state) => state.serverError);
  const setField = useLoginStore((state) => state.setField);
  const submit = useLoginStore((state) => state.submit);

  const handleInputChange = (field: LoginField, value: string) => {
    setField(field, value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const wasSuccessful = await submit();

    if (wasSuccessful) {
      navigate("/movies");
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
