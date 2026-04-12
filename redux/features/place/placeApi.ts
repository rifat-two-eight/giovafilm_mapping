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
      query: ({
        page = 1,
        limit = 10,
        searchTerm = "",
        status = "",
        map = "",
      }) => ({
        url: `/place?page=${page}&limit=${limit}&searchTerm=${searchTerm}&status=${status}&map=${map}`,
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
  }),
});

export const {
  useGetPlacesQuery,
  useGetPlaceDetailsQuery,
  useCreatePlaceMutation,
  useUpdatePlaceMutation,
  useDeletePlaceMutation,
} = placeApi;
