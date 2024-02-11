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

  socket.on("create-room", (newRoom) => {
    io.emit("view-room", newRoom);
  });

  socket.on("enter-room", (roomId) => {
    socket.join(roomId);
  });

  socket.on("message", (data) => {
    io.to(data.roomId).emit("message", data);
    io.to(data.roomId).emit("msg-receive", data);
    console.log(data);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(SERVER_PORT, SERVER_HOST, () => {
  console.log(`Server is running at http://${SERVER_HOST}:${SERVER_PORT}`);
});
