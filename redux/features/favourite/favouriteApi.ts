import { baseApi } from "@/redux/api/baseApi";

const favouriteApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addToFavourite: builder.mutation<void, any>({
      query: (body) => ({
        url: `/favourite`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Favourite"],
    }),

    getFavourites: builder.query<any, void>({
      query: () => ({
        url: `/favourite`,
        method: "GET",
      }),
      providesTags: ["Favourite"],
    }),
  }),
});

export const { useAddToFavouriteMutation, useGetFavouritesQuery } =
  favouriteApi;
