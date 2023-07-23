import { Router } from "express";
import { createCategory, getCategories, getCategory } from "./controller.js";
import {
  createCategorySchema,
  updateCategorySchema,
  validate,
} from "../../validators/category.js";
import { isAdmin, verifyToken } from "../../middlewares/auth.js";

const router = Router();

router.get("/", verifyToken, getCategories);
router.get("/:id", verifyToken, getCategory);
router.post(
  "/",
  async (req, res, next) => {
    try {
      await validate(createCategorySchema, req.body);
      next();
    } catch (err) {
      res.status(err.status).json({ message: err.message, errors: err.errors });
    }
  },
  isAdmin,
  createCategory,
);
router.put("/:id", async (req, res, next) => {
  try {
    await validate(updateCategorySchema, req.body);
    next();
  } catch (err) {
    res.status(err.status).json({ message: err.message, errors: err.errors });
  }
});
router.delete("/:id", isAdmin);

export default router;
