import { Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage/LoginPage";
import { SignUpPage } from "./pages/SignUpPage/SignUpPage";
import { MoviesListPage } from "./pages/MoviesListPage";
import { MovieDetailsPage } from "./pages/MovieDetailsPage";
import { RequireAuth } from "./components/RequireAuth";
import { RootRedirect } from "./components/RootRedirect";

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route element={<RequireAuth />}>
        <Route path="/movies" element={<MoviesListPage />} />
        <Route path="/movies/:movieId" element={<MovieDetailsPage />} />
      </Route>
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
