import { apiSlice } from "../../app/api/apiSlice";

export const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategories: builder.query({
      query: () => "/categories",
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((c) => ({ type: "Category", id: c.id })),
              { type: "Category", id: "LIST" },
            ]
          : [{ type: "Category", id: "LIST" }],
      transformResponse: (response) =>
        response?.data?.map((category) => {
          return {
            id: category.id,
            categoryName: category.category_name,
            productCount: parseInt(category.product_count),
            active: category.active,
            dateCreated: category.created_at,
          };
        }),
    }),

    createCategory: builder.mutation({
      query: (newCategory) => ({
        url: "/categories",
        method: "POST",
        body: { ...newCategory },
      }),
      invalidatesTags: [{ type: "Category", id: "LIST" }],
    }),
    updateCategory: builder.mutation({
      query: ({ id, ...fields }) => ({
        url: `/categories/${id}`,
        method: "PATCH",
        body: fields,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Category", id: id },
        { type: "Category", id: "LIST" },
      ],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Category", id: id },
        { type: "Category", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} = categoryApiSlice;
