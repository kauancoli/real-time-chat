import { Message } from "@/types/domain";
import { apiClient } from "./client";

export async function createMessage(message: Message) {
  const { data } = await apiClient.post<Message>("messages", message);
  return data;
}
