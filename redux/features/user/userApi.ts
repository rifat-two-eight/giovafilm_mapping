import { baseApi } from "@/redux/api/baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => "/user/profile",
      providesTags: ["User"],
      transformResponse: (response: any) => response.data,
    }),

    getAllUsers: builder.query({
      query: (params) => ({
        url: "/user",
        method: "GET",
        params: params,
      }),
      providesTags: ["User"],
    }),

    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/user/profile",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    updateUserRole: builder.mutation({
      query: ({ userId, role }) => ({
        url: `/user/update-role/${userId}`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: ["User"],
    }),

    inviteUser: builder.mutation({
      query: (data) => ({
        url: "/user/invite",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetAllUsersQuery,
  useDeleteUserMutation,
  useUpdateUserRoleMutation,
  useInviteUserMutation,
} = userApi;

