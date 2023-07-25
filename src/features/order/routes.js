import { Router } from "express";
import { createOrder, deleteOrder, getOrder, getOrders, updateOrder } from "./controller.js";
import { verifyToken } from "../../middlewares/auth.js";
import { createOrderSchema, validate } from "../../validators/order.js";

const router = Router();

router.get("/", verifyToken, getOrders);
router.get("/:id", verifyToken, getOrder);
router.post(
  "/",
  verifyToken,
  async (req, res, next) => {
    try {
      await validate(createOrderSchema, req.body);
      next();
    } catch (err) {
      res.status(err.status).json({
        message: err.message,
        errors: err.errors,
      });
    }
  },
  createOrder,
);
router.put("/:id", verifyToken, updateOrder);
router.delete("/:id", verifyToken, deleteOrder);

export default router;
