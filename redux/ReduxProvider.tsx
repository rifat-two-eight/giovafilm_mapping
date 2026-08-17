"use client";
import { useLayoutEffect } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "@/redux/store";
import { Toaster } from "sonner";
import { CrossTabLogoutListener } from "@/components/shared/cross-tab-logout-listener";
import { useAppSelector } from "@/redux/hook";
import {
  selectAccessToken,
  selectCurrentUser,
  syncAuthCookies,
} from "@/redux/features/auth/authSlice";

function AuthCookieSync() {
  const accessToken = useAppSelector(selectAccessToken);
  const role = useAppSelector(selectCurrentUser)?.role;

  useLayoutEffect(() => {
    if (!accessToken) return;
    syncAuthCookies(accessToken, role);
  }, [accessToken, role]);

  return null;
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthCookieSync />
        <CrossTabLogoutListener />
        {children}
        <Toaster position="top-center" />
      </PersistGate>
    </Provider>
  );
}
