import { Message, Room } from "@/types/domain";

export interface ServerToClientEvents {
  "create-room": (room: Room) => void;
  "view-room": (room: Room) => void;
  "delete-room": (roomId: string) => void;
  message: (message: Message) => void;
  "msg-received": (message: Message) => void;
}

export interface ClientToServerEvents {
  "create-room": (room: Room) => void;
  "update-room": (room: Room) => void;
  "delete-room": (roomId: string) => void;
  "enter-room": (roomId: string) => void;
  message: (message: Message) => void;
}
