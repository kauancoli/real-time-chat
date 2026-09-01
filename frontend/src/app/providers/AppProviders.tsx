import { AuthProvider } from "@/features/auth/AuthContext";
import { ReactNode } from "react";
import { SocketProvider } from "./SocketProvider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <SocketProvider>{children}</SocketProvider>
    </AuthProvider>
  );
}
