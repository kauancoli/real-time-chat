import { socket } from "@/services/socket/client";
import { ReactNode } from "react";
import { SocketContext } from "./socket-context";

export function SocketProvider({ children }: { children: ReactNode }) {
  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}
