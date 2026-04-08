import { baseApi } from "@/redux/api/baseApi";

type GetPlacesArgs = {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: string;
};

const placeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPlaces: builder.query<any, GetPlacesArgs>({
      query: ({ page = 1, limit = 10, searchTerm = "", status = "" }) => ({
        url: `/place?page=${page}&limit=${limit}&searchTerm=${searchTerm}&status=${status}`,
        method: "GET",
      }),
      providesTags: ["Place"],
    }),
    deletePlace: builder.mutation({
      query: (id) => ({
        url: `/place/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Place"],
    }),
  }),
});

export const { useGetPlacesQuery, useDeletePlaceMutation } = placeApi;
