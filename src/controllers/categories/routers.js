import { Router } from "express";
import { verifyUser, verifyAdmin } from "../../midlewares/token.verify.js";

import * as categories from "./index.js";

const router = Router();

router.post("/categories", verifyAdmin, categories.createCategory);
router.get("/categories", categories.getAllCategories);
router.get("/categories/:id", verifyAdmin, categories.getCategoryById);
router.patch("/categories/:id", verifyAdmin, categories.updateCategory);
router.delete("/categories/:id", verifyAdmin, categories.deleteCategory);

export default router;
