import { Router } from "express";
import { verifyUser, verifyAdmin } from "../../midlewares/token.verify.js";

import * as products from "./index.js";

const router = Router();

router.post("/products", verifyAdmin, products.createProduct);
router.get("/products", verifyUser, products.getAllProducts);
router.get("/products/:id", verifyUser, products.getProductById);
router.patch("/products/:id", verifyAdmin, products.updateProduct);
router.delete("/products/:id", verifyAdmin, products.deleteProduct);

export default router;
