import asyncHandler from "express-async-handler";
import {
  placeOrderService,
  getAllPaginatedOrdersService,
  getOrderItemsForOrderService,
  getPaginatedOrdersByUserService,
  verifyOrderOwnershipService,
  getRecentOrdersService,
  getOrderByIdService
} from "../models/orderModel.js";

//@desc Get all orders paginated
//@route GET /api/orders
//access Private/Admin
export const getAllOrders = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10

  const { orders, rowCount, totalPages } = await getAllPaginatedOrdersService(page,limit);

  if (!orders.length) {
    return res.json({ message: "No orders found" });
  }

  res.json({
    data: orders,
    pageInfo: { page, pageSize: limit, totalPages, totalRowCount: rowCount },
  });
});

//@desc Get recent orders
//@route GET /api/orders/recent
//access Private
export const getRecentOrders = asyncHandler(async (req, res) => {

  const recentOrders = await getRecentOrdersService();

  if (!recentOrders.length) {
    return res.json({ message: "No orders found" });
  }

  res.json({recentOrders });
});


//@desc Get paginated orders for current user
//@route GET /api/orders/my-orders
//access Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10

  const { orders, rowCount, totalPages } = await getPaginatedOrdersByUserService(page,limit, userId);

  if (!orders.length) {
    return res.status(404).json({ message: "No orders found" });
  }

  res.json({
    data: orders,
    pageInfo: { page, pageSize: limit, totalPages, totalRowCount: rowCount },
  });
});


//@desc Get order items for a specific order
//@route GET /api/orders/:orderId/items
//access Private
export const getOrderItemsForOrder = asyncHandler(async (req, res) => {
  const {orderId} = req.params;
  const userId = req.user.id;

  if(!orderId) {
    return res.status(400).json({message: "Order id is required"})
  }

  /* //verify order ownership
  const order = await verifyOrderOwnershipService(orderId, userId);
  if(!order) {
    return res.status(403).json({message: "Not authorized to access this order or order does not exist"})
  } */

  const orderItems = await getOrderItemsForOrderService(orderId)
  

  if(!orderItems.orderSummary.length || !orderItems.totalPrice.length) {
    return res.status(404).json({message: "Order items not found"})
  }

  res.json({data: orderItems})
    
})


//@desc Place an order
//@route POST /api/orders
//access Private
export const placeOrder = asyncHandler(async (req, res) => {
    const userId = req.user.id;


    const { cartItems, waiterId} = req.body;

    if(!Array.isArray(cartItems) || !cartItems.length) {
      return res.status(400).json({message: "Cart Items are required and must be non empty array"})
    }

    if(!waiterId) {
      return res.status(400).json({message: "Waiter id is required"})
    }

    const {orderId, totalPrice, orderMetaResult, orderItemsResult} = await placeOrderService(userId, waiterId, cartItems)

    res.status(201).json({message: "Order placed successfully", data: {orderId, totalPrice, orderMetaResult, orderItemsResult}})
})


//@desc Get order by orderId
//@route GET /api/orders/:orderId
//access Private
export const getOrderById = asyncHandler(async (req, res) => {
  const {orderId} = req.params;
  
  if(!orderId) {
    return res.status(400).json({message: "Order id is required"})
  } 

  const {orderItems, orderMeta} = await getOrderByIdService(orderId)

  if(!orderItems.length || !orderMeta) {
    return res.status(404).json({message: "Order not found"})
  }

  res.json({data: {orderItems, orderMeta}})
})