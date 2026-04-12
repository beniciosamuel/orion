import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage/LoginPage";
import { SignUpPage } from "./pages/SignUpPage/SignUpPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      {/* <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/patients" replace />} />
        <Route path="/patients" element={<PatientPage />} />
        <Route path="/medicines" element={<MedicinePage />} />
        <Route path="/prescriptions" element={<PrescriptionPage />} />
      </Route> */}
    </Routes>
  );
}

export default App;
