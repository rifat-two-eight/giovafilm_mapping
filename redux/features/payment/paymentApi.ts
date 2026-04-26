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
  }),
});

export const { useCreateMapCheckoutSessionMutation } = paymentApi;
