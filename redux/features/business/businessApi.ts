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
  }),
});

export const { useGetBusinessesQuery, useAddBusinessMutation } = businessApi;
