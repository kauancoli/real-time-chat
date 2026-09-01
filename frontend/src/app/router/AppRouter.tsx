import { useAuth } from "@/features/auth/useAuth";
import { Home, Login } from "@/pages";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

export function AppRouter() {
  const { user } = useAuth();
  const isLoggedIn = Boolean(user);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/"
          element={isLoggedIn ? <Home /> : <Navigate to="/login" replace />}
        />
        <Route
          path="*"
          element={<Navigate to={isLoggedIn ? "/" : "/login"} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}
