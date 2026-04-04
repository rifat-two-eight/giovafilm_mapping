import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";

export const roles = {
  ADMIN: "admin" as const,
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
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
    },
  },
});

export const { setUser, setAccessToken, logout } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectAccessToken = (state: RootState) => state.auth.accessToken;
