import { Socket } from "socket.io-client";

export type Props = {
  socket: Socket;
  user: string;
  room: string;
};
