import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";

export const roles = {
  ADMIN: "admin" as const,
  SUPER_ADMIN: "superadmin" as const,
  USER: "business" as const,
};

export type Role = (typeof roles)[keyof typeof roles];

export type TUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  image: string;
};

type AuthState = {
  user: TUser | null;
  accessToken: string | null;
};

const initialState: AuthState = {
  user: null,
  accessToken: null,
};

// ── Cookie helpers (client-side only) ──────────────────────────────
function setCookie(name: string, value: string, days = 10) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function removeCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{
        user: TUser;
        accessToken: string;
      }>,
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      // Sync token and role to cookies
      setCookie("accessToken", action.payload.accessToken);
      setCookie("userRole", action.payload.user.role);
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      setCookie("accessToken", action.payload);
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      removeCookie("accessToken");
      removeCookie("userRole");
    },
  },
});

export const { setUser, setAccessToken, logout } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectAccessToken = (state: RootState) => state.auth.accessToken;
