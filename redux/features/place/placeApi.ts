import { baseApi } from "@/redux/api/baseApi";

type GetPlacesArgs = {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: string;
  map?: string;
  sort?: string;
  country?: string;
};

const placeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPlaces: builder.query<any, GetPlacesArgs>({
      query: ({
        page = 1,
        limit = 10,
        searchTerm = "",
        status = "",
        map = "",
        sort = "",
        country = "",
      }) => ({
        url: `/place?page=${page}&limit=${limit}&searchTerm=${searchTerm}&status=${status}&map=${map}&sort=${sort}&country=${country}`,
        method: "GET",
      }),
      providesTags: ["Place"],
    }),
    getPlaceDetails: builder.query<any, string>({
      query: (id) => ({
        url: `/place/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Place", id }],
    }),
    createPlace: builder.mutation({
      query: (data) => ({
        url: "/place",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Place"],
    }),
    updatePlace: builder.mutation({
      query: ({ id, data }) => ({
        url: `/place/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Place", "Map"],
    }),
    deletePlace: builder.mutation({
      query: (id) => ({
        url: `/place/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Place"],
    }),
    extractCoordinates: builder.mutation({
      query: (data: { url: string }) => ({
        url: "/place/extract-coordinates",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetPlacesQuery,
  useGetPlaceDetailsQuery,
  useCreatePlaceMutation,
  useUpdatePlaceMutation,
  useDeletePlaceMutation,
  useExtractCoordinatesMutation,
} = placeApi;
