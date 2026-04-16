import { baseApi } from "@/redux/api/baseApi";

const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createReview: builder.mutation({
      query: (data) => ({
        url: "/review",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Place", "Review"],
    }),
  }),
});

export const { useCreateReviewMutation } = reviewApi;
