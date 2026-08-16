"use client";

import { useEffect } from "react";
import { getSocket } from "@/lib/socket";

export function SocketProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    getSocket();
  }, []);

  return <>{children}</>;
}
