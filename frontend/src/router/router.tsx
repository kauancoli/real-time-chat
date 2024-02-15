import { SocketConnect, SocketProvider, useAuth } from "@/contexts";
import { Home, Login, Register } from "@/pages";
import React, { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

export const Router: React.FC = () => {
  const socket = SocketConnect;

  const { user } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(user));

  useEffect(() => {
    setIsLoggedIn(Boolean(user));
  }, [user]);

  return (
    <SocketProvider socket={socket}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={isLoggedIn ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/"
            element={isLoggedIn ? <Home /> : <Navigate to="/login" />}
          />
        </Routes>
      </BrowserRouter>
    </SocketProvider>
  );
};
