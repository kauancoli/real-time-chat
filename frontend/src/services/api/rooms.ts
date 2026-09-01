import { Message, Room } from "@/types/domain";
import { apiClient } from "./client";

type RoomWithMessages = Room & { messages?: Message[] };

export async function getRoomsWithMessages() {
  const { data } = await apiClient.get<RoomWithMessages[]>(
    "rooms?_embed=messages",
  );
  return data;
}

export async function getRooms() {
  const { data } = await apiClient.get<Room[]>("rooms");
  return data;
}

export async function createRoom(room: Room) {
  const { data } = await apiClient.post<Room>("rooms", room);
  return data;
}

export async function updateRoom(roomId: string, room: Room) {
  const { data } = await apiClient.put<Room>(`rooms/${roomId}`, room);
  return data;
}

export async function deleteRoom(roomId: string) {
  await apiClient.delete(`rooms/${roomId}`);
}
