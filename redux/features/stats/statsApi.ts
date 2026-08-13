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
    getReports: builder.query<any, any>({
      query: (params) => ({
        url: "/stats/reports",
        method: "GET",
        params,
      }),
      providesTags: ["Stats"],
    }),
    searchReportEntities: builder.query<any, { searchTerm: string }>({
      query: ({ searchTerm }) => ({
        url: "/stats/reports/search",
        method: "GET",
        params: { searchTerm },
      }),
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetReportsQuery,
  useSearchReportEntitiesQuery,
} = statsApi;
