const express = require("express");
const http = require("http");
const socket = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socket(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const SERVER_HOST = "localhost";
const SERVER_PORT = 3000;

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("room", (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  socket.on("message", (data) => {
    socket.to(data.roomId).emit("message", data);
    socket.to(data.roomId).emit("msg-receive", data);
    console.log(data);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(SERVER_PORT, SERVER_HOST, () => {
  console.log(`Server is running at http://${SERVER_HOST}:${SERVER_PORT}`);
});
