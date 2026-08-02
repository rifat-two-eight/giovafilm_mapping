import { baseApi } from "@/redux/api/baseApi";

type GetAwardsArgs = {
  page?: number;
  limit?: number;
};

export const awardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAwards: builder.query<any, GetAwardsArgs>({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/awards/my-awards?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Award"],
    }),
    redeemFreeMap: builder.mutation({
      query: (data: { mapId: string }) => ({
        url: "/awards/redeem-free-map",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Award", "User", "Map", "Place", "Offer"],
    }),
    getAwardConfigs: builder.query<any, void>({
      query: () => ({
        url: "/awards/configs",
        method: "GET",
      }),
      providesTags: ["Award"],
    }),
    updateAwardConfig: builder.mutation({
      query: ({ id, data }) => ({
        url: `/awards/configs/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Award"],
    }),
  }),
});

export const {
  useGetAwardsQuery,
  useRedeemFreeMapMutation,
  useGetAwardConfigsQuery,
  useUpdateAwardConfigMutation,
} = awardApi;
