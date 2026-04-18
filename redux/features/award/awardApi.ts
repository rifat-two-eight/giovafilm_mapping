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
  }),
});

export const { useGetAwardsQuery } = awardApi;
