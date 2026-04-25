import { baseApi } from "@/redux/api/baseApi";

type GetMapsArgs = {
  page?: number;
  limit?: number;
  searchTerm?: string;
};

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
    getMaps: builder.query<any, GetMapsArgs>({
      query: ({ page = 1, limit = 10, searchTerm = "" } = {}) => ({
        url: `/map?page=${page}&limit=${limit}&searchTerm=${searchTerm}`,
        method: "GET",
      }),
      providesTags: ["Map"],
    }),
    getMapById: builder.query<any, string>({
      query: (id: string) => ({
        url: `/map/${id}`,
        method: "GET",
      }),
      providesTags: ["Map"],
    }),
    updateMap: builder.mutation({
      query: ({ id, data }: { id: string; data: any }) => ({
        url: `/map/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Map"],
    }),
    updateMapStatus: builder.mutation({
      query: ({ id, data }: { id: string; data: any }) => ({
        url: `/map/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Map"],
    }),
    deleteMap: builder.mutation({
      query: (id: string) => ({
        url: `/map/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Map"],
    }),
    getAvailableCountries: builder.query<any, void>({
      query: () => ({
        url: "/map/available-countries",
        method: "GET",
      }),
      providesTags: ["Map"],
      transformResponse: (response: any) => response.data,
    }),
  }),
});

export const {
  useCreateMapMutation,
  useGetMapsQuery,
  useGetMapByIdQuery,
  useUpdateMapMutation,
  useUpdateMapStatusMutation,
  useDeleteMapMutation,
  useGetAvailableCountriesQuery,
} = mapApi;
