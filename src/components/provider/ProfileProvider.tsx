"use client";

import { ProfileContextProvider } from "@/context/ProfileContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
      <ProfileContextProvider>{children}</ProfileContextProvider>
  );
}