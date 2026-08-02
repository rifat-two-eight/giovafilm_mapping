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
      // After verify succeeds, drop cached user/map/place so locks refresh
      async onQueryStarted(_sessionId, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            baseApi.util.invalidateTags(["User", "Map", "Place", "Offer"]),
          );
        } catch {
          /* verification failed — leave cache as-is */
        }
      },
    }),
  }),
});

export const {
  useCreateMapCheckoutSessionMutation,
  useVerifyCheckoutSessionQuery,
} = paymentApi;
