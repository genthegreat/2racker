"use client";

import { AuthProvider } from "@/context/AuthContext";

// import { ProfileContextProvider } from "@/context/ProfileContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
      <AuthProvider>{children}</AuthProvider>
      // <ProfileContextProvider>{children}</ProfileContextProvider>
  );
}