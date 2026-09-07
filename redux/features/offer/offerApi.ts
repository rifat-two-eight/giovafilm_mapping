import { baseApi } from "@/redux/api/baseApi";

const offerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOffers: builder.query({
      query: (params: Record<string, any> = {}) => {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            queryParams.append(key, String(value));
          }
        });
        const queryString = queryParams.toString();
        return `/offer${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: ["Offer"],
      keepUnusedDataFor: 180, // cache for 3 minutes
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
      invalidatesTags: ["Offer", "Business"],
    }),
    deleteOffer: builder.mutation({
      query: (id) => ({
        url: `/offer/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Offer", "Business"],
    }),
    updateOffer: builder.mutation({
      query: ({ id, data }) => ({
        url: `/offer/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Offer", "Business"],
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
