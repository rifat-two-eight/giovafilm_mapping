import { baseApi } from "@/redux/api/baseApi";

type GetPlacesArgs = {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: string;
  map?: string;
  sort?: string;
  country?: string;
  category?: string;
  lat?: number | string;
  lng?: number | string;
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
        category = "",
        lat,
        lng,
      }) => {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("limit", String(limit));
        if (searchTerm) params.set("searchTerm", searchTerm);
        if (status) params.set("status", status);
        if (map) params.set("map", map);
        if (sort) params.set("sort", sort);
        if (country) params.set("country", country);
        if (category) params.set("category", category);
        if (lat !== undefined && lat !== "" && lng !== undefined && lng !== "") {
          params.set("lat", String(lat));
          params.set("lng", String(lng));
        }
        return {
          url: `/place?${params.toString()}`,
          method: "GET",
        };
      },
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
  useLazyGetPlaceDetailsQuery,
  useCreatePlaceMutation,
  useUpdatePlaceMutation,
  useDeletePlaceMutation,
  useExtractCoordinatesMutation,
} = placeApi;
