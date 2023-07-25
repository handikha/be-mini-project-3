import { Router } from "express";
import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from "./controller.js";
import { isAdmin, verifyToken } from "../../middlewares/auth.js";
import { createProductSchema, updateProductSchema, validate } from "../../validators/product.js";

const router = Router();

router.get("/", verifyToken, getProducts);
router.get("/:id", verifyToken, getProduct);
router.post(
  "/",
  async (req, res, next) => {
    try {
      await validate(createProductSchema, req.body);
      next();
    } catch (err) {
      res.status(err.status).json({
        message: err.message,
        errors: err.errors,
      });
    }
  },
  isAdmin,
  createProduct,
);
router.put(
  "/:id",
  async (req, res, next) => {
    try {
      await validate(updateProductSchema, req.body);
      next();
    } catch (err) {
      res.status(err.status).json({
        message: err.message,
        errors: err.errors,
      });
    }
  },
  isAdmin,
  updateProduct,
);
router.delete("/:id", isAdmin, deleteProduct);

export default router;
