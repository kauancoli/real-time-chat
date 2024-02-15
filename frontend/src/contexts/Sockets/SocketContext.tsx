import React, { createContext, ReactNode, useContext } from "react";
import { Socket } from "socket.io-client";

type SocketContextType = {
  socket: Socket;
};

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{
  socket: Socket;
  children: ReactNode;
}> = ({ socket, children }) => {
  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket deve ser usado dentro de um SocketProvider");
  }
  return context;
};
