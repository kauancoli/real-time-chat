import { Home, Login } from "@/pages";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { io } from "socket.io-client";

export const Router: React.FC = () => {
  const socket = io("http://localhost:3000");
  socket.on("connect", () => {
    console.log("Connected to server");
  });
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login socket={socket} />} />
        <Route path="/" element={<Home socket={socket} />} />
      </Routes>
    </BrowserRouter>
  );
};
