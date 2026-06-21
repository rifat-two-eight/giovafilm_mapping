import { baseApi } from "@/redux/api/baseApi";

export const authApi = baseApi.injectEndpoints({
  overrideExisting: true,
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
      query: (data: { 
        email: string; 
        oneTimeCode: string; 
        password?: string; 
      }) => ({
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

    resetPassword: builder.mutation({
      query: ({
        token,
        ...data
      }: {
        token: string;
        newPassword: string;
        confirmPassword: string;
      }) => {
        return {
          url: "/auth/reset-password",
          method: "POST",
          body: data,
          headers: {
            Authorization: `${token}`,
          },
        };
      },
    }),

    googleLogin: builder.mutation({
      query: (data: { token: string }) => ({
        url: "/auth/google",
        method: "POST",
        body: data,
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyAccountMutation,
  useResendOtpMutation,
  useForgetPasswordMutation,
  useResetPasswordMutation,
  useGoogleLoginMutation,
  useLogoutMutation,
} = authApi;
