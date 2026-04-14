import { Navigate } from "react-router-dom";

export const RootRedirect: React.FC = () => {
  const authToken = localStorage.getItem("authToken");

  return <Navigate to={authToken ? "/movies" : "/login"} replace />;
};
