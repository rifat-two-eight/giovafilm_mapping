import { baseApi } from "@/redux/api/baseApi";

const businessApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addBusiness: builder.mutation({
      query: (data) => ({
        url: "/business",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useAddBusinessMutation } = businessApi;
