import { User } from "@/types/domain";
import { apiClient } from "./client";

export async function getUsersByCredentials(
  userName: string,
  password: string,
) {
  const { data } = await apiClient.get<User[]>(
    `users?userName=${userName}&password=${password}`,
  );
  return data;
}

export async function getUsersByUserName(userName: string) {
  const { data } = await apiClient.get<User[]>(`users?userName=${userName}`);
  return data;
}

export async function getUsersByEmail(email: string) {
  const { data } = await apiClient.get<User[]>(`users?email=${email}`);
  return data;
}

export async function createUser(user: User) {
  const { data } = await apiClient.post<User>("users", user);
  return data;
}

export async function updateUser(userId: string, user: Omit<User, "id">) {
  const { data } = await apiClient.put<User>(`users/${userId}`, user);
  return data;
}
