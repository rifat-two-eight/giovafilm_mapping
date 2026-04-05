import { baseApi } from "@/redux/api/baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
        credentials: "include",
      }),
    }),

    // create new user
    register: builder.mutation({
      query: (userData) => ({
        url: "/auth/signup",
        method: "POST",
        body: userData,
      }),
    }),

    // OTP Verify
    verifyAccount: builder.mutation({
      query: (data: { email: string; oneTimeCode: string }) => ({
        url: "/auth/verify-account",
        method: "POST",
        body: data,
      }),
    }),

    // resend OTP
    resendOtp: builder.mutation({
      query: (data: { email: string; authType: string }) => ({
        url: "/auth/resend-otp",
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

    googleLogin: builder.mutation({
      query: (data: { token: string }) => ({
        url: "/auth/google",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyAccountMutation,
  useResendOtpMutation,
  useGetProfileQuery,
  useForgetPasswordMutation,
  useResetPasswordMutation,
  useGoogleLoginMutation,
} = authApi;
