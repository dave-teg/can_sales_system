import { query } from "../../db/db.js";

export const getTodaySalesService = async () => {
  const queryTxt = `
  SELECT COUNT(*) AS order_count,
  COALESCE(SUM(total_price), 0) AS total_sales
  FROM orders
  WHERE DATE(created_at) = CURRENT_DATE;`;
  const result = await query(queryTxt);
  return result.rows[0];
};

export const getWeeklySalesService = async () => {
  const weeklySalesQuery = `
  SELECT
  date::date AS sales_date,
  COUNT(o.id) AS order_count,
  COALESCE(SUM(o.total_price), 0) AS total_sales
  FROM
    generate_series(
      CURRENT_DATE - INTERVAL '6 days',
      CURRENT_DATE,
      INTERVAL '1 day'
    ) AS date
  LEFT JOIN orders o ON date::date = o.created_at::date
  GROUP BY date
  ORDER BY sales_date;
  `;
  /* 
  const trendQuery = `
    WITH this_week AS (
      SELECT COALESCE(SUM(total_price), 0) AS total_sales
      FROM orders
      WHERE created_at::date BETWEEN CURRENT_DATE - INTERVAL '6 days' AND CURRENT_DATE
    ),
    last_week AS (
      SELECT COALESCE(SUM(total_price), 0) AS total_sales
      FROM orders
      WHERE created_at::date BETWEEN CURRENT_DATE - INTERVAL '13 days' AND CURRENT_DATE - INTERVAL '7 days'
    )
    SELECT
      CASE
        WHEN last_week.total_sales = 0 THEN NULL
        ELSE ROUND(((this_week.total_sales - last_week.total_sales) / last_week.total_sales) * 100, 2)
      END AS trend_percent
    FROM this_week, last_week;
  `; */
  const trendQuery = `
  WITH this_week AS (
    SELECT COALESCE(SUM(total_price), 0) AS total_sales
    FROM orders
    WHERE created_at::date BETWEEN CURRENT_DATE - INTERVAL '6 days' AND CURRENT_DATE
),
last_week AS (
    SELECT COALESCE(SUM(total_price), 0) AS total_sales
    FROM orders
    WHERE created_at::date BETWEEN CURRENT_DATE - INTERVAL '13 days' AND CURRENT_DATE - INTERVAL '7 days'
)
SELECT
    ROUND(
        CASE
            WHEN last_week.total_sales = 0 AND this_week.total_sales = 0 THEN 0
            WHEN last_week.total_sales = 0 THEN 100
            ELSE ((this_week.total_sales - last_week.total_sales) / last_week.total_sales) * 100
        END
    , 2) AS trend_percent
FROM this_week, last_week;
`;

  const totalSalesWeeklyQuery = `
  SELECT
  COALESCE(SUM(total_price), 0) AS total_sales
FROM orders
WHERE created_at::date BETWEEN CURRENT_DATE - INTERVAL '6 days' AND CURRENT_DATE;
`;

  const weeklySalesResult = await query(weeklySalesQuery);
  const trendResult = await query(trendQuery);
  const totalSalesResult = await query(totalSalesWeeklyQuery);

  return {
    weeklySales: weeklySalesResult.rows,
    trend: trendResult.rows[0].trend_percent,
    totalSales: totalSalesResult.rows[0],
  };
};

