"use client";

import { useAppDispatch } from "@/redux/hook";
import { logout } from "@/redux/features/auth/authSlice";
import { baseApi } from "@/redux/api/baseApi";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LOGOUT_KEY = "app_logout_event";

/** Call this in the tab that performs the logout to signal all other tabs. */
export function broadcastLogout() {
  // Writing any value triggers the 'storage' event in every OTHER tab
  localStorage.setItem(LOGOUT_KEY, String(Date.now()));
}

/**
 * Mount this component once at the app root (inside the Redux Provider).
 * It listens for cross-tab logout signals and logs out the current tab.
 */
export function CrossTabLogoutListener() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === LOGOUT_KEY && e.newValue) {
        // Another tab just logged out — clear state here too
        dispatch(logout());
        dispatch(baseApi.util.resetApiState());
        router.push("/");
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [dispatch, router]);

  return null;
}
