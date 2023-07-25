import { finalizeTransaction, getTransactions } from "./controller.js";
import { Router } from "express";
import { verifyToken } from "../../middlewares/auth.js";

const router = Router();

router.post("/:id", verifyToken, finalizeTransaction);
router.get("/:id", verifyToken, getTransactions);

export default router;

// 1. create order -> orderId, customerName, table
// 2. create orderItem -> orderId, productId, quantity, price
// 3. create orderITem -> orderId, productId, quantity, price
