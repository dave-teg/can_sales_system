import { Pool } from "pg";
import "dotenv/config";
import { logEvents } from "../src/middleware/logger.js";

export const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
  password: process.env.PGPASSWORD,
  ssl: {
    rejectUnauthorized: false,  // Required for Neon's free tier
  }
});

export const query = async (text, params) => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  const logMsg = `Query: ${text}\tParams: ${params}\tDuration: ${duration}ms\t${res.rowCount} rows returned\n\n`;
  logEvents(logMsg, "DbQuery.log");
  return res;
};

try {
  await pool.query("SELECT 1");
  console.log("Database connected successfully");
} catch (err) {
  console.log("Error connecting to database", err);
}

pool.on("error", (error) => {
  console.log("Unexpected error on idle client", error);
});
