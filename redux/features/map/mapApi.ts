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
    getMaps: builder.query({
      query: ({ page = 1, limit = 10, searchTerm = "" } = {}) => ({
        url: `/map?page=${page}&limit=${limit}&searchTerm=${searchTerm}`,
        method: "GET",
      }),
      providesTags: ["Map"],
    }),
    updateMap: builder.mutation({
      query: ({ id, data }) => ({
        url: `/map/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Map"],
    }),
    deleteMap: builder.mutation({
      query: (id) => ({
        url: `/map/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Map"],
    }),
  }),
});

export const {
  useCreateMapMutation,
  useGetMapsQuery,
  useUpdateMapMutation,
  useDeleteMapMutation,
} = mapApi;
