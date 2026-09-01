import { AuthenticatedUser } from "@/types/domain";

const AUTH_STORAGE_KEY = "user";

export function getStoredUser(): AuthenticatedUser | null {
  const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser) as AuthenticatedUser;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function saveStoredUser(user: AuthenticatedUser): void {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

export function removeStoredUser(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}