export const getMonthlySalesService = async () => {
  const monthlySalesQuery = `
    SELECT
      date::date AS sales_date,
      COUNT(o.id) AS order_count,
      COALESCE(SUM(o.total_price), 0) AS total_sales
    FROM
      generate_series(
        CURRENT_DATE - INTERVAL '29 days',
        CURRENT_DATE,
        INTERVAL '1 day'
      ) AS date
    LEFT JOIN orders o ON date::date = o.created_at::date
    GROUP BY date
    ORDER BY sales_date;
  `;
  /* 
  const monthlyTrendQuery = `
    WITH current_month AS (
      SELECT COALESCE(SUM(total_price), 0) AS total_sales
      FROM orders
      WHERE created_at::date BETWEEN CURRENT_DATE - INTERVAL '29 days' AND CURRENT_DATE
    ),
    previous_month AS (
      SELECT COALESCE(SUM(total_price), 0) AS total_sales
      FROM orders
      WHERE created_at::date BETWEEN CURRENT_DATE - INTERVAL '59 days' AND CURRENT_DATE - INTERVAL '30 days'
    )
    SELECT
      CASE
        WHEN previous_month.total_sales = 0 THEN NULL
        ELSE ROUND(((current_month.total_sales - previous_month.total_sales) / previous_month.total_sales) * 100, 2)
      END AS trend_percent
    FROM current_month, previous_month;
  `; */

  const monthlyTrendQuery = `
  WITH current_month AS (
    SELECT COALESCE(SUM(total_price), 0) AS total_sales
    FROM orders
    WHERE created_at::date BETWEEN CURRENT_DATE - INTERVAL '29 days' AND CURRENT_DATE
),
previous_month AS (
    SELECT COALESCE(SUM(total_price), 0) AS total_sales
    FROM orders
    WHERE created_at::date BETWEEN CURRENT_DATE - INTERVAL '59 days' AND CURRENT_DATE - INTERVAL '30 days'
)
SELECT
    ROUND(
        CASE
            WHEN previous_month.total_sales = 0 AND current_month.total_sales = 0 THEN 0
            WHEN previous_month.total_sales = 0 THEN 100
            ELSE ((current_month.total_sales - previous_month.total_sales) / previous_month.total_sales) * 100
        END
    , 2) AS trend_percent
FROM current_month, previous_month;
  `;

  const monthlyTotalQuery = `
    SELECT
      COALESCE(SUM(total_price), 0) AS total_sales
    FROM orders
    WHERE created_at::date BETWEEN CURRENT_DATE - INTERVAL '29 days' AND CURRENT_DATE;
  `;

  const monthlySalesResult = await query(monthlySalesQuery);
  const monthlyTrendResult = await query(monthlyTrendQuery);
  const monthlyTotalResult = await query(monthlyTotalQuery);

  return {
    monthlySales: monthlySalesResult.rows,
    trend: monthlyTrendResult.rows[0].trend_percent,
    totalSales: monthlyTotalResult.rows[0],
  };
};

export const getYearlySalesService = async () => {
  const yearlySalesQuery = `
    SELECT
      to_char(month::date, 'YYYY-MM') AS sales_month,
      COUNT(o.id) AS order_count,
      COALESCE(SUM(o.total_price), 0) AS total_sales
    FROM
      generate_series(
        date_trunc('month', CURRENT_DATE) - INTERVAL '11 months',
        date_trunc('month', CURRENT_DATE),
        INTERVAL '1 month'
      ) AS month
    LEFT JOIN orders o
      ON date_trunc('month', o.created_at) = month
    GROUP BY month
    ORDER BY sales_month;
  `;

  /* const yearlyTrendQuery = `
    WITH current_year AS (
      SELECT COALESCE(SUM(total_price), 0) AS total_sales
      FROM orders
      WHERE created_at::date BETWEEN CURRENT_DATE - INTERVAL '1 year' + INTERVAL '1 day' AND CURRENT_DATE
    ),
    previous_year AS (
      SELECT COALESCE(SUM(total_price), 0) AS total_sales
      FROM orders
      WHERE created_at::date BETWEEN CURRENT_DATE - INTERVAL '2 years' + INTERVAL '1 day' AND CURRENT_DATE - INTERVAL '1 year'
    )
    SELECT
      CASE
        WHEN previous_year.total_sales = 0 THEN NULL
        ELSE ROUND(((current_year.total_sales - previous_year.total_sales) / previous_year.total_sales) * 100, 2)
      END AS trend_percent
    FROM current_year, previous_year;
  `; */

  const yearlyTrendQuery = `
    WITH current_year AS (
    SELECT COALESCE(SUM(total_price), 0) AS total_sales
    FROM orders
    WHERE created_at::date BETWEEN CURRENT_DATE - INTERVAL '1 year' + INTERVAL '1 day' AND CURRENT_DATE
),
previous_year AS (
    SELECT COALESCE(SUM(total_price), 0) AS total_sales
    FROM orders
    WHERE created_at::date BETWEEN CURRENT_DATE - INTERVAL '2 years' + INTERVAL '1 day' 
                                AND CURRENT_DATE - INTERVAL '1 year'
)
SELECT
    ROUND(
        CASE
            WHEN previous_year.total_sales = 0 AND current_year.total_sales = 0 THEN 0
            WHEN previous_year.total_sales = 0 THEN 100
            ELSE ((current_year.total_sales - previous_year.total_sales) / previous_year.total_sales) * 100
        END
    , 2) AS trend_percent
FROM current_year, previous_year;
  `;


  const yearlyTotalQuery = `
    SELECT
      COALESCE(SUM(total_price), 0) AS total_sales
    FROM orders
    WHERE created_at::date BETWEEN CURRENT_DATE - INTERVAL '1 year' + INTERVAL '1 day' AND CURRENT_DATE;
  `;

  const yearlySalesResult = await query(yearlySalesQuery);
  const yearlyTrendResult = await query(yearlyTrendQuery);
  const yearlyTotalResult = await query(yearlyTotalQuery);

  return {
    yearlySales: yearlySalesResult.rows,
    trend: yearlyTrendResult.rows[0].trend_percent,
    totalSales: yearlyTotalResult.rows[0],
  };
};

