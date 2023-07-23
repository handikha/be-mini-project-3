import { Router } from "express";
import {
  createOrderItem,
  deleteOrderItem,
  getOrderItem,
  getOrderItems,
  updateOrderItem,
} from "./controller.js";
import { verifyToken } from "../../middlewares/auth.js";
import {
  createOrderItemSchema,
  updateOrderItemSchema,
  validate,
} from "../../validators/orderItem.js";

const router = Router();

router.get("/", verifyToken, getOrderItems);
router.get("/:id", verifyToken, getOrderItem);
router.post(
  "/",
  verifyToken,
  async (req, res, next) => {
    try {
      await validate(createOrderItemSchema, req.body);
      next();
    } catch (err) {
      res.status(err.status).json({ message: err.message, errors: err.errors });
    }
  },
  createOrderItem,
);
router.put(
  "/:id",
  verifyToken,
  async (req, res, next) => {
    try {
      await validate(updateOrderItemSchema, req.body);
      next();
    } catch (err) {
      res.status(err.status).json({ message: err.message, errors: err.errors });
    }
  },
  updateOrderItem,
);
router.delete("/:id", verifyToken, deleteOrderItem);

export default router;
