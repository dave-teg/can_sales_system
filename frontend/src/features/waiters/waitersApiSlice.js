import {apiSlice} from "../../app/api/apiSlice";

export const waitersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllWaiters: builder.query({
            query: () => '/waiters',
            providesTags: (result) =>
                result?.data
                    ? [
                        ...result.data.map((w) => ({type: 'Waiter', id: w.id})),
                        {type: 'Waiter', id: 'LIST'},
                    ]
                    : [{type: 'Waiter', id: 'LIST'}],
            transformResponse: (response) =>
                response?.data?.map((waiter) => {
                    return {
                        id: waiter.id,
                        fullname: waiter.fullname,
                        active: waiter.active,
                        dateCreated: waiter.created_at,
                    };
                }),
        }),
        createWaiter: builder.mutation({
            query: (data) => ({
                url: '/waiters',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [{type: 'Waiter', id: 'LIST'}],
        }),
        updateWaiter: builder.mutation({
            query: ({id, ...fields}) => ({
                url: `/waiters/${id}`,
                method: 'PATCH',
                body: fields,
            }),
            invalidatesTags: (result, error, {id}) => [
                {type: 'Waiter', id},
                {type: 'Waiter', id: 'LIST'},
            ],
        }),
    }),
});

export const {
    useGetAllWaitersQuery,
    useCreateWaiterMutation,
    useUpdateWaiterMutation
} = waitersApiSlice;