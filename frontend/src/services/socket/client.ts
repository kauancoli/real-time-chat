import { io, Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "./events";

const socketUrl =
  import.meta.env.VITE_SOCKET_URL ?? "https://chat-real-time-pcdg.onrender.com";

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> =
  io(socketUrl);
