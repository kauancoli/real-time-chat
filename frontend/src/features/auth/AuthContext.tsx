import { AuthenticatedUser } from "@/types/domain";
import { ReactNode, useState } from "react";
import { AuthContext } from "./context";
import { getStoredUser, removeStoredUser, saveStoredUser } from "./storage";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AuthenticatedUser | null>(
    getStoredUser,
  );

  const setUser = (nextUser: AuthenticatedUser | null) => {
    setUserState(nextUser);
    if (nextUser) saveStoredUser(nextUser);
    else removeStoredUser();
  };

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
