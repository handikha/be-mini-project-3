import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import authRoutes from "./features/auth/routes.js";
import productRoutes from "./features/product/routes.js";
import categoryRoutes from "./features/category/routes.js";
import orderRoutes from "./features/order/routes.js";
import orderItemRoutes from "./features/orderItem/routes.js";

import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors({ exposedHeaders: "Authorization" }));
app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/order-items", orderItemRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the POS API" });
});

// Default error handler
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500);
  res.json({ error: err.message });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

export default app;
