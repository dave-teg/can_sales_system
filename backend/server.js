import "dotenv/config";
import express from "express";
import "./db/db.js";
import cors from "cors";
import path from "path";
import open from "open";
import { fileURLToPath } from "url";
import corsOptions from "./src/config/corsOptions.js";
import cookieParser from "cookie-parser";
import { logger } from "./src/middleware/logger.js";
import errorHandler from "./src/middleware/errorHandler.js";
import authRouter from "./src/routes/authRoute.js";
import userRouter from "./src/routes/userRoute.js";
import productRouter from "./src/routes/productRoute.js";
import categoryRouter from "./src/routes/categoryRoute.js";
import orderRouter from "./src/routes/orderRoute.js";
import analyticsRouter from "./src/routes/analyticsRoute.js";
import printRouter from "./src/routes/printerRoute.js";
import waiterRouter from "./src/routes/waiterRoute.js";

const app = express();
const port = process.env.PORT || 3500;

const currentFile = fileURLToPath(import.meta.url);
const dirname = path.dirname(currentFile);

//middleware
app.use(logger); //custom middleware to log request
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

//routes

// Simple route to check if the server is running
app.get("/", (req, res) => {
  res.json({ message: "API is running..." });
});

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/orders", orderRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/print", printRouter);
app.use("/api/waiters", waiterRouter);

// Serve frontend
app.use(express.static(path.join(dirname, "../frontend/dist")));

// API 404 handler
app.use(/^\/api\/.*/, (req, res) => {
  res.status(404).json({ message: "API endpoint not found" });
});

// Frontend catch-all
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(dirname, "../frontend/dist/index.html"));
});

//global error handler
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);

  open(`http://localhost:5173`);
});