export const getTopProductsService = async (limit = 5) => {
  const queryTxt = `SELECT p.name, p.price,
  SUM(oi.quantity) AS total_quantity,
  SUM(oi.quantity * oi.unit_price) AS total_revenue
  FROM order_items oi
  JOIN products p ON oi.product_id = p.id
  GROUP BY p.id
  ORDER BY total_revenue DESC
  LIMIT $1;`;
  const values = [limit];
  const result = await query(queryTxt, values);
  return result.rows;
};

export const getBestSellingProductsService = async () => {
  const totalQuery = `
  SELECT 
    p.id,
    p.name, 
    p.price,
    SUM(oi.quantity) AS total_quantity,
    SUM(oi.quantity * oi.unit_price) AS total_revenue
  FROM order_items oi
  JOIN orders o ON o.id = oi.order_id
  JOIN products p ON p.id = oi.product_id
  WHERE o.created_at >= CURRENT_DATE - INTERVAL '30 days'
  GROUP BY p.id
  ORDER BY total_revenue DESC
  LIMIT 10;
`;

  const dailyQuery = `
  SELECT 
  p.id,
  day::date AS sales_date,
  COALESCE(SUM(CASE 
    WHEN o.created_at::date = day::date THEN oi.quantity * oi.unit_price 
    ELSE 0 END), 0) AS daily_revenue
  FROM
    generate_series(
      CURRENT_DATE - INTERVAL '29 days',
      CURRENT_DATE,
      INTERVAL '1 day'
    ) AS day
  CROSS JOIN products p
  LEFT JOIN order_items oi ON oi.product_id = p.id
  LEFT JOIN orders o ON o.id = oi.order_id
  GROUP BY p.id, day
  ORDER BY p.id, sales_date;
`;

  const totalRes = await query(totalQuery);
  const dailyRes = await query(dailyQuery);

  // Map daily revenue by product ID
  const dailyMap = {};
  dailyRes.rows.forEach((row) => {
    if (!dailyMap[row.id]) dailyMap[row.id] = [];
    dailyMap[row.id].push(parseFloat(row.daily_revenue));
  });

  // Merge both datasets
  const result = totalRes.rows.map((product) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    total_units_sold: product.total_quantity,
    total_revenue: product.total_revenue,
    daily_revenue_for_last_30_days: dailyMap[product.id] || Array(30).fill(0),
  }));

  return result;
};

export const getSalesStatsByDateRangeService = async (startDate, endDate) => {
  const queryTxt = `
    SELECT 
      COUNT(*) AS order_count,
      COALESCE(SUM(total_price), 0) AS total_sales
    FROM orders
    WHERE created_at BETWEEN $1 AND $2;
  `;
  const values = [startDate, endDate];
  const result = await query(queryTxt, values);
  return result.rows[0];
};

export const getAllTimeOrderStatsService = async () => {
  const queryTxt = `
    SELECT 
      COUNT(*) AS order_count,
      COALESCE(SUM(total_price), 0) AS total_revenue
    FROM orders;
  `;
  const result = await query(queryTxt);
  return result.rows[0];
};
