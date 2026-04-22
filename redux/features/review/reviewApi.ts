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
    getMyReviews: builder.query({
      query: () => "/review/my-reviews",
      providesTags: ["Review"],
      transformResponse: (response: any) => response.data,
    }),
    updateReview: builder.mutation({
      query: ({ id, data }) => ({
        url: `/review/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Review", "Place"],
    }),
  }),
});

export const {
  useCreateReviewMutation,
  useGetMyReviewsQuery,
  useUpdateReviewMutation,
} = reviewApi;
