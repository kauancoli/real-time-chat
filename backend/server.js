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
  console.log("Io has a new connection");

  socket.on("message", (data) => {
    io.emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log("Socket connection was disconnected");
  });
});

server.listen(SERVER_PORT, SERVER_HOST, () => {
  console.log(`Server is running at http://${SERVER_HOST}:${SERVER_PORT}`);
});
