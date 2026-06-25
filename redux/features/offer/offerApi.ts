import { baseApi } from "@/redux/api/baseApi";

const offerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOffers: builder.query({
      query: ({ map = "" }: { map?: string } = {}) => `/offer${map ? `?map=${map}` : ""}`,
      providesTags: ["Offer"],
    }),
    getSingleOffer: builder.query({
      query: (id) => `/offer/${id}`,
      providesTags: (result, error, id) => [{ type: "Offer", id }],
    }),
    getOffersByPlaceOrBusinessId: builder.query({
      query: (id) => `/offer/by-place-or-business/${id}`,
      providesTags: ["Offer"],
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
    redeemOffer: builder.mutation({
      query: (id) => ({
        url: `/offer/${id}/redeem`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Offer", id }],
    }),
  }),
});

export const {
  useGetOffersQuery,
  useGetSingleOfferQuery,
  useGetOffersByPlaceOrBusinessIdQuery,

  useCreateOfferMutation,
  useDeleteOfferMutation,
  useUpdateOfferMutation,
  useRedeemOfferMutation,
} = offerApi;
