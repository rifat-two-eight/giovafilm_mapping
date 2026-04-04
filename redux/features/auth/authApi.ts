import { baseApi } from "@/redux/api/baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials: { email: string; password: string }) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
        credentials: "include",
      }),
    }),
    signup: builder.mutation({
      query: (userData: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        role: string;
      }) => ({
        url: "/auth/signup",
        method: "POST",
        body: userData,
      }),
    }),
    verifyAccount: builder.mutation({
      query: (data: { email: string; oneTimeCode: string }) => ({
        url: "/auth/verify-account",
        method: "POST",
        body: data,
      }),
    }),

    forgetPassword: builder.mutation({
      query: (data: { email: string }) => ({
        url: "/auth/forget-password",
        method: "POST",
        body: data,
      }),
    }),

    resendOtp: builder.mutation({
      query: (data: { email: string; authType: string }) => ({
        url: "/auth/resend-otp",
        method: "POST",
        body: data,
      }),
    }),
    getProfile: builder.query({
      query: () => "/profile",
    }),
    resetPassword: builder.mutation({
      query: ({
        token,
        ...data
      }: {
        token: string;
        newPassword: string;
        confirmPassword: string;
      }) => ({
        url: `/auth/reset-password?token=${token}`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useVerifyAccountMutation,
  useResendOtpMutation,
  useGetProfileQuery,
  useForgetPasswordMutation,
  useResetPasswordMutation,
} = authApi;
