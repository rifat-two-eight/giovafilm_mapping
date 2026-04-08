import { baseApi } from "@/redux/api/baseApi";

const mapApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createMap: builder.mutation({
      query: (data) => ({
        url: "/map",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Map"],
    }),
  }),
});

export const { useCreateMapMutation } = mapApi;
