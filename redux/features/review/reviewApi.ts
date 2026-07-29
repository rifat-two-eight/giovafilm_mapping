import { baseApi } from "@/redux/api/baseApi";

const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createReview: builder.mutation({
      query: (data) => ({
        url: "/review",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Place", "Review", "User", "Award"],
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
      invalidatesTags: ["Review", "Place", "User", "Award"],
    }),
    getReviewsByPlace: builder.query({
      query: (placeId: string) => `/review/${placeId}/place`,
      providesTags: ["Review"],
      transformResponse: (response: any) => response.data,
    }),
    getPendingReviews: builder.query({
      query: () => "/review?status=Pending",
      providesTags: ["Review"],
      transformResponse: (response: any) => response.data,
    }),
    approveReview: builder.mutation({
      query: (id: string) => ({
        url: `/review/approve/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Review", "Place", "User", "Award"],
    }),
    rejectReview: builder.mutation({
      query: (id: string) => ({
        url: `/review/reject/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Review", "Place", "User", "Award"],
    }),
  }),
});

export const {
  useCreateReviewMutation,
  useGetMyReviewsQuery,
  useUpdateReviewMutation,
  useGetReviewsByPlaceQuery,
  useGetPendingReviewsQuery,
  useApproveReviewMutation,
  useRejectReviewMutation,
} = reviewApi;
