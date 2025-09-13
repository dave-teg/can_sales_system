import { pool, query } from "../../db/db.js";

export const placeOrderService = async (userId, waiterId, cartItems) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    //Get product prices
    //we can't trust prices from frontend for security reasons so we have to fetch it from db
    const productIds = cartItems.map((item) => item.product_id);
    const result = await client.query(
      "SELECT id, price FROM products WHERE id = ANY($1);",
      [productIds]
    );

    const priceMap = Object.fromEntries(
      result.rows.map((p) => [p.id, p.price])
    );

    //calculate total
    let totalPrice = 0;
    cartItems.forEach((item) => {
      const unitPrice = priceMap[item.product_id];
      if (!unitPrice) throw new Error("Invalid product");
      totalPrice += unitPrice * item.quantity;
    });

    //insert order
    const orderResult = await client.query(
      "INSERT INTO orders (user_id, waiter_id, total_price) VALUES ($1, $2, $3) RETURNING *;",
      [userId, waiterId, totalPrice]
    );
    const orderId = orderResult.rows[0].id;

    //insert order items
    for (const item of cartItems) {
      await client.query(
        "INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES ($1, $2, $3, $4)",
        [orderId, item.product_id, item.quantity, priceMap[item.product_id]]
      );
    }

    //get order meta result
    const orderMetaResult = await client.query(
      `SELECT 
          o.total_price, o.invoice_number, o.created_at,
          u.fullname AS cashier_name,
          w.fullname AS waiter_name
       FROM orders o
       JOIN users u ON o.user_id = u.id
        JOIN waiters w ON o.waiter_id = w.id
       WHERE o.id = $1;`,
      [orderId]
    );

    //get order items result 
    const orderItemsResult = await client.query(
      ` SELECT 
      p.name AS product_name,
      oi.id AS order_item_id,
      oi.quantity AS quantity,
      oi.unit_price,
      (oi.unit_price * oi.quantity) AS item_total
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = $1;
      `, [orderId]);

    await client.query("COMMIT");
    return { orderId, totalPrice, orderMetaResult: orderMetaResult.rows[0], orderItemsResult: orderItemsResult.rows };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

export const getPaginatedOrdersByUserService = async (
  page = 1,
  limit = 10,
  userId
) => {
  const offset = (page - 1) * limit;
  const queryTxt = `
    SELECT o.id AS order_id, o.invoice_number, u.username AS cashier_name, u.role AS role, o.total_price, o.created_at,
    w.fullname AS waiter_name,
    COALESCE(SUM(oi.quantity), 0) AS total_items
    FROM orders o
    JOIN users u ON o.user_id = u.id
    LEFT JOIN waiters w ON o.waiter_id = w.id
    LEFT JOIN order_items oi ON o.id = oi.order_id
    WHERE o.user_id = $1
    GROUP BY o.id, u.username, u.role, w.fullname
    ORDER BY o.created_at DESC
    LIMIT $2 OFFSET $3;
    `;
  const values = [userId, limit, offset];
  const orderResult = await query(queryTxt, values);

  const { rows } = await query(
    "SELECT COUNT(*) FROM orders WHERE user_id = $1;",
    [userId]
  );
  const rowCount = parseInt(rows[0].count, 10);
  const totalPages = Math.ceil(rowCount / limit);

  return { orders: orderResult.rows, rowCount, totalPages };
};

export const getAllPaginatedOrdersService = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  const queryTxt = `
    SELECT o.id AS order_id, o.invoice_number, u.fullname AS cashier_name, u.active, u.role AS role, o.total_price, o.created_at,
    w.fullname AS waiter_name,
    COALESCE(SUM(oi.quantity), 0) AS total_items
    FROM orders o
    JOIN users u ON o.user_id = u.id
    LEFT JOIN waiters w ON o.waiter_id = w.id
    LEFT JOIN order_items oi ON o.id = oi.order_id
    GROUP BY o.id, u.fullname, u.role, u.active, w.fullname
    ORDER BY o.created_at DESC
    LIMIT $1 OFFSET $2;
    `;
  const values = [limit, offset];
  const orderResult = await query(queryTxt, values);

  const { rows } = await query("SELECT COUNT(*) FROM orders;");
  const rowCount = parseInt(rows[0].count, 10);
  const totalPages = Math.ceil(rowCount / limit);

  return { orders: orderResult.rows, rowCount, totalPages };
};

export const getRecentOrdersService = async () => {
  const queryTxt = `
    SELECT o.id AS order_id, u.fullname AS cashier_name, u.role AS role, o.total_price, o.created_at,
    w.fullname AS waiter_name,
    COALESCE(SUM(oi.quantity), 0) AS total_items
    FROM orders o
    JOIN users u ON o.user_id = u.id
    LEFT JOIN waiters w ON o.waiter_id = w.id
    LEFT JOIN order_items oi ON o.id = oi.order_id
    GROUP BY o.id, u.fullname, u.role, w.fullname
    ORDER BY o.created_at DESC
    LIMIT 10;
    `;
  const result = await query(queryTxt);
  return result.rows;
};

export const getOrderItemsForOrderService = async (orderId) => {
  const orderSummaryQuery = `
SELECT
  p.name AS product_name,
  c.name AS category_name,
  oi.id,
  oi.unit_price,
  oi.quantity,
  (oi.unit_price * oi.quantity) AS item_total
FROM order_items oi
JOIN products p ON oi.product_id = p.id
JOIN categories c ON p.category_id = c.id
WHERE oi.order_id = $1;
  `;
  const totalPriceQuery = `
    SELECT
    SUM(oi.unit_price * oi.quantity) AS order_total
    FROM order_items oi
    WHERE oi.order_id = $1;
  `;
  const values = [orderId];
  const orderSummaryResult = await query(orderSummaryQuery, values);
  const totalPriceResult = await query(totalPriceQuery, values);
  return {
    orderSummary: orderSummaryResult.rows,
    totalPrice: totalPriceResult.rows,
  };
};

export const verifyOrderOwnershipService = async (orderId, userId) => {
  const queryText = `
      SELECT id, user_id 
      FROM orders 
      WHERE id = $1 AND user_id = $2
      LIMIT 1;
    `;
  const values = [orderId, userId];
  const result = await query(queryText, values);

  if (result.rows.length === 0) {
    return false;
  }

  return result.rows[0];
};

export const getOrderByIdService = async (orderId) => {
  const orderItemsQuery = `
    SELECT 
      p.name AS product_name,
      oi.id AS order_item_id,
      oi.quantity AS quantity,
      oi.unit_price,
      (oi.unit_price * oi.quantity) AS item_total
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = $1;`;

  const orderMetaQuery = `
    SELECT
      o.total_price,
      o.invoice_number,
      o.created_at,
      u.fullname AS cashier_name,
      w.fullname AS waiter_name
    FROM orders o
    JOIN users u ON o.user_id = u.id
    LEFT JOIN waiters w ON o.waiter_id = w.id
    WHERE o.id =  $1;
  `;

  const values = [orderId];
  const orderItemsResult = await query(orderItemsQuery, values);
  const orderMetaResult = await query(orderMetaQuery, values);

  return {
    orderItems: orderItemsResult.rows,
    orderMeta: orderMetaResult.rows[0],
  };
};
