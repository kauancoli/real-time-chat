const express = require("express");
const http = require("http");
const socket = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socket(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const port = process.env.PORT || 3000;

io.on("connection", (socket) => {
  socket.on("create-room", (room) => {
    io.emit("view-room", room);
  });

  socket.on("update-room", (room) => {
    io.emit("view-room", room);
  });

  socket.on("delete-room", (roomId) => {
    io.emit("delete-room", roomId);
  });

  socket.on("enter-room", (roomId) => {
    socket.join(roomId);
  });

  socket.on("message", (msg) => {
    io.to(msg.roomId).emit("message", msg);
    io.emit("msg-received", msg);
  });

  socket.on("disconnect", () => {
    console.log(`user disconnected ${socket.id}`);
  });
});

server.listen(port, () => {
  console.log(`Server is running at: ${port}`);
});
