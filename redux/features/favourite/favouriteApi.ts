import { baseApi } from "@/redux/api/baseApi";

const favouriteApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addToFavourite: builder.mutation<void, any>({
      query: (body) => ({
        url: `/favourite`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useAddToFavouriteMutation } = favouriteApi;
