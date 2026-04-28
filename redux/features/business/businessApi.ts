import { baseApi } from "@/redux/api/baseApi";

type GetBusinessesArgs = {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: string;
};

const businessApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBusinesses: builder.query<any, GetBusinessesArgs>({
      query: ({ page = 1, limit = 10, searchTerm = "", status = "" }) => ({
        url: `/business?page=${page}&limit=${limit}&searchTerm=${searchTerm}&status=${status}`,
        method: "GET",
      }),
      providesTags: ["Business"],
    }),
    addBusiness: builder.mutation({
      query: (data) => ({
        url: "/business",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Business"],
    }),

    getSingleBusiness: builder.query<any, string>({
      query: (id) => `/business/${id}`,
      providesTags: ["Business"],
    }),

    updateBusinessStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/business/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Business"],
    }),

    updateAccuracyVerifiedStatus: builder.mutation({
      query: ({ id, isAccuracyVerified }) => ({
        url: `/business/${id}`,
        method: "PATCH",
        body: { isAccuracyVerified },
      }),
      invalidatesTags: ["Business"],
    }),

    updateBusiness: builder.mutation({
      query: ({ id, data }) => ({
        url: `/business/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Business"],
    }),

    deleteBusiness: builder.mutation({
      query: (id) => ({
        url: `/business/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Business"],
    }),
    getMyBusinesses: builder.query<any, void>({
      query: () => ({
        url: "/business/my-business",
        method: "GET",
      }),
      providesTags: ["Business"],
    }),
  }),
});

export const {
  useGetBusinessesQuery,
  useAddBusinessMutation,
  useGetSingleBusinessQuery,
  useUpdateBusinessStatusMutation,
  useUpdateAccuracyVerifiedStatusMutation,
  useUpdateBusinessMutation,
  useDeleteBusinessMutation,
  useGetMyBusinessesQuery,
} = businessApi;
