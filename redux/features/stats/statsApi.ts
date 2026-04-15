import { baseApi } from "@/redux/api/baseApi";

const statsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<any, void>({
      query: () => ({
        url: "/stats/dashboard",
        method: "GET",
      }),
      providesTags: ["Stats"],
    }),
    getReports: builder.query<any, void>({
      query: () => ({
        url: "/stats/reports",
        method: "GET",
      }),
      providesTags: ["Stats"],
    }),
  }),
});

export const { useGetDashboardStatsQuery, useGetReportsQuery } = statsApi;
