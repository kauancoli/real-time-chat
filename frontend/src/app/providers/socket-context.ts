import { socket } from "@/services/socket/client";
import { createContext } from "react";

export const SocketContext = createContext({ socket });
