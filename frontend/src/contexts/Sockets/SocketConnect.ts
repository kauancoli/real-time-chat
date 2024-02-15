import { io } from "socket.io-client";

export const SocketConnect = io("http://localhost:3000");
SocketConnect.on("connect", () => {
  console.log("Connected to server");
});
