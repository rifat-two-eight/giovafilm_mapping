import { baseApi } from "@/redux/api/baseApi";

type GetPlacesArgs = {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: string;
  map?: string;
};

const placeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPlaces: builder.query<any, GetPlacesArgs>({
      query: ({ page = 1, limit = 10, searchTerm = "", status = "", map = "" }) => ({
        url: `/place?page=${page}&limit=${limit}&searchTerm=${searchTerm}&status=${status}&map=${map}`,
        method: "GET",
      }),
      providesTags: ["Place"],
    }),
    createPlace: builder.mutation({
      query: (data) => ({
        url: "/place",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Place"],
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

export const { useGetPlacesQuery, useCreatePlaceMutation, useDeletePlaceMutation } = placeApi;
