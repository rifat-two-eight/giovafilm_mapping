import { baseApi } from "@/redux/api/baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => "/user/profile",
      providesTags: ["User"],
      transformResponse: (response: any) => response.data,
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/user/profile",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useGetProfileQuery, useUpdateProfileMutation } = userApi;
