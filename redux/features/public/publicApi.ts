import { baseApi } from "@/redux/api/baseApi";

export const publicApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPublicPlacesBusiness: builder.query({
      query: ({
        page = 1,
        limit = 10,
        searchTerm = "",
        status = "",
        map = "",
        sort = "",
        country = "",
      }) => ({
        url: `/map/discovery?page=${page}&limit=${limit}&searchTerm=${searchTerm}&status=${status}&map=${map}&sort=${sort}&country=${country}`,
        method: "GET",
      }),
      providesTags: ["Place"],
      transformResponse: (response: any) => response.data,
    }),
  }),
});

export const { useGetPublicPlacesBusinessQuery } = publicApi;
