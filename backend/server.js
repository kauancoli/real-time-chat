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

  socket.on("create-room", (room) => {
    io.emit("view-room", room);
  });

  socket.on("enter-room", (roomId) => {
    socket.join(roomId);
  });

  socket.on("message", (msg) => {
    io.to(msg.roomId).emit("message", msg);
    io.emit("msg-received", msg);
    console.log(msg);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(SERVER_PORT, SERVER_HOST, () => {
  console.log(`Server is running at http://${SERVER_HOST}:${SERVER_PORT}`);
});
