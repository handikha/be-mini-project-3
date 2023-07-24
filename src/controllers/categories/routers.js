import { Router } from "express";
import { verifyUser, verifyAdmin } from "../../midlewares/token.verify.js";

import * as categories from "./index.js";

const router = Router();

router.post("/categories", categories.createCategory);
router.get("/categories", categories.getAllCategories); // not verifyAdmin
router.get("/categories/:id", categories.getCategoryById);
router.patch("/categories/:id", categories.updateCategory);
router.delete("/categories/:id", categories.deleteCategory);

export default router;
