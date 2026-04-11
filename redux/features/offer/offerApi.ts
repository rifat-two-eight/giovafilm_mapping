import { baseApi } from "@/redux/api/baseApi";

const offerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOffers: builder.query({
      query: () => "/offer",
      providesTags: ["Offer"],
    }),
    getSingleOffer: builder.query({
      query: (id) => `/offer/${id}`,
      providesTags: (result, error, id) => [{ type: "Offer", id }],
    }),
    createOffer: builder.mutation({
      query: (data) => ({
        url: "/offer",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Offer"],
    }),
    deleteOffer: builder.mutation({
      query: (id) => ({
        url: `/offer/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Offer"],
    }),
    updateOffer: builder.mutation({
      query: ({ id, data }) => ({
        url: `/offer/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Offer"],
    }),
  }),
});

export const {
  useGetOffersQuery,
  useGetSingleOfferQuery,
  useCreateOfferMutation,
  useDeleteOfferMutation,
  useUpdateOfferMutation,
} = offerApi;