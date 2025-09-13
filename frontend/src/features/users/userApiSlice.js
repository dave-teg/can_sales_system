import { apiSlice } from "../../app/api/apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => "/users",
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((u) => ({ type: "User", id: u.id })),
              { type: "User", id: "LIST" },
            ]
          : [{ type: "User", id: "LIST" }],
      transformResponse: (response) =>
        response?.data.map((user) => {
          return {
            id: user.id,
            fullname: user.fullname,
            username: user.username,
            role: user.role,
            active: user.active,
            dateCreated: user.created_at,
          };
        }),
    }),
    updateUser: builder.mutation({
      query: ({ id, ...fields }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body: fields,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
      ],
    }),
    deactivateUsr: builder.mutation({
      query: (id) => ({
        url: `/users/deactivate/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "User", id: id },
        { type: "User", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useDeactivateUsrMutation,
  useUpdateUserMutation
} = userApiSlice;
