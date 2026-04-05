import { baseApi } from "@/redux/api/baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => "/user/profile",
      providesTags: ["User"],
      transformResponse: (response: any) => response.data,
    }),
  }),
});

export const { useGetProfileQuery } = userApi;
