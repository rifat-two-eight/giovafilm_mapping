"use client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "@/redux/store";
import { Toaster } from "sonner";
import { CrossTabLogoutListener } from "@/components/shared/cross-tab-logout-listener";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <CrossTabLogoutListener />
        {children}
        <Toaster position="top-center" />
      </PersistGate>
    </Provider>
  );
}
