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

const SERVER_HOST = "localhost";
const SERVER_PORT = 3000;

const activeUsers = [];

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

  socket.on("login", (userData) => {
    activeUsers.push({
      id: userData.id,
      userName: userData.userName,
    });

    io.emit("active-users", activeUsers);
  });

  socket.on("logout", (userData) => {
    const userId = userData.userId;
    const index = activeUsers.findIndex((user) => user.id === userId);

    if (index !== -1) {
      activeUsers.splice(index, 1);
    }

    io.emit("active-users", activeUsers);
  });

  socket.on("message", (msg) => {
    io.to(msg.roomId).emit("message", msg);
    io.emit("msg-received", msg);
    console.log(msg);
  });

  socket.on("disconnect", () => {
    console.log(`user disconnected ${socket.id}`);
    io.emit("active-users", activeUsers);
  });
});

server.listen(SERVER_PORT, SERVER_HOST, () => {
  console.log(`Server is running at http://${SERVER_HOST}:${SERVER_PORT}`);
});
