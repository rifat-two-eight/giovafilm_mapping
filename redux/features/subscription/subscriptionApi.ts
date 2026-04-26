import { baseApi } from "@/redux/api/baseApi";

const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubscriptionPlans: builder.query<any, void>({
      query: () => ({
        url: "/subscription/plans",
        method: "GET",
      }),
      providesTags: ["Subscription"],
    }),
    createCheckoutSession: builder.mutation({
      query: (data) => ({
        url: "/subscription/checkout-session",
        method: "POST",
        body: data,
      }),
    }),
    getMySubscription: builder.query<any, void>({
      query: () => ({
        url: "/subscription/my-subscription",
        method: "GET",
      }),
      providesTags: ["Subscription"],
    }),
  }),
});

export const { 
  useGetSubscriptionPlansQuery, 
  useCreateCheckoutSessionMutation,
  useGetMySubscriptionQuery
} = subscriptionApi;
