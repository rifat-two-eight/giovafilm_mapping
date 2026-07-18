import { baseApi } from "@/redux/api/baseApi";

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createMapCheckoutSession: builder.mutation({
      query: (data) => ({
        url: "/payment/create-checkout-session",
        method: "POST",
        body: data,
      }),
    }),
    verifyCheckoutSession: builder.query({
      query: (sessionId) => ({
        url: `/payment/verify-checkout/${sessionId}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateMapCheckoutSessionMutation,
  useVerifyCheckoutSessionQuery,
} = paymentApi;
