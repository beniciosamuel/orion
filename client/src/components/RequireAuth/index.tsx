import type { ReactElement } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export const RequireAuth = (): ReactElement => {
  const location = useLocation();
  const authToken = localStorage.getItem("authToken");

  if (!authToken) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};
