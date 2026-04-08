import { baseApi } from "@/redux/api/baseApi";

const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCategory: builder.mutation({
      query: (data) => ({
        url: "/category",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),
    getCategories: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: `/category?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Category"],
    }),
  }),
});

export const { useCreateCategoryMutation, useGetCategoriesQuery } = categoryApi;
