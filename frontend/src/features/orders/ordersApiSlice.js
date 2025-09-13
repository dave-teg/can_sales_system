import { apiSlice } from "../../app/api/apiSlice";

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrders: builder.query({
      query: ({ page = 1, limit = 10 }) =>
        `/orders?page=${page}&limit=${limit}`,
      providesTags: ["AllOrders"],
      transformResponse: (response) => ({
        orderRows: response?.data?.map((order) => {
          return {
            id: order.order_id,
            handledBy: order.cashier_name,
            waiter: order.waiter_name,
            role: order.role,
            totalItems: order.total_items,
            price: order.total_price,
            dateCreated: order.created_at,
            invoiceNo: order.invoice_number,
            active: order.active
          };
        }),
        pageInfo: response.pageInfo,
      }),
    }),
    getRecentOrders: builder.query({
      query: () => "/orders/recent",
      providesTags: ["RecentOrders"],
      transformResponse: (response) =>
        response?.recentOrders?.map((order) => {
          return {
            id: order.order_id,
            handledBy: order.cashier_name,
            waiter: order.waiter_name,
            role: order.role,
            totalItems: order.total_items,
            price: parseInt(order.total_price),
            dateCreated: order.created_at,
          };
        }),
    }),
    getMyOrders: builder.query({
      query: ({ page = 1, limit = 10 }) =>
        `/orders/my-orders?page=${page}&limit=${limit}`,
      providesTags: ["MyOrders"],
      transformResponse: (response) => ({
        orderRows: response?.data?.map((order) => {
          return {
            id: order.order_id,
            totalItems: order.total_items,
            waiter: order.waiter_name,
            price: order.total_price,
            dateCreated: order.created_at,
            invoiceNo: order.invoice_number
          };
        }),
        pageInfo: response.pageInfo,
      }),
    }),
    getOrderItems: builder.query({
      query: (orderId) => `/orders/${orderId}/items`,
      providesTags: (result, error, id) => [{ type: "OrderItems", id }],
      transformResponse: (response) => ({
        orderItemsRow: response?.data?.orderSummary.map(order => {
          return {
            id: order.id,
            productName: order.product_name,
            categoryName: order.category_name,
            quantity: order.quantity,
            unit_price: order.unit_price,
            total: parseInt(order.item_total)
          }
        }),
        totalPrice: response?.data.totalPrice[0].order_total
      })
    }),
    placeOrder: builder.mutation({
      query: (data) => ({
        url: "/orders",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AllOrders", "RecentOrders", "MyOrders"],
    }),
    printOrder: builder.mutation({
      query: (orderId) => ({
        url: `/print/${orderId}`,
        method: "POST",
      })
    }),
    getOrderById: builder.query({
      query: (orderId) => `/orders/${orderId}`,
    })
  }),
});

export const {
  useGetAllOrdersQuery,
  useGetMyOrdersQuery,
  useGetOrderItemsQuery,
  useGetRecentOrdersQuery,
  usePlaceOrderMutation,
  usePrintOrderMutation,
  useGetOrderByIdQuery
} = orderApiSlice;
