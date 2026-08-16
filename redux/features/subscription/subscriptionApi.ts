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
    verifySubscriptionCheckout: builder.mutation({
      query: (sessionId: string) => ({
        url: `/subscription/verify-checkout?sessionId=${encodeURIComponent(sessionId)}`,
        method: "GET",
      }),
      invalidatesTags: ["Subscription", "Business"],
    }),
    getMySubscription: builder.query<any, void>({
      query: () => ({
        url: "/subscription/my-subscription",
        method: "GET",
      }),
      providesTags: ["Subscription"],
    }),
    createSubscriptionPlan: builder.mutation({
      query: (data) => ({
        url: "/subscription/admin/plans",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Subscription"],
    }),
    updateSubscriptionPlan: builder.mutation({
      query: ({ id, data }) => ({
        url: `/subscription/admin/plans/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Subscription"],
    }),
    deleteSubscriptionPlan: builder.mutation({
      query: (id) => ({
        url: `/subscription/admin/plans/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Subscription"],
    }),
    cancelSubscription: builder.mutation<
      any,
      { subscriptionId: string; token: string }
    >({
      query: ({ subscriptionId, token }) => {
        return {
          url: `/subscription/${subscriptionId}/cancel`,
          method: "DELETE",
          headers: {
            Authorization: token,
          },
        };
      },
      invalidatesTags: ["Subscription"],
    }),
  }),
});

export const {
  useGetSubscriptionPlansQuery,
  useCreateCheckoutSessionMutation,
  useVerifySubscriptionCheckoutMutation,
  useGetMySubscriptionQuery,
  useCancelSubscriptionMutation,
  useCreateSubscriptionPlanMutation,
  useUpdateSubscriptionPlanMutation,
  useDeleteSubscriptionPlanMutation,
} = subscriptionApi;
