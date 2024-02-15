import { io } from "socket.io-client";

export const SocketConnect = io("https://chat-real-time-pcdg.onrender.com");
SocketConnect.on("connect", () => {
  console.log("Connected to server");
});
