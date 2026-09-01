import { AuthenticatedUser } from "@/types/domain";
import { createContext } from "react";

export type AuthContextValue = {
  user: AuthenticatedUser | null;
  setUser: (user: AuthenticatedUser | null) => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);
